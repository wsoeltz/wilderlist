/* tslint:disable:await-promise */
const { point } = require('@turf/helpers');
const distance = require('@turf/distance');
import orderBy from 'lodash/orderBy';
import {State as IState} from '../graphql/graphQLTypes';
import {
  buildNearSphereQuery,
} from '../graphql/schema/geospatial/utils';
import { Campsite } from '../graphql/schema/queryTypes/campsiteType';
import { State } from '../graphql/schema/queryTypes/stateType';

interface Input {
  lat: number;
  lng: number;
  search: string;
  ignore: string[];
}

const mergeAndSort = async (campsiteData: any[], stateData: IState[]) => {
    return orderBy([...campsiteData], ['distance'])
      .map(val => {
        const state = stateData.find((s) => s._id.toString() === val.stateText.toString());
        const datum = {
          elevation: val.datum.elevation,
          location: val.datum.location,
          name: val.datum.name,
          state: state ? {
            id: state._id,
            name: state.name,
            abbreviation: state.abbreviation,
          } : null,
          type: val.datum.type,
          _id: val.datum._id,
          id: val.datum._id,
        };
        return {
          ...val,
          stateText: [state ? state.name : undefined],
          datum,
        };
    });
  };

const fetchValuesAsync = (input: Input) => {
  const sourcePoint = point([input.lng, input.lat]);
  const stateIds: string[] = [];

  return new Promise((resolve, reject) => {
    Campsite.find({
      ...buildNearSphereQuery({
        locationField: 'location',
        longitude: input.lng,
        latitude: input.lat,
        maxDistance: 3514016,
      }),
      name: { $regex: input.search, $options: 'i' },
      _id: { $nin: input.ignore},
    })
    .limit(10).then(res => {
      const campsiteData = res.map(campsite => {
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
          stateText: stateId,
          datum: campsite,
        };
      });
      State.find({_id: {$in: stateIds}}).then(stateRes => {
        mergeAndSort(campsiteData, stateRes)
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
