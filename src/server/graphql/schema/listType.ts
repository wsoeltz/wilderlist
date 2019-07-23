import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import MountainType from './mountainType';
import UserType from './userType';

import { ListSchemaType } from '../models/list';

export type ListModelType = mongoose.Model<ListSchemaType> & ListSchemaType;

export const List: ListModelType = mongoose.model<ListModelType, any>('list');

const ListType = new GraphQLObjectType({
  name:  'ListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    items:  {
      type: new GraphQLList(MountainType),
      resolve(parentValue) {
        return List.findMountains(parentValue.id);
      },
    },
    users:  {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return List.findUsers(parentValue.id);
      },
    },
  }),
});

export default ListType;
