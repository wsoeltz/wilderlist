import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import MountainType, { Mountain } from './queryTypes/mountainType';
import PeakListType, { PeakList } from './queryTypes/peakListType';
import RegionType, { Region } from './queryTypes/regionType';
import StateType, { State } from './queryTypes/stateType';
import TripReportType, { TripReport } from './queryTypes/tripReportType';
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
      async resolve() {
        return PeakList.find({});
      },
    },
    peakListsSearch: {
      type: new GraphQLList(PeakListType),
      args: {
        searchQuery: { type: new GraphQLNonNull(GraphQLString) },
        nPerPage: { type: GraphQLNonNull(GraphQLInt) },
        pageNumber: { type: GraphQLNonNull(GraphQLInt) },
        selectionArray: { type: GraphQLList(GraphQLID) },
      },
      resolve(parentValue, { searchQuery, pageNumber, nPerPage, selectionArray}) {
        const filter = selectionArray && selectionArray.length
          ? { searchString: { $regex: searchQuery, $options: 'i' },
              _id : { $in : selectionArray },
            }
          : { searchString: { $regex: searchQuery, $options: 'i' } };
        return PeakList
          .find(filter)
          .limit(nPerPage)
          .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
          .sort({ numUsers: -1, name: 1 });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      },
    },
    usersSearch: {
      type: new GraphQLList(UserType),
      args: {
        searchQuery: { type: new GraphQLNonNull(GraphQLString) },
        nPerPage: { type: GraphQLNonNull(GraphQLInt) },
        pageNumber: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, { searchQuery, pageNumber, nPerPage}) {
        return User
          .find({
            hideProfileInSearch: { $ne: true },
            name: { $regex: searchQuery, $options: 'i' },
          })
          .limit(nPerPage)
          .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
          .sort({ name: 1 });
      },
    },
    mountainSearch: {
      type: new GraphQLList(MountainType),
      args: {
        searchQuery: { type: new GraphQLNonNull(GraphQLString) },
        nPerPage: { type: GraphQLNonNull(GraphQLInt) },
        pageNumber: { type: GraphQLNonNull(GraphQLInt) },
        state: { type: GraphQLID },
      },
      resolve(parentValue, { searchQuery, pageNumber, nPerPage, state}) {
        const filter = state
          ? { name: { $regex: searchQuery, $options: 'i' },
              state,
            }
          : { name: { $regex: searchQuery, $options: 'i' } };
        return Mountain
          .find(filter)
          .limit(nPerPage)
          .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
          .sort({ name: 1 });
      },
    },
    tripReports: {
      type: new GraphQLList(TripReportType),
      async resolve() {
        return TripReport.find({});
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
      args: { id: { type: GraphQLID } },
      resolve(parnetValue, { id }) {
        return User.findById(id);
      },
    },
    tripReport: {
      type: TripReportType,
      args: { id: { type: GraphQLID } },
      resolve(parnetValue, { id }) {
        return TripReport.findById(id);
      },
    },
    tripReportByAuthorDateAndMountain: {
      type: TripReportType,
      args: {
        author: { type: GraphQLNonNull(GraphQLID) },
        date: { type: GraphQLNonNull(GraphQLString) },
        mountain: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { author, date, mountain}) {
        return TripReport
          .findOne({
            author, date,
            mountains: mountain,
          });
      },
    },
    tripReportsForMountain: {
      type: new GraphQLList(TripReportType),
      args: {
        mountain: { type: GraphQLNonNull(GraphQLID) },
        nPerPage: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, {mountain, nPerPage}) {
        return TripReport
          .find({mountains: mountain})
          .limit(nPerPage)
          .sort({ date: -1 });
      },
    },
  }),
});

export default RootQuery;
