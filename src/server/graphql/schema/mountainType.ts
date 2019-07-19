import {
  GraphQLID,
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
  }),
});

export default MountainType;
