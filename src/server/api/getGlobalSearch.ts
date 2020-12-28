const { point } = require('@turf/helpers');
const distance = require('@turf/distance');

import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import orderBy from 'lodash/orderBy';
import {
  Campsite as ICampsite,
  CampsiteType,
  Mountain as IMountain,
  PeakList as IPeakList,
  State as IState,
  Trail as ITrail,
  TrailType,
} from '../graphql/graphQLTypes';
import {
  buildNearSphereQuery,
} from '../graphql/schema/geospatial/utils';
import { Campsite } from '../graphql/schema/queryTypes/campsiteType';
import { Mountain } from '../graphql/schema/queryTypes/mountainType';
import { PeakList } from '../graphql/schema/queryTypes/peakListType';
import { State } from '../graphql/schema/queryTypes/stateType';
import { Trail } from '../graphql/schema/queryTypes/trailType';
import groupBy from 'lodash/groupBy';

const cacheGeoCode: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getGeoCode = axios.create({
  adapter: cacheGeoCode.adapter,
});

interface Input {
  lat: number;
  lng: number;
  search: string;
}

const mergeAndSort = (
  mountainData: any[], listData: any[], trailData: any[], campsiteData: any[], stateData: IState[]) =>
(
  orderBy([...mountainData, ...listData, ...trailData, ...campsiteData], ['priority', 'distance']).map(val => {
    return {
      ...val,
      stateText: val.stateText.map((id: string) => {
        const state = stateData.find((s) => s._id.toString() === id.toString());
        if (state) {
          return state.name;
        } else {
          return undefined;
        }
      }).filter((v: string | null) => v),
    };
  })
);

const trailPriority = (trail: ITrail) => {
  if (trail.type === TrailType.dirtroad || trail.type === TrailType.road) {
    return 4;
  }
  return 3;
};

const campsitePriority = (campsite: ICampsite) => {
  if (campsite.type === CampsiteType.campPitch ||
      campsite.type === CampsiteType.rockShelter ||
      campsite.type === CampsiteType.basicHut
      ) {
    return 3;
  }
  return 1;
};

const mountainPriority = (mountain: IMountain) => {
  if (mountain.lists.length && mountain.trailAccessible) {
    return 1;
  }
  if (mountain.lists.length || mountain.trailAccessible) {
    return 2;
  }
  return 3;
};

const listPriority = (list: IPeakList) => {
  if (list.users.length && list.users.length > 15) {
    return 1;
  }
  if (list.users.length) {
    return 2;
  }
  return 3;
};

const fetchValuesAsync = (input: Input) => {
  const sourcePoint = point([input.lng, input.lat]);
  const stateIds: string[] = [];

  return new Promise((resolve, reject) => {
    let trailsFetched: boolean = false;
    let trailData: any[] = [];
    let mountainsFetched: boolean = false;
    let mountainData: any[] = [];
    let listsFetched: boolean = false;
    let listData: any[] = [];
    let campsitesFetched: boolean = false;
    let campsiteData: any[] = [];

    setTimeout(() => {
      if (mountainsFetched && (listsFetched || campsitesFetched) || (listsFetched && campsitesFetched)) {
        State.find({_id: {$in: stateIds}}).then(res => {
          resolve(mergeAndSort(mountainData, listData, trailData, campsiteData, res));
        }).catch(reject);
      }
    }, 700);

    const optimizedTrailSearchText = input.search.toLowerCase()
      .replace(/trail/g, '')
      .replace(/path/g, '')
      .replace(/road/g, '');
    Trail.find(
      {
        center: {
          $geoWithin: { $centerSphere: [ [ input.lng, input.lat ], 1500 / 3963.2 ] },
        },
        $text: { $search: `\"${optimizedTrailSearchText}\"` },
      },
      { score: { $meta: 'textScore' } },
    )
    .sort( { score: { $meta: 'textScore' } } )
    .limit(30).then(res => {
      res.forEach(trail => {
        const parents = trail.parents ? trail.parents.map(p => (p as unknown as string).toString()) : [];
        const states = trail.states ? trail.states.map(s => s as unknown as string) : [];
        states.forEach(stateId => {
          if (!stateIds.includes(stateId.toString())) {
            stateIds.push(stateId.toString());
          }
        });
        trailData.push({
          name: trail.name,
          type: 'trail',
          distance: distance(point(trail.center), sourcePoint, {units: 'miles'}),
          coordinates: trail.center,
          stateText: states,
          parents,
          trailType: trail.type,
          priority: trailPriority(trail),
        });
      });
      const filteredTrails = [];
      const groupedTrails = groupBy(trailData, ['name']);
      for (let group in groupedTrails) {
        const sortedGroup = orderBy(groupedTrails[group], ['distance']);
        filteredTrails.push(sortedGroup[0]);
      }
      trailData = orderBy(filteredTrails, ['priority', 'distance']).slice(0, 7);
      trailsFetched = true;
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        State.find({_id: {$in: stateIds}}).then(stateRes => {
          resolve(mergeAndSort(mountainData, listData, trailData, campsiteData, stateRes));
        }).catch(reject);
      }
    }).catch(reject);

    Mountain.find({...buildNearSphereQuery({
      locationField: 'location',
      longitude: input.lng,
      latitude: input.lat,
      maxDistance: 1514016,
    }), name: { $regex: input.search, $options: 'i' }})
    .limit(10).then(res => {
      mountainData = res.map(mtn => {
        const stateId = mtn.state as unknown as string;
        if (!stateIds.includes(stateId.toString())) {
          stateIds.push(stateId.toString());
        }
        return {
          id: mtn._id,
          name: mtn.name,
          type: 'mountain',
          elevation: mtn.elevation,
          distance: distance(point(mtn.location), sourcePoint, {units: 'miles'}),
          coordinates: mtn.location,
          stateText: [stateId],
          priority: mountainPriority(mtn),
        };
      });
      mountainsFetched = true;
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        State.find({_id: {$in: stateIds}}).then(stateRes => {
          resolve(mergeAndSort(mountainData, listData, trailData, campsiteData, stateRes));
        }).catch(reject);
      }
    }).catch(reject);

    Campsite.find({...buildNearSphereQuery({
      locationField: 'location',
      longitude: input.lng,
      latitude: input.lat,
      maxDistance: 914016,
    }), name: { $regex: input.search, $options: 'i' }})
    .limit(10).then(res => {
      campsiteData = res.map(campsite => {
        const stateId = campsite.state as unknown as string;
        if (!stateIds.includes(stateId.toString())) {
          stateIds.push(stateId.toString());
        }
        return {
          id: campsite._id,
          name: campsite.name,
          type: 'campsite',
          campsiteType: campsite.type,
          distance: distance(point(campsite.location), sourcePoint, {units: 'miles'}),
          coordinates: campsite.location,
          stateText: [stateId],
          priority: campsitePriority(campsite),
        };
      });
      campsitesFetched = true;
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        State.find({_id: {$in: stateIds}}).then(stateRes => {
          resolve(mergeAndSort(mountainData, listData, trailData, campsiteData, stateRes));
        }).catch(reject);
      }
    }).catch(reject);

    PeakList.find({...buildNearSphereQuery({
      locationField: 'center',
      longitude: input.lng,
      latitude: input.lat,
      maxDistance: 4814016,
    }), searchString: { $regex: input.search, $options: 'i' }}).limit(15).then(res => {
      listData = res.map(list => {
        const states = list.states ? list.states.map(s => s as unknown as string) : [];
        states.forEach(stateId => {
          if (!stateIds.includes(stateId.toString())) {
            stateIds.push(stateId.toString());
          }
        });
        return {
          id: list._id,
          name: list.name,
          type: 'list',
          numPeaks: list.mountains.length,
          distance: distance(point(list.center), sourcePoint, {units: 'miles'}),
          coordinates: list.center,
          stateText: states,
          priority: listPriority(list),
        };
      });
      listsFetched = true;
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        State.find({_id: {$in: stateIds}}).then(stateRes => {
          resolve(mergeAndSort(mountainData, listData, trailData, campsiteData, stateRes));
        }).catch(reject);
      }
    }).catch(reject);

  });
};

const mapboxGeocode = async (input: Input) => {
  try {
    const url = encodeURI(`https://api.mapbox.com/geocoding/v5/mapbox.places/${
      input.search
    }.json?country=US&proximity=${
      Math.round(input.lng)
    },${
      Math.round(input.lat)
    }&autocomplete&limit=5&access_token=${
      process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    }`);
    const geoCodeRes = await getGeoCode(url) as any;
    const sourcePoint = point([input.lng, input.lat]);
    return geoCodeRes.data.features.map((f: any) => ({
      name: f.text,
      type: 'geolocation',
      locationName: f.place_name.startsWith(f.text + ',')
        ? f.place_name.replace(f.text + ',', '').trim() : f.place_name,
      distance: distance(point(f.center), sourcePoint, {units: 'miles'}),
      coordinates: f.center,
      bbox: f.bbox,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getGlobalSearch = async (input: Input) => {
  try {
    const values = await fetchValuesAsync(input) as any[];
    if (values.length < 5) {
      const geoResults = await mapboxGeocode(input) as any[];
      return [...values, ...geoResults].slice(0, 5);
    }
    return values.slice(0, 5);
  } catch (err) {
    console.error(err);
  }
};

export default getGlobalSearch;
