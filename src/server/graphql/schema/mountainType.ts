import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import StateType from './stateType';

import { MountainSchemaType } from '../models/mountain';

export type MountainModelType = mongoose.Model<MountainSchemaType> & MountainSchemaType;

export const Mountain: MountainModelType = mongoose.model<MountainModelType, any>('mountain');

const MountainType = new GraphQLObjectType({
  name:  'MountainType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    state: {
      type: StateType,
      resolve(parentValue) {
        return Mountain.findState(parentValue.id);
      },
    },
    lists:  {
      type: new GraphQLList(StateType),
      resolve(parentValue) {
        return Mountain.findLists(parentValue.id);
      },
    },
  }),
});

export default MountainType;
