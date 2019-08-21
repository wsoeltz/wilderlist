import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import MountainType, { Mountain } from './queryTypes/mountainType';
import PeakListType, { PeakList } from './queryTypes/peakListType';
import RegionType, { Region } from './queryTypes/regionType';
import StateType, { State } from './queryTypes/stateType';
import UserType, { User } from './queryTypes/userType';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    mountains: {
      type: new GraphQLList(MountainType),
      resolve() {
        return Mountain.find({});
      },
    },
    states: {
      type: new GraphQLList(StateType),
      resolve() {
        return State.find({});
      },
    },
    regions: {
      type: new GraphQLList(RegionType),
      resolve() {
        return Region.find({});
      },
    },
    peakLists: {
      type: new GraphQLList(PeakListType),
      resolve() {
        return PeakList.find({});
      },
    },
    peakListsSearch: {
      type: new GraphQLList(PeakListType),
      args: { searchQuery: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, { searchQuery }) {
        return PeakList.find({ name: { $regex: searchQuery, $options: 'i' } });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      },
    },
    mountain: {
      type: MountainType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Mountain.findById(id);
      },
    },
    state: {
      type: StateType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return State.findById(id);
      },
    },
    region: {
      type: RegionType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return Region.findById(id);
      },
    },
    peakList: {
      type: PeakListType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return PeakList.findById(id);
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return User.findById(id);
      },
    },
  }),
});

export default RootQuery;
