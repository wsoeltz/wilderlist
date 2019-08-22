import {
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { Mountain as IMountain } from '../../graphQLTypes';
import PeakListType from './peakListType';
import StateType from './stateType';

type MountainSchemaType = mongoose.Document & IMountain;

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
});

export const Mountain: MountainModelType = mongoose.model<MountainModelType, any>('mountain', MountainSchema);

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
        return await stateLoader.load(parentValue.state);
      },
    },
    lists:  {
      type: new GraphQLList(PeakListType),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        return await peakListLoader.loadMany(parentValue.lists);
      },
    },
  }),
});

export default MountainType;
