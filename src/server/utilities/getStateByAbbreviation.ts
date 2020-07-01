/* tslint:disable:await-promise */
import { State } from '../graphql/schema/queryTypes/stateType';

export default async (abbreviation: string) => {
  try {
    const res = await State.find({abbreviation: abbreviation.toUpperCase()});
    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
};
