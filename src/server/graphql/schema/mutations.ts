import {
  GraphQLID,
  GraphQLList,
  // GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
// import ListType from './listType';
// import MountainType from './mountainType';
import RegionType from './regionType';
// import StateType from './stateType';
// import UserType from './userType';

// const Mountain = mongoose.model('mountain');
// const State = mongoose.model('state');
const Region: any = mongoose.model('region');
// const List = mongoose.model('list');
// const User = mongoose.model('user');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addRegion: {
      type: RegionType,
      args: {
        name: { type: GraphQLString },
        states: { type: new GraphQLList(GraphQLID)},
      },
      resolve(parentValue, { name, states }) {
        return (new Region({ name, states })).save();
      },
    },
  },
});

export default mutation;
