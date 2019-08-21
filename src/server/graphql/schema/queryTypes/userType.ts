import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { User as IUser } from '../../graphQLTypes';
import PeakListType from './peakListType';

type UserSchemaType = mongoose.Document & IUser & {
  findFriends: (id: string) => any;
  findLists: (id: string) => any;
};

const UserSchema = new Schema({
  googleId: { type: String},
  name: { type: String },
  email: { type: String },
  profilePictureUrl: { type: String },
  permissions: { type: String },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  peakLists: [{
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
    .populate('peakLists')
    .then((user: IUser) => user.peakLists);
};

export type UserModelType = mongoose.Model<UserSchemaType> & UserSchemaType;

export const User: UserModelType = mongoose.model<UserModelType, any>('user', UserSchema);

const UserType: any = new GraphQLObjectType({
  name:  'UserType',
  fields: () => ({
    id: { type: GraphQLID },
    permissions: { type: GraphQLString },
    googleId: { type: GraphQLString},
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    profilePictureUrl: { type: GraphQLString },
    friends: {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return User.findFriends(parentValue.id);
      },
    },
    peakLists: {
      type: new GraphQLList(PeakListType),
      resolve(parentValue) {
        return User.findLists(parentValue.id);
      },
    },
  }),
});

export default UserType;
