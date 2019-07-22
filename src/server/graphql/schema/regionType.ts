import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import StateType from './stateType';

const Region: any = mongoose.model('region');

const RegionType: any = new GraphQLObjectType({
  name:  'RegionType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    states:  {
      type: new GraphQLList(StateType),
      resolve(parentValue) {
        return Region.findStates(parentValue.id);
      },
    },
  }),
});

export default RegionType;
