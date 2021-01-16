import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import uniqBy from 'lodash/uniqBy';
import mongoose, { Schema } from 'mongoose';
import { getLatestOverallAscent } from '../../../utilities/peakListUtils';
import {
  Friend as IFriend,
  FriendStatus,
  User as IUser,
} from '../../graphQLTypes';
import { asyncForEach } from '../../Utils';
import CampsiteType from './campsiteType';
import MountainType, {Mountain} from './mountainType';
import PeakListType, {PeakList} from './peakListType';
import TrailType from './trailType';
import TripReportType, {TripReport} from './tripReportType';

export type UserSchemaType = mongoose.Document & IUser;

const UserSchema = new Schema({
  googleId: { type: String},
  redditId: { type: String},
  facebookId: { type: String},
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
  trails: [{
    trail: {
      type: Schema.Types.ObjectId,
      ref: 'trail',
    },
    dates: [{ type: String }],
  }],
  campsites: [{
    campsite: {
      type: Schema.Types.ObjectId,
      ref: 'campsite',
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
  trailNotifications: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    trail: {
      type: Schema.Types.ObjectId,
      ref: 'trail',
    },
    date: { type: String },
  }],
  campsiteNotifications: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    campsite: {
      type: Schema.Types.ObjectId,
      ref: 'campsite',
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
  trailNotes: [{
    trail: {
      type: Schema.Types.ObjectId,
      ref: 'trail',
    },
    text: { type: String },
  }],
  campsiteNotes: [{
    campsite: {
      type: Schema.Types.ObjectId,
      ref: 'campsite',
    },
    text: { type: String },
  }],
  mountainPermissions: { type: Number },
  trailPermissions: { type: Number },
  campsitePermissions: { type: Number },
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

const CompletedTrailsType = new GraphQLObjectType({
  name: 'CompletedTrailsType',
  fields: () => ({
    trail: {
      type: TrailType,
      async resolve(parentValue, args, {dataloaders: {trailLoader}}) {
        try {
          return await trailLoader.load(parentValue.trail);
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

const CompletedCampsitesType = new GraphQLObjectType({
  name: 'CompletedCampsitesType',
  fields: () => ({
    campsite: {
      type: CampsiteType,
      async resolve(parentValue, args, {dataloaders: {campsiteLoader}}) {
        try {
          return await campsiteLoader.load(parentValue.campsite);
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

const TrailNotificationType: any = new GraphQLObjectType({
  name: 'TrailNotificationType',
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
    trail: {
      type: TrailType,
      async resolve(parentValue, args, {dataloaders: {trailLoader}}) {
        try {
          return await trailLoader.load(parentValue.trail);
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

const CampsiteNotificationType: any = new GraphQLObjectType({
  name: 'CampsiteNotificationType',
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
    campsite: {
      type: CampsiteType,
      async resolve(parentValue, args, {dataloaders: {campsiteLoader}}) {
        try {
          return await campsiteLoader.load(parentValue.campsite);
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
    facebookId: { type: GraphQLString},
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    profilePictureUrl: { type: GraphQLString },
    hideEmail: { type: GraphQLBoolean },
    hideProfilePicture: { type: GraphQLBoolean },
    hideProfileInSearch: { type: GraphQLBoolean },
    disableEmailNotifications: { type: GraphQLBoolean },
    friends: { type: new GraphQLList(FriendsType) },
    friendRequests: {
      type: new GraphQLList(FriendsType),
      resolve: parentValue => parentValue.friends.filter((f: IFriend) => f.status === FriendStatus.recieved),
    },
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
    trails: { type: new GraphQLList(CompletedTrailsType) },
    campsites: { type: new GraphQLList(CompletedCampsitesType) },
    ascentNotifications: { type: new GraphQLList(AscentNotificationType) },
    trailNotifications: { type: new GraphQLList(TrailNotificationType) },
    campsiteNotifications: { type: new GraphQLList(CampsiteNotificationType) },
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
        mountainId: { type: GraphQLID },
      },
      resolve(parentValue, {mountainId}) {
        if (!mountainId) {
          return null;
        }
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
    authoredPeakLists: {
      type: new GraphQLList(PeakListType),
      resolve(parentValue) {
        try {
          const { _id } = parentValue;
          return PeakList.find({author: _id});
        } catch (err) {
          return err;
        }
      },
    },
    authoredTripReports: {
      type: new GraphQLList(TripReportType),
      resolve(parentValue) {
        try {
          const { _id } = parentValue;
          return TripReport.find({author: _id});
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
    allInProgressMountains: {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, _args, {dataloaders: {peakListLoader, mountainLoader}}) {
        const mountainIds: string[] = [];
        try {
          const { peakLists, mountains } = parentValue;
          if (mountains) {
            mountains.forEach(({mountain, dates}: {mountain: any, dates: any[]}) => {
              if (dates.length) {
                mountainIds.push(mountain);
              }
            });
          }
          if (peakLists) {
            const listData = await peakListLoader.loadMany(peakLists);
            if (listData) {
              await asyncForEach(listData,
                async (list: {mountains: any[], optionalMountains: any[], parent: any}) => {
                  if (list.parent) {
                    const hasParent = peakLists.find(
                      (parentList: any) => parentList.toString() === list.parent.toString(),
                    );
                    if (!hasParent) {
                      const parentListData = await peakListLoader.load(list.parent);
                      if (parentListData) {
                        mountainIds.push(...parentListData.mountains);
                        mountainIds.push(...parentListData.optionalMountains);
                      }
                    }
                  } else {
                    mountainIds.push(...list.mountains);
                    mountainIds.push(...list.optionalMountains);
                  }
                },
              );
            }
            const uniqueMountainIds = uniqBy(mountainIds, (id) => id.toString());
            return await mountainLoader.loadMany(uniqueMountainIds);
          }
        } catch (err) {
          return err;
        }
        return null;
      },
    },
  }),
});

export default UserType;
