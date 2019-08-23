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
});

MountainSchema.statics.findState = function(id: string) {
  return this.findById(id)
    .populate('state')
    .then((mountain: IMountain) => mountain.state);
};


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
        const res = await stateLoader.load(parentValue.state);
        if (res._id.toString() !== parentValue.state.toString()) {
          throw new Error('IDs do not match' + res);
        }
        return res;
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
