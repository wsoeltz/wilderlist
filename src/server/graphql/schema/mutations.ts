import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import RegionType, { Region, RegionModelType } from './regionType';

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addRegion: {
      type: RegionType,
      args: {
        name: { type: GraphQLString },
        states: { type: new GraphQLList(GraphQLID)},
      },
      resolve(parentValue, { name, states }: RegionModelType) {
        return (new Region({ name, states })).save();
      },
    },
  },
});

export default mutation;
