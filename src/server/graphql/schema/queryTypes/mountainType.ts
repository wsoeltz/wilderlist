import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { Mountain as IMountain } from '../../graphQLTypes';
import PeakListType, {ExternalResourcesType} from './peakListType';
import StateType from './stateType';
import UserType from './userType';

type MountainSchemaType = mongoose.Document & IMountain & {
  findState: (id: string) => any;
  findPeakLists: (id: string) => any;
};

export type MountainModelType = mongoose.Model<MountainSchemaType> & MountainSchemaType;

const MountainSchema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  elevation: { type: Number, required: true },
  prominence: { type: Number },
  state: {
    type: Schema.Types.ObjectId,
    ref: 'state',
  },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
  optionalLists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  status: { type: String },
  flag: { type: String },
  description: { type: String },
  resources: [{
    title: { type: String },
    url: { type: String },
  }],
  location: [{type: Number}],
  trailAccessible: {type: Boolean},
  locationText: { type: String },
  locationTextShort: { type: String },
});

MountainSchema.index({ location: '2dsphere' });

MountainSchema.statics.findState = function(id: string) {
  return this.findById(id)
    .populate('state')
    .then((mountain: IMountain) => mountain.state);
};

export const Mountain: MountainModelType = mongoose.model<MountainModelType, any>('mountain', MountainSchema);

export const CreatedItemStatus = new GraphQLEnumType({
  name: 'CreatedItemStatus',
  values: {
    pending: {
      value: 'pending',
    },
    auto: {
      value: 'auto',
    },
    accepted: {
      value: 'accepted',
    },
  },
});

const MountainType: any = new GraphQLObjectType({
  name:  'MountainType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
    elevation: { type: GraphQLFloat },
    prominence: { type: GraphQLFloat },
    state: {
      type: StateType,
      async resolve(parentValue, args, {dataloaders: {stateLoader}}) {
        try {
          const res = await stateLoader.load(parentValue.state);
          if (res._id.toString() !== parentValue.state.toString()) {
            throw new Error('IDs do not match' + res);
          }
          return res;
        } catch (err) {
          return err;
        }
      },
    },
    lists:  {
      type: new GraphQLList(PeakListType),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          return await peakListLoader.loadMany(parentValue.lists);
        } catch (err) {
          return err;
        }
      },
    },
    optionalLists:  {
      type: new GraphQLList(PeakListType),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          return await peakListLoader.loadMany(parentValue.optionalLists);
        } catch (err) {
          return err;
        }
      },
    },
    author: {
      type: UserType,
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        try {
          if (parentValue.author) {
            const res = await userLoader.load(parentValue.author);
            if (res && res._id && res._id.toString() !== parentValue.author.toString()) {
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
    flag: { type: GraphQLString },
    description: { type: GraphQLString },
    resources: { type: new GraphQLList(ExternalResourcesType) },
    location: { type: new GraphQLList(GraphQLFloat) },
    trailAccessible: { type: GraphQLBoolean },
    locationText: { type: GraphQLString },
    locationTextShort: { type: GraphQLString },
  }),
});

export default MountainType;
