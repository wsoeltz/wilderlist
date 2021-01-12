import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { TripReport as ITripReport } from '../../graphQLTypes';
import CampsiteType from './campsiteType';
import MountainType from './mountainType';
import TrailType from './trailType';
import UserType from './userType';

type TripReportSchemaType = mongoose.Document & ITripReport;

export type TripReportModelType = mongoose.Model<TripReportSchemaType> & TripReportSchemaType;

const TripReportSchema = new Schema({
  date: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  trails: [{
    type: Schema.Types.ObjectId,
    ref: 'trail',
  }],
  campsites: [{
    type: Schema.Types.ObjectId,
    ref: 'campsite',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  notes: { type: String },
  link: { type: String },
  mudMinor: { type: Boolean },
  mudMajor: { type: Boolean },
  waterSlipperyRocks: { type: Boolean },
  waterOnTrail: { type: Boolean },
  leavesSlippery: { type: Boolean },
  iceBlack: { type: Boolean },
  iceBlue: { type: Boolean },
  iceCrust: { type: Boolean },
  snowIceFrozenGranular: { type: Boolean },
  snowIceMonorailStable: { type: Boolean },
  snowIceMonorailUnstable: { type: Boolean },
  snowIcePostholes: { type: Boolean },
  snowMinor: { type: Boolean },
  snowPackedPowder: { type: Boolean },
  snowUnpackedPowder: { type: Boolean },
  snowDrifts: { type: Boolean },
  snowSticky: { type: Boolean },
  snowSlush: { type: Boolean },
  obstaclesBlowdown: { type: Boolean },
  obstaclesOther: { type: Boolean },
});

export const TripReport: TripReportModelType = mongoose.model<TripReportModelType, any>('tripReport', TripReportSchema);

const TripReportType: any = new GraphQLObjectType({
  name:  'TripReportType',
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    author: {
      type: UserType,
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        try {
          return await userLoader.load(parentValue.author);
        } catch (err) {
          return err;
        }
      },
    },
    mountains:  {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, args, {dataloaders: {mountainLoader}}) {
        try {
          return await mountainLoader.loadMany(parentValue.mountains);
        } catch (err) {
          return err;
        }
      },
    },
    trails:  {
      type: new GraphQLList(TrailType),
      async resolve(parentValue, args, {dataloaders: {trailLoader}}) {
        try {
          return await trailLoader.loadMany(parentValue.trails);
        } catch (err) {
          return err;
        }
      },
    },
    campsites:  {
      type: new GraphQLList(CampsiteType),
      async resolve(parentValue, args, {dataloaders: {campsiteLoader}}) {
        try {
          return await campsiteLoader.loadMany(parentValue.campsites);
        } catch (err) {
          return err;
        }
      },
    },
    users:  {
      type: new GraphQLList(UserType),
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        try {
          return await userLoader.loadMany(parentValue.users);
        } catch (err) {
          return err;
        }
      },
    },
    notes: { type: GraphQLString },
    link: { type: GraphQLString },
    mudMinor: { type: GraphQLBoolean },
    mudMajor: { type: GraphQLBoolean },
    waterSlipperyRocks: { type: GraphQLBoolean },
    waterOnTrail: { type: GraphQLBoolean },
    leavesSlippery: { type: GraphQLBoolean },
    iceBlack: { type: GraphQLBoolean },
    iceBlue: { type: GraphQLBoolean },
    iceCrust: { type: GraphQLBoolean },
    snowIceFrozenGranular: { type: GraphQLBoolean },
    snowIceMonorailStable: { type: GraphQLBoolean },
    snowIceMonorailUnstable: { type: GraphQLBoolean },
    snowIcePostholes: { type: GraphQLBoolean },
    snowMinor: { type: GraphQLBoolean },
    snowPackedPowder: { type: GraphQLBoolean },
    snowUnpackedPowder: { type: GraphQLBoolean },
    snowDrifts: { type: GraphQLBoolean },
    snowSticky: { type: GraphQLBoolean },
    snowSlush: { type: GraphQLBoolean },
    obstaclesBlowdown: { type: GraphQLBoolean },
    obstaclesOther: { type: GraphQLBoolean },
  }),
});

export default TripReportType;
