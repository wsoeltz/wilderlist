/* tslint:disable:await-promise */
const { point } = require('@turf/helpers');
const distance = require('@turf/distance');
import orderBy from 'lodash/orderBy';
import {State as IState} from '../graphql/graphQLTypes';
import {PeakList as IPeakList} from '../graphql/graphQLTypes';
import {
  buildNearSphereQuery,
} from '../graphql/schema/geospatial/utils';
import { PeakList } from '../graphql/schema/queryTypes/peakListType';
import { State } from '../graphql/schema/queryTypes/stateType';
interface Input {
  lat: number;
  lng: number;
  search: string;
  ignore: string[];
}

const listPriority = (list: IPeakList) => {
  if (list.users.length && list.users.length > 15) {
    return 1;
  }
  if (list.users.length) {
    return 2;
  }
  return 3;
};

const mergeAndSort = async (peakListData: any[], stateData: IState[]) => {
    return orderBy([...peakListData], ['distance'])
      .map(val => {
        const states = stateData.filter((s) => s._id.toString() === val.stateText.toString());
        const datum = {
          name: val.name,
          coordinates: val.coordinates,
          distance: val.distance,
          numPeaks: val.numPeaks,
          numTrails: val.numTrails,
          numCampsites: val.numCampsites,
          type: 'list',
          states: states ? states.map(state => ({
            id: state._id,
            name: state.name,
            abbreviation: state.abbreviation,
          })) : [],
          _id: val._id,
          id: val._id,
        };
        return {
          ...val,
          stateText: states ? states.map(s => s.name) : [],
          datum,
        };
    });
  };

const fetchValuesAsync = (input: Input) => {
  const sourcePoint = point([input.lng, input.lat]);
  const stateIds: string[] = [];

  return new Promise((resolve, reject) => {
    PeakList.find({
      ...buildNearSphereQuery({
        locationField: 'center',
        longitude: input.lng,
        latitude: input.lat,
        maxDistance: 4814016,
      }),
      searchString: { $regex: input.search, $options: 'i' },
      _id: { $nin: input.ignore},
    }).limit(15).then(res => {
      const peakListData = res.map(list => {
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
          numTrails: list.trails.length,
          numCampsites: list.campsites.length,
          distance: distance(point(list.center), sourcePoint, {units: 'miles'}),
          coordinates: list.center,
          stateText: states,
          priority: listPriority(list),
        };
      });
      State.find({_id: {$in: stateIds}}).then(stateRes => {
        mergeAndSort(peakListData, stateRes)
          .then(resolve).catch(reject);
      }).catch(reject);
    }).catch(reject);
  });
};

const getGlobalSearch = async (input: Input) => {
  try {
    const values = await fetchValuesAsync(input) as any[];
    return values;
  } catch (err) {
    console.error(err);
  }
};

export default getGlobalSearch;
