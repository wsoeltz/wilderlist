/* tslint:disable:await-promise */
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
      return {
        _id: parent._id,
        name: parent.name,
        type: trail.type,
        locationText: parent.locationText,
        locationTextShort: parent.locationTextShort,
        trailLength: parent.trailLength,
      };
    } else {
      return {
        _id: trail._id,
        name: trail.name,
        type: trail.type,
        locationText: trail.locationText,
        locationTextShort: trail.locationTextShort,
        trailLength: trail.trailLength,
        line: trail.line,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      _id: trail._id,
      name: trail.name,
      type: trail.type,
      locationText: trail.locationText,
      locationTextShort: trail.locationTextShort,
      trailLength: trail.trailLength,
      line: trail.line,
    };
  }
};

const getTrail = async (_id: string) => {
  try {
    const trail = await Trail.findOne({_id});
    if (trail) {
      return {
        _id: trail._id,
        name: trail.name,
        type: trail.type,
        locationText: trail.locationText,
        locationTextShort: trail.locationTextShort,
        parents: trail.parents,
        trailLength: trail.trailLength,
        line: trail.line,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};

export default getTrail;
