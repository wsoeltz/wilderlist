import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { User as IUser } from '../../graphQLTypes';
import MountainType from './mountainType';
import PeakListType from './peakListType';

type UserSchemaType = mongoose.Document & IUser;

const UserSchema = new Schema({
  googleId: { type: String},
  name: { type: String },
  email: { type: String },
  profilePictureUrl: { type: String },
  permissions: { type: String },
  hideEmail: { type: Boolean },
  hideProfilePicture: { type: Boolean },
  hideProfileInSearch: { type: Boolean },
  friends: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    status: { type: String },
  }],
  peakLists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
  mountains: [{
    mountain: {
      type: Schema.Types.ObjectId,
      ref: 'mountain',
    },
    dates: [{ type: String }],
  }],
  ascentNotifications: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    mountain: {
      type: Schema.Types.ObjectId,
      ref: 'mountain',
    },
    date: { type: String },
  }],
});

export type UserModelType = mongoose.Model<UserSchemaType> & UserSchemaType;

export const User: UserModelType = mongoose.model<UserModelType, any>('user', UserSchema);

const CompletedMountainsType = new GraphQLObjectType({
  name: 'CompletedMountainsType',
  fields: () => ({
    mountain: {
      type: MountainType,
      async resolve(parentValue, args, {dataloaders: {mountainLoader}}) {
        try {
          return await mountainLoader.load(parentValue.mountain);
        } catch (err) {
          return err;
        }
      },
    },
    dates: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

const FriendsType = new GraphQLObjectType({
  name: 'FriendsType',
  fields: () => ({
    user: {
      type: UserType,
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        try {
          return await userLoader.load(parentValue.user);
        } catch (err) {
          return err;
        }
      },
    },
    status: {
      type: GraphQLString,
    },
  }),
});

const AscentNotificationType: any = new GraphQLObjectType({
  name: 'AscentNotificationType',
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        try {
          return await userLoader.load(parentValue.user);
        } catch (err) {
          return err;
        }
      },
    },
    mountain: {
      type: MountainType,
      async resolve(parentValue, args, {dataloaders: {mountainLoader}}) {
        try {
          return await mountainLoader.load(parentValue.mountain);
        } catch (err) {
          return err;
        }
      },
    },
    date: {
      type: GraphQLString,
    },
  }),
});

const UserType: any = new GraphQLObjectType({
  name:  'UserType',
  fields: () => ({
    id: { type: GraphQLID },
    permissions: { type: GraphQLString },
    googleId: { type: GraphQLString},
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    profilePictureUrl: { type: GraphQLString },
    hideEmail: { type: GraphQLBoolean },
    hideProfilePicture: { type: GraphQLBoolean },
    hideProfileInSearch: { type: GraphQLBoolean },
    friends: { type: new GraphQLList(FriendsType) },
    peakLists: {
      type: new GraphQLList(PeakListType),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          return await peakListLoader.loadMany(parentValue.peakLists);
        } catch (err) {
          return err;
        }
      },
    },
    mountains: { type: new GraphQLList(CompletedMountainsType) },
    ascentNotifications: { type: new GraphQLList(AscentNotificationType) },
  }),
});

export default UserType;
