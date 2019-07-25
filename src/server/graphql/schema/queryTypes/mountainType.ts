import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { Mountain as IMountain } from '../../graphQLTypes';
import ListType from './listType';
import StateType from './stateType';

type MountainSchemaType = mongoose.Document & IMountain & {
  findState: (id: string) => any;
  findLists: (id: string) => any;
};

export type MountainModelType = mongoose.Model<MountainSchemaType> & MountainSchemaType;

const MountainSchema = new Schema({
  name: { type: String },
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

MountainSchema.statics.findLists = function(id: string) {
  return this.findById(id)
    .populate('lists')
    .then((mountain: IMountain) => mountain.lists);
};

export const Mountain: MountainModelType = mongoose.model<MountainModelType, any>('mountain', MountainSchema);

const MountainType: any = new GraphQLObjectType({
  name:  'MountainType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    state: {
      type: StateType,
      resolve(parentValue) {
        return Mountain.findState(parentValue.id);
      },
    },
    lists:  {
      type: new GraphQLList(ListType),
      resolve(parentValue) {
        return Mountain.findLists(parentValue.id);
      },
    },
  }),
});

export default MountainType;
