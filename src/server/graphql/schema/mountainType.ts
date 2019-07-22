import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import StateType from './stateType';

const Mountain: any = mongoose.model('mountain');

const MountainType = new GraphQLObjectType({
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
      type: new GraphQLList(StateType),
      resolve(parentValue) {
        return Mountain.findLists(parentValue.id);
      },
    },
  }),
});

export default MountainType;
