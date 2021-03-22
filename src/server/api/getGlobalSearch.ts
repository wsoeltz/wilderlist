/* tslint:disable:await-promise */
const { point } = require('@turf/helpers');
const distance = require('@turf/distance');
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import groupBy from 'lodash/groupBy';
import intersection from 'lodash/intersection';
import orderBy from 'lodash/orderBy';
import {
  Campsite as ICampsite,
  CampsiteType,
  Mountain as IMountain,
  PeakList as IPeakList,
  Trail as ITrail,
  TrailType,
} from '../graphql/graphQLTypes';
import {
  buildNearSphereQuery,
} from '../graphql/schema/geospatial/utils';
import { Campsite } from '../graphql/schema/queryTypes/campsiteType';
import { Mountain } from '../graphql/schema/queryTypes/mountainType';
import { PeakList } from '../graphql/schema/queryTypes/peakListType';
import { Trail } from '../graphql/schema/queryTypes/trailType';
import {asyncForEach} from '../graphql/Utils';

const cacheGeoCode: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getGeoCode = axios.create({
  adapter: cacheGeoCode.adapter,
});

enum SearchResultType {
  mountain = 'mountain',
  trail = 'trail',
  campsite = 'campsite',
  list = 'list',
  geolocation = 'geolocation',
}

interface Input {
  lat: number;
  lng: number;
  search: string;
  favor: SearchResultType | undefined;
}

const mergeAndSort = async (
  mountainData: any[], listData: any[], trailData: any[], campsiteData: any[]) => {
    const trailsAsNamedParent: any[] = [];
    await asyncForEach(trailData, async (trail: any) => {
      if (trail.parents) {
        const namedParent = await Trail.findOne(
          {_id: {$in: trail.parents}, name: {$eq: trail.name}},
        );
        if (namedParent) {
          trailsAsNamedParent.push({
            ...trail,
            id: namedParent._id,
            parents: [],
            locationText: namedParent.locationText,
            trailLength: namedParent.trailLength,
          });
        } else {
          trailsAsNamedParent.push(trail);
        }
      } else {
        trailsAsNamedParent.push(trail);
      }
    });
    return orderBy([...mountainData, ...listData, ...trailsAsNamedParent, ...campsiteData], ['priority', 'distance']);
  };

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
  const {favor} = input;
  const sourcePoint = point([input.lng, input.lat]);

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
      if (
          (
            Number(Boolean(mountainsFetched)) +
            Number(Boolean(listsFetched)) +
            Number(Boolean(campsitesFetched)) +
            Number(Boolean(trailsFetched))
            >= 3 && (
              (favor !== SearchResultType.mountain &&
                favor !== SearchResultType.trail && favor !== SearchResultType.campsite &&
                favor !== SearchResultType.list && favor !== SearchResultType.geolocation
              ) ||
              (favor === SearchResultType.mountain && mountainsFetched) ||
              (favor === SearchResultType.trail && trailsFetched) ||
              (favor === SearchResultType.campsite && campsitesFetched) ||
              (favor === SearchResultType.list && listsFetched)
            )
          ) || (
            (favor === SearchResultType.mountain && mountainsFetched) ||
            (favor === SearchResultType.trail && trailsFetched) ||
            (favor === SearchResultType.campsite && campsitesFetched) ||
            (favor === SearchResultType.list && listsFetched)
          )
        ) {
        mergeAndSort(mountainData, listData, trailData, campsiteData).then(resolve).catch(reject);
      }
    }, 500);

    const optimizedTrailSearchText = input.search.toLowerCase()
      .replace(/trail/g, '')
      .replace(/path/g, '')
      .replace(/road/g, '');
    Trail.find(
      {
        center: {
          $geoWithin: {
            $centerSphere: [ [ input.lng, input.lat ], 1500 / 3963.2 * (favor === SearchResultType.trail ? 1.75 : 1) ],
          },
        },
        $text: { $search: `\"${optimizedTrailSearchText}\"` },
      },
      { score: { $meta: 'textScore' } },
    )
    .sort( { score: { $meta: 'textScore' } } )
    .limit(50).then(res => {
      res.forEach(trail => {
        const parents = trail.parents ? trail.parents.map(p => (p as unknown as string).toString()) : [];
        const name = trail.name;
        const dist = distance(point(trail.center), sourcePoint, {units: 'miles'});
        trailData.push({
          id: trail._id,
          linkedParent: trail._id,
          name,
          groupKey: name ? name + Math.floor(dist / 10) * 10 : trail._id,
          type: 'trail',
          distance: dist,
          coordinates: trail.center,
          locationText: trail.locationText,
          parents,
          trailType: trail.type,
          trailLength: trail.trailLength,
          priority: trailPriority(trail) * (favor === SearchResultType.trail ? 0.5 : 2),
        });
      });
      const filteredTrails: any[] = [];
      const groupedTrails = groupBy(trailData, 'groupKey');
      for (const group in groupedTrails) {
        if (groupedTrails.hasOwnProperty(group)) {
          const sortedGroup = orderBy(groupedTrails[group], ['distance']);
          const parent = intersection(...sortedGroup.map(t => t.parents));
          if (parent.length && !filteredTrails.find(t => t.linkedParent.toString() === (parent[0] as any).toString())) {
            filteredTrails.push({
              ...sortedGroup[0],
              linkedParent: parent[0],
            });
          } else if (!filteredTrails.find(t => t.linkedParent.toString() === (parent[0] as any))) {
            filteredTrails.push(sortedGroup[0]);
          }
        }
      }
      trailData = orderBy(filteredTrails, ['priority', 'distance']).slice(0, 7);
      trailsFetched = true;
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        mergeAndSort(mountainData, listData, trailData, campsiteData).then(resolve).catch(reject);
      }
    }).catch(reject);

    Mountain.find({...buildNearSphereQuery({
      locationField: 'location',
      longitude: input.lng,
      latitude: input.lat,
      maxDistance: 1514016 * (favor === SearchResultType.mountain ? 1.75 : 1),
    }), name: { $regex: input.search, $options: 'i' }})
    .limit(10).then(res => {
      mountainData = res.map(mtn => {
        return {
          id: mtn._id,
          name: mtn.name,
          type: 'mountain',
          elevation: mtn.elevation,
          distance: distance(point(mtn.location), sourcePoint, {units: 'miles'}),
          coordinates: mtn.location,
          locationText: mtn.locationText,
          priority: mountainPriority(mtn) * (favor === SearchResultType.mountain ? 0.5 : 2),
        };
      });
      mountainsFetched = true;
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        mergeAndSort(mountainData, listData, trailData, campsiteData).then(resolve).catch(reject);
      }
    }).catch(reject);

    Campsite.find({...buildNearSphereQuery({
      locationField: 'location',
      longitude: input.lng,
      latitude: input.lat,
      maxDistance: 914016 * (favor === SearchResultType.campsite ? 1.75 : 1),
    }), name: { $regex: input.search, $options: 'i' }})
    .limit(10).then(res => {
      campsiteData = res.map(campsite => {
        return {
          id: campsite._id,
          name: campsite.name,
          type: 'campsite',
          campsiteType: campsite.type,
          distance: distance(point(campsite.location), sourcePoint, {units: 'miles'}),
          coordinates: campsite.location,
          locationText: campsite.locationText,
          priority: campsitePriority(campsite) * (favor === SearchResultType.campsite ? 0.5 : 2),
        };
      });
      campsitesFetched = true;
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        mergeAndSort(mountainData, listData, trailData, campsiteData).then(resolve).catch(reject);
      }
    }).catch(reject);

    PeakList.find({...buildNearSphereQuery({
      locationField: 'center',
      longitude: input.lng,
      latitude: input.lat,
      maxDistance: 4814016 * (favor === SearchResultType.list ? 1.75 : 1),
    }), searchString: { $regex: input.search, $options: 'i' }}).limit(15).then(res => {
      listData = res.map(list => {
        return {
          id: list._id,
          name: list.name,
          type: 'list',
          numPeaks: list.mountains.length,
          numTrails: list.trails.length,
          numCampsites: list.campsites.length,
          distance: distance(point(list.center), sourcePoint, {units: 'miles'}),
          coordinates: list.center,
          locationText: list.locationText,
          priority: listPriority(list) * (favor === SearchResultType.list ? 0.5 : 2),
        };
      });
      listsFetched = true;
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        mergeAndSort(mountainData, listData, trailData, campsiteData).then(resolve).catch(reject);
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
    if (values.length < 7) {
      const geoResults = await mapboxGeocode(input) as any[];
      return [...values, ...geoResults].slice(0, 7);
    }
    return values.slice(0, 7);
  } catch (err) {
    console.error(err);
  }
};

export default getGlobalSearch;
