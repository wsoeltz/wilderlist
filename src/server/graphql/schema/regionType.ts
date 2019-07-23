import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import StateType from './stateType';

import { RegionSchemaType } from '../models/region';

export type RegionModelType = mongoose.Model<RegionSchemaType> & RegionSchemaType;

export const Region: RegionModelType = mongoose.model<RegionModelType, any>('region');

const RegionType = new GraphQLObjectType({
  name:  'RegionType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    states:  {
      type: new GraphQLList(StateType),
      resolve(parentValue) {
        return Region.findStates(parentValue.id);
      },
    },
  }),
});

export default RegionType;
