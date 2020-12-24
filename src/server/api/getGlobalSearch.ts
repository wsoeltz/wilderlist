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
const { point } = require('@turf/helpers');
const distance = require('@turf/distance');
import intersection from 'lodash/intersection';
import orderBy from 'lodash/orderBy';

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
      }),
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
      if (mountainsFetched || listsFetched || trailsFetched || campsitesFetched) {
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
      trailsFetched = true;
      res.forEach(trail => {
        const parents = trail.parents ? trail.parents.map(p => (p as unknown as string).toString()) : [];
        if (!trailData.find(
          (t: any) => t.name === trail.name && parents.length && t.parents.length &&
                      intersection(parents, t.parents).length)
        ) {
          const states = trail.states ? trail.states.map(s => s as unknown as string) : [];
          states.forEach(stateId => {
            if (!stateIds.includes(stateId)) {
              stateIds.push(stateId);
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
        }
      });
      trailData = orderBy(trailData, ['priority', 'distance']).slice(0, 7);
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        State.find({_id: {$in: stateIds}}).then(stateRes => {
          resolve(mergeAndSort(mountainData, listData, trailData, campsiteData, stateRes));
        }).catch(reject);
      }
    }).catch(reject);

    Mountain.find(
      {
        location: {
          $geoWithin: { $centerSphere: [ [ input.lng, input.lat ], 2500 / 3963.2 ] },
        },
        $text: { $search: `\"${input.search}\"` },
      },
      { score: { $meta: 'textScore' } },
    )
    .sort( { score: { $meta: 'textScore' } } )
    .limit(30).then(res => {
      mountainsFetched = true;
      mountainData = res.map(mtn => {
        const stateId = mtn.state as unknown as string;
        if (!stateIds.includes(stateId)) {
          stateIds.push(stateId);
        }
        return {
          name: mtn.name,
          type: 'mountain',
          elevation: mtn.elevation,
          distance: distance(point(mtn.location), sourcePoint, {units: 'miles'}),
          coordinates: mtn.location,
          stateText: [stateId],
          priority: mountainPriority(mtn),
        };
      });
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        State.find({_id: {$in: stateIds}}).then(stateRes => {
          resolve(mergeAndSort(mountainData, listData, trailData, campsiteData, stateRes));
        }).catch(reject);
      }
    }).catch(reject);

    Campsite.find(
      {
        location: {
          $geoWithin: { $centerSphere: [ [ input.lng, input.lat ], 2500 / 3963.2 ] },
        },
        $text: { $search: `\"${input.search}\"` },
      },
      { score: { $meta: 'textScore' } },
    )
    .sort( { score: { $meta: 'textScore' } } )
    .limit(30).then(res => {
      campsitesFetched = true;
      campsiteData = res.map(campsite => {
        const stateId = campsite.state as unknown as string;
        if (!stateIds.includes(stateId)) {
          stateIds.push(stateId);
        }
        return {
          name: campsite.name,
          type: 'campsite',
          campsiteType: campsite.type,
          distance: distance(point(campsite.location), sourcePoint, {units: 'miles'}),
          coordinates: campsite.location,
          stateText: [stateId],
          priority: campsitePriority(campsite),
        };
      });
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
      listsFetched = true;
      listData = res.map(list => {
        const states = list.states ? list.states.map(s => s as unknown as string) : [];
        states.forEach(stateId => {
          if (!stateIds.includes(stateId)) {
            stateIds.push(stateId);
          }
        });
        return {
          name: list.name,
          type: 'list',
          numPeaks: list.mountains.length,
          distance: distance(point(list.center), sourcePoint, {units: 'miles'}),
          coordinates: list.center,
          stateText: states,
          priority: listPriority(list),
        };
      });
      if (mountainsFetched === true && listsFetched === true && trailsFetched && campsitesFetched) {
        State.find({_id: {$in: stateIds}}).then(stateRes => {
          resolve(mergeAndSort(mountainData, listData, trailData, campsiteData, stateRes));
        }).catch(reject);
      }
    }).catch(reject);

  });
};

const getGlobalSearch = async (input: Input) => {
  try {
    const values = await fetchValuesAsync(input);
    return {values};
  } catch (err) {
    console.error(err);
  }
};

export default getGlobalSearch;
