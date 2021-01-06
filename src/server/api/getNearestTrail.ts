/* tslint:disable:await-promise */
import {
  Coordinate,
} from '../graphql/graphQLTypes';
import {
  buildNearSphereQuery,
} from '../graphql/schema/geospatial/utils';
import { Trail } from '../graphql/schema/queryTypes/trailType';

const getNearestTrail = async (coord: Coordinate) => {
  try {
    return await Trail.find({
      ...buildNearSphereQuery({
        locationField: 'center',
        latitude: coord[1],
        longitude: coord[0],
        maxDistance: 16093.4,
      }),
      name: {$eq: null},
      type: {$nin: ['road', 'dirtroad']},
    })
    .limit(20);
  } catch (err) {
    console.error(err);
  }
};

export default getNearestTrail;
