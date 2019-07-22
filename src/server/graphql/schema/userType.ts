import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import ListType from './listType';

const User: any = mongoose.model('user');

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
