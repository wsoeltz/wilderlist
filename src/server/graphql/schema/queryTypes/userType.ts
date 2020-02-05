import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { getLatestOverallAscent } from '../../../utilities/peakListUtils';
import { User as IUser } from '../../graphQLTypes';
import MountainType, {Mountain} from './mountainType';
import PeakListType from './peakListType';

type UserSchemaType = mongoose.Document & IUser;

const UserSchema = new Schema({
  googleId: { type: String},
  redditId: { type: String},
  name: { type: String },
  email: { type: String },
  profilePictureUrl: { type: String },
  permissions: { type: String },
  hideEmail: { type: Boolean },
  hideProfilePicture: { type: Boolean },
  hideProfileInSearch: { type: Boolean },
  disableEmailNotifications: { type: Boolean },
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
  peakListNotes: [{
    peakList: {
      type: Schema.Types.ObjectId,
      ref: 'list',
    },
    text: { type: String },
  }],
  mountainNotes: [{
    mountain: {
      type: Schema.Types.ObjectId,
      ref: 'mountain',
    },
    text: { type: String },
  }],
  mountainPermissions: { type: Number },
  peakListPermissions: { type: Number },
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

const PeakListNotesType: any = new GraphQLObjectType({
  name: 'PeakListNotesType',
  fields: () => ({
    id: { type: GraphQLID },
    peakList: {
      type: PeakListType,
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          return await peakListLoader.load(parentValue.peakList);
        } catch (err) {
          return err;
        }
      },
    },
    text: {
      type: GraphQLString,
    },
  }),
});

const MountainNotesType: any = new GraphQLObjectType({
  name: 'MountainNotesType',
  fields: () => ({
    id: { type: GraphQLID },
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
    text: {
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
    redditId: { type: GraphQLString},
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    profilePictureUrl: { type: GraphQLString },
    hideEmail: { type: GraphQLBoolean },
    hideProfilePicture: { type: GraphQLBoolean },
    hideProfileInSearch: { type: GraphQLBoolean },
    disableEmailNotifications: { type: GraphQLBoolean },
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
    peakListNotes: { type: new GraphQLList(PeakListNotesType) },
    peakListNote: {
      type: PeakListNotesType,
      args: {
        peakListId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, {peakListId}) {
        try {
          const { peakListNotes } = parentValue;
          if (peakListNotes && peakListNotes.length) {
            const targetPeakListNote = peakListNotes.find((note: any) => {
              return note.peakList.toString() === peakListId.toString();
            });
            if (targetPeakListNote) {
              return targetPeakListNote;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (err) {
          return err;
        }
      },
    },
    mountainNotes: { type: new GraphQLList(MountainNotesType) },
    mountainNote: {
      type: MountainNotesType,
      args: {
        mountainId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, {mountainId}) {
        try {
          const { mountainNotes } = parentValue;
          if (mountainNotes && mountainNotes.length) {
            const targetMountainNote = mountainNotes.find((note: any) => {
              return note.mountain.toString() === mountainId.toString();
            });
            if (targetMountainNote) {
              return targetMountainNote;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (err) {
          return err;
        }
      },
    },
    authoredMountains: {
      type: new GraphQLList(MountainType),
      resolve(parentValue) {
        try {
          const { _id } = parentValue;
          return Mountain.find({author: _id});
        } catch (err) {
          return err;
        }
      },
    },
    mountainPermissions: { type: GraphQLInt },
    peakListPermissions: { type: GraphQLInt },
    latestAscent: {
      type: CompletedMountainsType,
      resolve(parentValue) {
        try {
          const { mountains } = parentValue;
          if (mountains) {
            const mountainsWithStringIds =
              mountains.map(
                ({mountain, dates}: {mountain: any, dates: any}) => ({mountain: mountain.toString(), dates}));
            return getLatestOverallAscent(mountainsWithStringIds);
          } else {
            return null;
          }
        } catch (err) {
          return err;
        }
      },
    },
  }),
});

export default UserType;
