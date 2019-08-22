import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { PeakList as IPeakList } from '../../graphQLTypes';
import MountainType from './mountainType';
import UserType from './userType';

type PeakListSchemaType = mongoose.Document & IPeakList;

export type PeakListModelType = mongoose.Model<PeakListSchemaType> & PeakListSchemaType;

const PeakListSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  variants: {
    standard: {type: Boolean, required: true},
    winter: {type: Boolean, required: true},
    fourSeason: {type: Boolean, required: true},
    grid: {type: Boolean, required: true},
  },
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
});

export const PeakList: PeakListModelType = mongoose.model<PeakListModelType, any>('list', PeakListSchema);

const PeakListVariantsType = new GraphQLObjectType({
  name: 'PeakListVariantsType',
  fields: () => ({
    standard: {type: GraphQLBoolean },
    winter: {type: GraphQLBoolean },
    fourSeason: {type: GraphQLBoolean },
    grid: {type: GraphQLBoolean },
  }),
});

const PeakListType = new GraphQLObjectType({
  name:  'PeakListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    shortName: { type: GraphQLString },
    variants: { type: PeakListVariantsType },
    mountains:  {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, args, {dataloaders: {mountainLoader}}) {
        return await mountainLoader.loadMany(parentValue.mountains);
      },
    },
    users:  {
      type: new GraphQLList(UserType),
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        return await userLoader.loadMany(parentValue.users);
      },
    },
  }),
});

export default PeakListType;
