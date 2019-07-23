import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import ListType from './listType';

import { UserSchemaType } from '../models/user';

export type UserModelType = mongoose.Model<UserSchemaType> & UserSchemaType;

export const User: UserModelType = mongoose.model<UserModelType, any>('user');

const UserType: any = new GraphQLObjectType({
  name:  'UserType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    friends: {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return User.findFriends(parentValue.id);
      },
    },
    lists: {
      type: new GraphQLList(ListType),
      resolve(parentValue) {
        return User.findLists(parentValue.id);
      },
    },
  }),
});

export default UserType;
