import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { State as IState } from '../../graphQLTypes';
import MountainType from './mountainType';
import RegionType from './regionType';

type StateSchemaType = mongoose.Document & IState & {
  findRegions: (id: string) => any;
  findMountains: (id: string) => any;
};

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
});

StateSchema.statics.findRegions = function(id: string) {
  return this.findById(id)
    .populate('regions')
    .then((state: IState) => state.regions);
};

StateSchema.statics.findMountains = function(id: string) {
  return this.findById(id)
    .populate('mountains')
    .then((state: IState) => state.mountains);
};

export const State: StateModelType = mongoose.model<StateModelType, any>('state', StateSchema);

const StateType: any = new GraphQLObjectType({
  name:  'StateType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    abbreviation: { type: GraphQLString },
    regions: {
      type: new GraphQLList(RegionType),
      resolve(parentValue) {
        return State.findRegions(parentValue.id);
      },
    },
    mountains: {
      type: new GraphQLList(MountainType),
      resolve(parentValue) {
        return State.findMountains(parentValue.id);
      },
    },
  }),
});

export default StateType;
