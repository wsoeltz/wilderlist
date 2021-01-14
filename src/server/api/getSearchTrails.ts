/* tslint:disable:await-promise */
const { point } = require('@turf/helpers');
const distance = require('@turf/distance');
import orderBy from 'lodash/orderBy';
import {State as IState} from '../graphql/graphQLTypes';
import { State } from '../graphql/schema/queryTypes/stateType';
import { Trail } from '../graphql/schema/queryTypes/trailType';

interface Input {
  lat: number;
  lng: number;
  search: string;
  ignore: string[];
}

const mergeAndSort = async (trailData: any[], stateData: IState[]) => {
    return orderBy([...trailData], ['distance'])
      .map(val => {
        const states = stateData.filter((s) => s._id.toString() === val.stateText.toString());
        const datum = {
          center: val.datum.center,
          name: val.datum.name,
          states: states ? states.map(state => ({
            id: state._id,
            name: state.name,
            abbreviation: state.abbreviation,
          })) : [],
          type: val.datum.type,
          line: val.datum.line,
          _id: val.datum._id,
          id: val.datum._id,
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
        _id: { $nin: input.ignore},
      },
      { score: { $meta: 'textScore' } },
    )
    .sort( { score: { $meta: 'textScore' } } )
    .limit(50).then(res => {
      const trailData = res.map(trail => {
        const states = trail.states ? trail.states.map(s => s as unknown as string) : [];
        states.forEach(stateId => {
          if (!stateIds.includes(stateId.toString())) {
            stateIds.push(stateId.toString());
          }
        });
        return {
          id: trail._id,
          name: trail.name,
          type: 'trail',
          trailType: trail.type,
          distance: distance(point(trail.center), sourcePoint, {units: 'miles'}),
          coordinates: trail.center,
          stateText: states,
          datum: trail,
        };
      });
      State.find({_id: {$in: stateIds}}).then(stateRes => {
        mergeAndSort(trailData, stateRes)
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
