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
import { Campsite as ICampsite } from '../../graphQLTypes';
import StateType from './stateType';

type CampsiteSchemaType = mongoose.Document & ICampsite & {
  findState: (id: string) => any;
  findPeakLists: (id: string) => any;
};

export type CampsiteModelType = mongoose.Model<CampsiteSchemaType> & CampsiteSchemaType;

const CampsiteSchema = new Schema({
  reserveamericaId: { type: String },
  ridbId: { type: String },
  osmId: { type: String },
  name: { type: String },
  location: [{type: Number}],
  state: {
    type: Schema.Types.ObjectId,
    ref: 'state',
  },
  website: { type: String },
  type: { type: String },
  ownership: { type: String },
  electricity: { type: Boolean },
  toilets: { type: Boolean },
  drinking_water: { type: Boolean },
  email: { type: String },
  reservation: { type: String },
  showers: { type: Boolean },
  phone: { type: String },
  fee: { type: Boolean },
  tents: { type: Boolean },
  capacity: { type: Number },
  internet_access: { type: Boolean },
  fire: { type: Boolean },
  maxtents: { type: Number },
  flag: { type: String },
});

CampsiteSchema.index({ center: '2dsphere' });
CampsiteSchema.index({ name: 'text' });

export const Campsite: CampsiteModelType = mongoose.model<CampsiteModelType, any>('campsite', CampsiteSchema);

const CampsiteType: any = new GraphQLObjectType({
  name:  'CampsiteType',
  fields: () => ({
    id: { type: GraphQLID },
    reserveamericaId: { type: GraphQLString },
    ridbId: { type: GraphQLString },
    osmId: { type: GraphQLString },
    name: { type: GraphQLString },
    location: { type: new GraphQLList(GraphQLFloat) },
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
    website: { type: GraphQLString },
    type: { type: GraphQLString },
    ownership: { type: GraphQLString },
    electricity: { type: GraphQLBoolean },
    toilets: { type: GraphQLBoolean },
    drinking_water: { type: GraphQLBoolean },
    email: { type: GraphQLString },
    reservation: { type: GraphQLString },
    showers: { type: GraphQLBoolean },
    phone: { type: GraphQLString },
    fee: { type: GraphQLBoolean },
    tents: { type: GraphQLBoolean },
    capacity: { type: GraphQLInt },
    internet_access: { type: GraphQLBoolean },
    fire: { type: GraphQLBoolean },
    maxtents: { type: GraphQLInt },
    flag: { type: GraphQLString },
  }),
});

export default CampsiteType;
