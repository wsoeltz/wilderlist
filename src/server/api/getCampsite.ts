/* tslint:disable:await-promise */
import {
  Campsite,
} from '../graphql/schema/queryTypes/campsiteType';

const getCampsite = async (_id: string) => {
  try {
    return await Campsite.findOne({_id});
  } catch (err) {
    console.error(err);
  }
};

export default getCampsite;
