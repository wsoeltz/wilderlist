import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { Region as IRegion } from '../../graphQLTypes';
import StateType from './stateType';

type RegionSchemaType = mongoose.Document & IRegion;

export type RegionModelType = mongoose.Model<RegionSchemaType> & RegionSchemaType;

const RegionSchema: Schema = new Schema({
  name: { type: String, required: true },
  states: [{
    type: Schema.Types.ObjectId,
    ref: 'state',
  }],
});

export const Region: RegionModelType = mongoose.model<RegionModelType, any>('region', RegionSchema);

const RegionType = new GraphQLObjectType({
  name:  'RegionType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
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
  }),
});

export default RegionType;
