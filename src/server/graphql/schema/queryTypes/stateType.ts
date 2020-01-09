import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { State as IState } from '../../graphQLTypes';
import MountainType from './mountainType';
import PeakListType from './peakListType';
import RegionType from './regionType';

type StateSchemaType = mongoose.Document & IState;
export type StateModelType = mongoose.Model<StateSchemaType> & StateSchemaType;

const StateSchema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  regions: [{
    type: Schema.Types.ObjectId,
    ref: 'region',
  }],
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  peakLists: [{
    type: Schema.Types.ObjectId,
    ref: 'peakList',
  }],
});

export const State: StateModelType = mongoose.model<StateModelType, any>('state', StateSchema);

const StateType: any = new GraphQLObjectType({
  name:  'StateType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    abbreviation: { type: GraphQLString },
    regions: {
      type: new GraphQLList(RegionType),
      async resolve(parentValue, args, {dataloaders: {regionLoader}}) {
        try {
          return await regionLoader.loadMany(parentValue.regions);
        } catch (err) {
          return err;
        }
      },
    },
    mountains: {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, args, {dataloaders: {mountainLoader}}) {
        try {
          return await mountainLoader.loadMany(parentValue.mountains);
        } catch (err) {
          return err;
        }
      },
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
  }),
});

export default StateType;
