import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { TripReport as ITripReport } from '../../graphQLTypes';
import MountainType from './mountainType';
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
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  perfectConditions: { type: Boolean },
  mud: { type: Number },
  water: { type: Number },
  ice: { type: Number },
  snow: { type: Number },
  obstacles: { type: Number },
  notes: { type: String },
  link: { type: String },
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
    perfectConditions: { type: GraphQLBoolean },
    mud: { type: GraphQLInt },
    water: { type: GraphQLInt },
    ice: { type: GraphQLInt },
    snow: { type: GraphQLInt },
    obstacles: { type: GraphQLInt },
    notes: { type: GraphQLString },
    link: { type: GraphQLString },
  }),
});

export default TripReportType;
