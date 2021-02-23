import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { Trail as ITrail } from '../../graphQLTypes';
import StateType from './stateType';

type TrailSchemaType = mongoose.Document & ITrail & {
  findState: (id: string) => any;
  findPeakLists: (id: string) => any;
};

export type TrailModelType = mongoose.Model<TrailSchemaType> & TrailSchemaType;

const TrailSchema = new Schema({
  name: { type: String },
  osmId: { type: Number },
  relId: { type: String },
  type: { type: String },
  states: [{
    type: Schema.Types.ObjectId,
    ref: 'state',
  }],
  line: [[Number]],
  center: [{type: Number}],
  allowsBikes: { type: Boolean },
  allowsHorses: { type: Boolean },
  parents: [{
    type: Schema.Types.ObjectId,
    ref: 'trail',
  }],
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'trail',
  }],
  waterCrossing: { type: String },
  skiTrail: { type: Boolean },
  flag: { type: String },
  locationText: { type: String },
  locationTextShort: { type: String },
  trailLength: { type: Number },
  avgSlope: { type: Number },
  bbox: [{type: Number}],
});

TrailSchema.index({ center: '2dsphere' });
TrailSchema.index({ name: 'text' });

export const Trail: TrailModelType = mongoose.model<TrailModelType, any>('trail', TrailSchema);

const TrailType: any = new GraphQLObjectType({
  name:  'TrailType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    osmId: { type: GraphQLInt },
    relId: { type: GraphQLInt },
    type: { type: GraphQLString },
    states: {
      type: new GraphQLList(StateType),
      async resolve(parentValue, args, {dataloaders: {stateLoader}}) {
        try {
          return await stateLoader.loadMany(parentValue.states);
        } catch (err) {
          return err;
        }
      },
    },
    line: { type: new GraphQLList(new GraphQLList(GraphQLFloat)) },
    center: { type: new GraphQLList(GraphQLFloat) },
    allowsBikes: { type: GraphQLBoolean },
    allowsHorses: { type: GraphQLBoolean },
    parents: {
      type: new GraphQLList(TrailType),
      async resolve(parentValue, args, {dataloaders: {trailLoader}}) {
        try {
          return await trailLoader.loadMany(parentValue.parents);
        } catch (err) {
          return err;
        }
      },
    },
    children: {
      type: new GraphQLList(TrailType),
      async resolve(parentValue, args, {dataloaders: {trailLoader}}) {
        try {
          return await trailLoader.loadMany(parentValue.children);
        } catch (err) {
          return err;
        }
      },
    },
    childrenCount: {
      type: GraphQLInt,
      resolve(parentValue) {
        return parentValue.children.length;
      },
    },
    waterCrossing: { type: GraphQLString },
    skiTrail: { type: GraphQLBoolean },
    primaryParent: {
      type: TrailType,
      async resolve(parentValue, args, {dataloaders: {trailLoader}}) {
        try {
          if (parentValue.parents && parentValue.parents.length) {
            const parents = await trailLoader.loadMany(parentValue.parents);
            const primary = parents.find((p: ITrail) => p.name === parentValue.name);
            if (primary) {
              return primary;
            }
          }
          return parentValue;
        } catch (err) {
          return err;
        }
      },
    },
    flag: { type: GraphQLString },
    locationText: { type: GraphQLString },
    locationTextShort: { type: GraphQLString },
    trailLength: { type: GraphQLFloat },
    avgSlope: { type: GraphQLFloat },
    bbox:  {
      type: new GraphQLList(GraphQLFloat),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.bbox) {
              return res.bbox;
            }
          }
          return await parentValue.bbox;
        } catch (err) {
          return err;
        }
      },
    },
  }),
});

export default TrailType;
