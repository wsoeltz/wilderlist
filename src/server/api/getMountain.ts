/* tslint:disable:await-promise */
import {
  Mountain,
} from '../graphql/schema/queryTypes/mountainType';

const getMountain = async (_id: string) => {
  try {
    return await Mountain.findOne({_id});
  } catch (err) {
    console.error(err);
  }
};

export default getMountain;
