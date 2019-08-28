import {
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
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  peakLists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
});

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
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        return await userLoader.loadMany(parentValue.friends);
      },
    },
    peakLists:  {
      type: new GraphQLList(PeakListType),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        return await peakListLoader.loadMany(parentValue.peakLists);
      },
    },
    mountains:  {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, args, {dataloaders: {mountainLoader}}) {
        return await mountainLoader.loadMany(parentValue.mountains);
      },
    },
  }),
});

export default UserType;
