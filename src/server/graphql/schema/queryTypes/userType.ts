import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { User as IUser } from '../../graphQLTypes';
import ListType from './listType';

type UserSchemaType = mongoose.Document & IUser & {
  findFriends: (id: string) => any;
  findLists: (id: string) => any;
};

const UserSchema = new Schema({
  googleId: { type: String},
  name: { type: String },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
});

UserSchema.statics.findFriends = function(id: string) {
  return this.findById(id)
    .populate('friends')
    .then((user: IUser) => user.friends);
};

UserSchema.statics.findLists = function(id: string) {
  return this.findById(id)
    .populate('lists')
    .then((user: IUser) => user.lists);
};

export type UserModelType = mongoose.Model<UserSchemaType> & UserSchemaType;

export const User: UserModelType = mongoose.model<UserModelType, any>('user', UserSchema);

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
