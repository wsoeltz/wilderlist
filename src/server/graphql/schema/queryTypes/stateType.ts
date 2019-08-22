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
        return await regionLoader.loadMany(parentValue.regions);
      },
    },
    mountains: {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, args, {dataloaders: {mountainLoader}}) {
        return await mountainLoader.loadMany(parentValue.mountains);
      },
    },
  }),
});

export default StateType;
