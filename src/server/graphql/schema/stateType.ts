import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import RegionType from './regionType';

const State: any = mongoose.model('state');

const StateType = new GraphQLObjectType({
  name:  'StateType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    regions: {
      type: new GraphQLList(RegionType),
      resolve(parentValue) {
        return State.findRegion(parentValue.id);
      },
    },
  }),
});

export default StateType;
