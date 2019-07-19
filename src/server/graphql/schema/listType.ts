import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import mongoose from 'mongoose';
import MountainType from './mountainType';

const List: any = mongoose.model('list');

const ListType = new GraphQLObjectType({
  name:  'ListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    items:  {
      type: new GraphQLList(MountainType),
      resolve(parentValue) {
        return List.findMountain(parentValue.id);
      },
    },
  }),
});

export default ListType;
