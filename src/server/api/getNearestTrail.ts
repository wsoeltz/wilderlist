/* tslint:disable:await-promise */
import {
  Coordinate,
  TrailType,
} from '../graphql/graphQLTypes';
import {
  buildNearSphereQuery,
} from '../graphql/schema/geospatial/utils';
import {
  Trail,
} from '../graphql/schema/queryTypes/trailType';

interface Input {
  coord: Coordinate;
  name: string;
  ignoreTypes: TrailType[];
}

const getNearestTrail = async ({coord, name, ignoreTypes}: Input) => {
  try {
    return await Trail.find({
      ...buildNearSphereQuery({
        locationField: 'center',
        latitude: coord[1],
        longitude: coord[0],
        maxDistance: 16093.4,
      }),
      name: {$eq: name},
      type: {$nin: ignoreTypes},
    })
    .limit(25);
  } catch (err) {
    console.error(err);
  }
};

export default getNearestTrail;
