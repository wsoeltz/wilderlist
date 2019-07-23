import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import MountainType from './mountainType';
import RegionType from './regionType';

import { StateSchemaType } from '../models/state';

export type StateModelType = mongoose.Model<StateSchemaType> & StateSchemaType;

export const State: StateModelType = mongoose.model<StateModelType, any>('state');

const StateType: any = new GraphQLObjectType({
  name:  'StateType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    regions: {
      type: new GraphQLList(RegionType),
      resolve(parentValue) {
        return State.findRegions(parentValue.id);
      },
    },
    mountains: {
      type: new GraphQLList(MountainType),
      resolve(parentValue) {
        return State.findMountains(parentValue.id);
      },
    },
  }),
});

export default StateType;
