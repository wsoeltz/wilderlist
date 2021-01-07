/* tslint:disable:await-promise */
const {lineString} = require('@turf/helpers');
const length = require('@turf/length').default;
import {
  Trail as ITrail,
} from '../graphql/graphQLTypes';
import {
  Trail,
} from '../graphql/schema/queryTypes/trailType';

export const getNamedParent = async (trail: ITrail) => {
  try {
    const parent = await Trail.findOne({
      _id: {$in: trail.parents},
      name: {$eq: trail.name},
    });
    if (parent) {
      const children = await Trail.find({_id: {$in: parent.children}});
      const trailLength = children.reduce((sum, c) => {
        return sum + length(lineString(c.line), {units: 'miles'});
      }, 0);
      return {
        _id: parent._id,
        name: parent.name,
        type: trail.name,
        trailLength,
      };
    } else {
      const trailLength = length(lineString(trail.line), {units: 'miles'});
      return {
        _id: trail._id,
        name: trail.name,
        type: trail.name,
        trailLength,
      };
    }
  } catch (err) {
    console.error(err);
    const trailLength = length(lineString(trail.line), {units: 'miles'});
    return {
      _id: trail._id,
      name: trail.name,
      type: trail.type,
      trailLength,
    };
  }
};

const getTrail = async (_id: string) => {
  try {
    const trail = await Trail.findOne({_id});
    if (trail) {
      const trailLength = length(lineString(trail.line), {units: 'miles'});
      return {
        _id: trail._id,
        name: trail.name,
        type: trail.type,
        trailLength,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};

export default getTrail;
