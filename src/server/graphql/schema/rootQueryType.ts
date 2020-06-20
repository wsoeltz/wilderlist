/* tslint:disable:await-promise */
import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { CreatedItemStatus } from '../graphQLTypes';
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
      async resolve(parentValue, { searchQuery, pageNumber, nPerPage, state}) {
        try {
          const searchWords: string[] = searchQuery.toLowerCase().split(' ');
          const keywordRegex = searchWords.join('|');
          const targetStates = keywordRegex ? await State.find({
            $or: [
              { name: { $regex: keywordRegex, $options: 'i' } },
              { abbreviation: { $regex: keywordRegex, $options: 'i' } },
            ],
          }) : [];
          let stateIds: string[] = state ? [state] : [];
          let wordsToIgnore: string[] = [];
          for (const s of targetStates) {
            const {_id, name, abbreviation} = s;
            stateIds.push(_id);
            const stateKeywords = [...name.toLowerCase().split(' '), abbreviation.toLowerCase()];
            let perfectMatch: string = '';
            stateKeywords.forEach(k => {
              const matchingWords = searchWords.filter(w => {
                if (w === name.toLowerCase() || w === abbreviation.toLowerCase()) {
                  perfectMatch = w;
                }
                return k.includes(w);
              });
              wordsToIgnore = [...wordsToIgnore, ...matchingWords];
            });
            if (perfectMatch) {
              stateIds = [_id];
              wordsToIgnore = [perfectMatch];
              break;
            }
          }
          const queryWithoutStateName = searchWords.filter(w1 => !wordsToIgnore.find(w2 => w1 === w2)).join(' ');
          return Mountain
            .find({
              $or: [
                { name: { $regex: queryWithoutStateName, $options: 'i' }, state: { $in: stateIds } },
                { name: { $regex: searchQuery, $options: 'i' } },
              ],
            })
            .limit(nPerPage)
            .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
            .sort({ name: 1 });
        } catch (e) {
          return null;
        }
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
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        if (id === null) {
          return null;
        } else {
          return Mountain.findById(id);
        }
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
      args: { id: { type: GraphQLID } },
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
          .find({
            mountains: mountain,
            $or: [
              {notes: { $ne: null }},
              {link: { $ne: null }},
              {mudMinor: { $eq: true }},
              {mudMajor: { $eq: true }},
              {waterSlipperyRocks: { $eq: true }},
              {waterOnTrail: { $eq: true }},
              {leavesSlippery: { $eq: true }},
              {iceBlack: { $eq: true }},
              {iceBlue: { $eq: true }},
              {iceCrust: { $eq: true }},
              {snowIceFrozenGranular: { $eq: true }},
              {snowIceMonorailStable: { $eq: true }},
              {snowIceMonorailUnstable: { $eq: true }},
              {snowIcePostholes: { $eq: true }},
              {snowMinor: { $eq: true }},
              {snowPackedPowder: { $eq: true }},
              {snowUnpackedPowder: { $eq: true }},
              {snowDrifts: { $eq: true }},
              {snowSticky: { $eq: true }},
              {snowSlush: { $eq: true }},
              {obstaclesBlowdown: { $eq: true }},
              {obstaclesOther: { $eq: true }},
            ],
          })
          .limit(nPerPage)
          .sort({ date: -1 });
      },
    },
    nearbyMountains: {
      type: new GraphQLList(MountainType),
      args: {
        latitude: { type: GraphQLNonNull(GraphQLFloat) },
        longitude: { type: GraphQLNonNull(GraphQLFloat) },
        latDistance: { type: GraphQLNonNull(GraphQLFloat) },
        longDistance: { type: GraphQLNonNull(GraphQLFloat) },
      },
      resolve(parentValue, { latitude, longitude, latDistance, longDistance }:
        {latitude: number, longitude: number, latDistance: number, longDistance: number}) {
        return Mountain.find({
          latitude: { $gt: latitude - latDistance, $lt: latitude + latDistance },
          longitude: { $gt: longitude - longDistance, $lt: longitude + longDistance },
        });
      },
    },
    flaggedMountains: {
      type: new GraphQLList(MountainType),
      resolve() {
        return Mountain.find({ flag: { $ne: null } });
      },
    },
    pendingMountains: {
      type: new GraphQLList(MountainType),
      resolve() {
        return Mountain.find({ status: { $eq: CreatedItemStatus.pending } });
      },
    },
    flaggedPeakLists: {
      type: new GraphQLList(PeakListType),
      resolve() {
        return PeakList.find({ flag: { $ne: null } });
      },
    },
    pendingPeakLists: {
      type: new GraphQLList(PeakListType),
      resolve() {
        return PeakList.find({ status: { $eq: CreatedItemStatus.pending } });
      },
    },
  }),
});

export default RootQuery;
