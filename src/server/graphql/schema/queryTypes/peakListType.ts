import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { PeakList as IPeakList } from '../../graphQLTypes';
import MountainType, {CreatedItemStatus} from './mountainType';
import StateType from './stateType';
import UserType from './userType';

type PeakListSchemaType = mongoose.Document & IPeakList;

export type PeakListModelType = mongoose.Model<PeakListSchemaType> & PeakListSchemaType;

const PeakListSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  description: { type: String },
  optionalPeaksDescription: { type: String },
  type: { type: String, required: true},
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  optionalMountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  numUsers: { type: Number, required: true },
  parent: { type: Schema.Types.ObjectId },
  searchString: { type: String, required: true },
  states: [{
    type: Schema.Types.ObjectId,
    ref: 'state',
  }],
  resources: [{
    title: { type: String },
    url: { type: String },
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  status: { type: String },
  flag: { type: String },
});

export const PeakList: PeakListModelType = mongoose.model<PeakListModelType, any>('list', PeakListSchema);

export const PeakListVariants = new GraphQLEnumType({
  name: 'PeakListVariants',
  values: {
    standard: {
      value: 'standard',
    },
    winter: {
      value: 'winter',
    },
    fourSeason: {
      value: 'fourSeason',
    },
    grid: {
      value: 'grid',
    },
  },
});

const ExternalResourcesType: any = new GraphQLObjectType({
  name: 'ExternalResourcesType',
  fields: () => ({
    id: { type: GraphQLID },
    title: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
  }),
});

export const PeakListFlag = new GraphQLEnumType({
  name: 'PeakListFlag',
  values: {
    duplicate: {
      value: 'duplicate',
    },
    data: {
      value: 'data',
    },
    abuse: {
      value: 'abuse',
    },
    other: {
      value: 'other',
    },
    deleteRequest: {
      value: 'deleteRequest',
    },
  },
});

export const PeakListTier = new GraphQLEnumType({
  name: 'PeakListTier',
  values: {
    casual: {
      value: 'casual',
    },
    advanced: {
      value: 'advanced',
    },
    expert: {
      value: 'expert',
    },
    mountaineer: {
      value: 'mountaineer',
    },
  },
});

const PeakListType: any = new GraphQLObjectType({
  name:  'PeakListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    shortName: { type: GraphQLString },
    description: { type: GraphQLString },
    optionalPeaksDescription: { type: GraphQLString },
    type: { type: PeakListVariants },
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
    optionalMountains:  {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, args, {dataloaders: {mountainLoader}}) {
        try {
          return await mountainLoader.loadMany(parentValue.optionalMountains);
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
    numUsers: { type: GraphQLInt },
    parent: {
      type: PeakListType,
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        if (parentValue.parent) {
          try {
            return await peakListLoader.load(parentValue.parent);
          } catch (err) {
            return err;
          }
        } else {
          return null;
        }
      },
    },
    searchString: { type: GraphQLString },
    states:  {
      type: new GraphQLList(StateType),
      async resolve(parentValue, args, {dataloaders: {stateLoader}}) {
        try {
          return await stateLoader.loadMany(parentValue.states);
        } catch (err) {
          return err;
        }
      },
    },
    children:  {
      type: new GraphQLList(PeakListType),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          return PeakList.find({ parent: parentValue.id });
        } catch (err) {
          return err;
        }
      },
    },
    resources: { type: new GraphQLList(ExternalResourcesType) },
    author: {
      type: UserType,
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        try {
          if (parentValue.author) {
            const res = await userLoader.load(parentValue.author);
            if (res._id.toString() !== parentValue.author.toString()) {
              throw new Error('IDs do not match' + res);
            }
            return res;
          } else {
            return null;
          }
        } catch (err) {
          return err;
        }
      },
    },
    status: { type: CreatedItemStatus },
    flag: { type: PeakListFlag },
    tier: { type: PeakListTier },
  }),
});

export default PeakListType;
