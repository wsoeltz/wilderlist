import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import { List as IList } from '../../graphQLTypes';
import MountainType from './mountainType';
import UserType from './userType';

type ListSchemaType = mongoose.Document & IList & {
  findMountains: (id: string) => any;
  findUsers: (id: string) => any;
};

export type ListModelType = mongoose.Model<ListSchemaType> & ListSchemaType;

const ListSchema = new Schema({
  name: { type: String, required: true },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
});

ListSchema.statics.findMountains = function(id: string) {
  return this.findById(id)
    .populate('items')
    .then((list: IList) => list.items);
};

ListSchema.statics.findUsers = function(id: string) {
  return this.findById(id)
    .populate('users')
    .then((list: IList) => list.users);
};

export const List: ListModelType = mongoose.model<ListModelType, any>('list', ListSchema);

const ListType = new GraphQLObjectType({
  name:  'ListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    items:  {
      type: new GraphQLList(MountainType),
      resolve(parentValue) {
        return List.findMountains(parentValue.id);
      },
    },
    users:  {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return List.findUsers(parentValue.id);
      },
    },
  }),
});

export default ListType;
