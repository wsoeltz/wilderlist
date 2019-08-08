import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { PeakList as IPeakList } from '../../graphQLTypes';
import MountainType from './mountainType';
import UserType from './userType';

type PeakListSchemaType = mongoose.Document & IPeakList & {
  findMountains: (id: string) => any;
  findUsers: (id: string) => any;
};

export type PeakListModelType = mongoose.Model<PeakListSchemaType> & PeakListSchemaType;

const PeakListSchema = new Schema({
  name: { type: String, required: true },
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
});

PeakListSchema.statics.findMountains = function(id: string) {
  return this.findById(id)
    .populate('mountains')
    .then((list: IPeakList) => list.mountains);
};

PeakListSchema.statics.findUsers = function(id: string) {
  return this.findById(id)
    .populate('users')
    .then((list: IPeakList) => list.users);
};

export const PeakList: PeakListModelType = mongoose.model<PeakListModelType, any>('list', PeakListSchema);

const PeakListType = new GraphQLObjectType({
  name:  'PeakListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    mountains:  {
      type: new GraphQLList(MountainType),
      resolve(parentValue) {
        return PeakList.findMountains(parentValue.id);
      },
    },
    users:  {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return PeakList.findUsers(parentValue.id);
      },
    },
  }),
});

export default PeakListType;
