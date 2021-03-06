/* tslint:disable:await-promise */
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { isCorrectUser } from '../../authorization';
import {
  TripReport as ITripReport,
  User as IUser,
} from '../../graphQLTypes';
import TripReportType, { TripReport } from '../queryTypes/tripReportType';
import { User } from '../queryTypes/userType';
import addEditTripReport, {Input} from './tripReport/addEditTripReport';

interface AddTripReportVariables extends ITripReport {
  id: never;
}

const conditionsExist = (input: AddTripReportVariables) => {
  const {
    mountains, trails, campsites, parent, privacy, users, notes, link,
    mudMinor, mudMajor, waterSlipperyRocks, waterOnTrail, leavesSlippery,
    iceBlack, iceBlue, iceCrust, snowIceFrozenGranular, snowIceMonorailStable,
    snowIceMonorailUnstable, snowIcePostholes, snowMinor, snowPackedPowder,
    snowUnpackedPowder, snowDrifts, snowSticky, snowSlush, obstaclesBlowdown,
    obstaclesOther,
  } = input;
  return (
    (mountains && mountains.length > 1) || (trails && trails.length > 1) ||
    (campsites && campsites.length > 1) || (users && users.length > 0) || notes || link ||
    mudMinor || mudMajor || waterSlipperyRocks || waterOnTrail || leavesSlippery ||
    iceBlack || iceBlue || iceCrust || snowIceFrozenGranular || snowIceMonorailStable ||
    snowIceMonorailUnstable || snowIcePostholes || snowMinor || snowPackedPowder ||
    snowUnpackedPowder || snowDrifts || snowSticky || snowSlush || obstaclesBlowdown ||
    obstaclesOther || parent || privacy
  );
};

const tripReportMutations: any = {
  addTripReport: {
    type: TripReportType,
    args: {
      date: { type: GraphQLNonNull(GraphQLString) },
      author: { type: GraphQLNonNull(GraphQLID) },
      mountains: { type: new GraphQLList(GraphQLID)},
      trails: { type: new GraphQLList(GraphQLID)},
      campsites: { type: new GraphQLList(GraphQLID)},
      users: { type: new GraphQLList(GraphQLID)},
      privacy: { type: GraphQLString },
      notes: { type: GraphQLString },
      link: { type: GraphQLString },
      mudMinor: { type: GraphQLBoolean },
      mudMajor: { type: GraphQLBoolean },
      waterSlipperyRocks: { type: GraphQLBoolean },
      waterOnTrail: { type: GraphQLBoolean },
      leavesSlippery: { type: GraphQLBoolean },
      iceBlack: { type: GraphQLBoolean },
      iceBlue: { type: GraphQLBoolean },
      iceCrust: { type: GraphQLBoolean },
      snowIceFrozenGranular: { type: GraphQLBoolean },
      snowIceMonorailStable: { type: GraphQLBoolean },
      snowIceMonorailUnstable: { type: GraphQLBoolean },
      snowIcePostholes: { type: GraphQLBoolean },
      snowMinor: { type: GraphQLBoolean },
      snowPackedPowder: { type: GraphQLBoolean },
      snowUnpackedPowder: { type: GraphQLBoolean },
      snowDrifts: { type: GraphQLBoolean },
      snowSticky: { type: GraphQLBoolean },
      snowSlush: { type: GraphQLBoolean },
      obstaclesBlowdown: { type: GraphQLBoolean },
      obstaclesOther: { type: GraphQLBoolean },
    },
    async resolve(_unused: any, input: AddTripReportVariables, {user}: {user: IUser | undefined | null}) {
      // check if report for date, mountain, and author already exists
      const { author, date, mountains } = input;
      try {
        const authorObj = await User.findById(author);
        if (!isCorrectUser(user, authorObj)) {
          throw new Error('Invalid user match');
        }
        const existingReport = await TripReport
            .findOne({
              author, date,
              mountains: { $in: mountains },
            });
        if (existingReport === null && conditionsExist(input)) {
          // create and return a new trip report
          const newTripReport = new TripReport({...input});
          return newTripReport.save();
        }
        // else do nothing
      } catch (err) {
        return err;
      }
    },
  },
  editTripReport: {
    type: TripReportType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      date: { type: GraphQLNonNull(GraphQLString) },
      author: { type: GraphQLNonNull(GraphQLID) },
      mountains: { type: new GraphQLList(GraphQLID)},
      trails: { type: new GraphQLList(GraphQLID)},
      campsites: { type: new GraphQLList(GraphQLID)},
      users: { type: new GraphQLList(GraphQLID)},
      privacy: { type: GraphQLString },
      notes: { type: GraphQLString },
      link: { type: GraphQLString },
      mudMinor: { type: GraphQLBoolean },
      mudMajor: { type: GraphQLBoolean },
      waterSlipperyRocks: { type: GraphQLBoolean },
      waterOnTrail: { type: GraphQLBoolean },
      leavesSlippery: { type: GraphQLBoolean },
      iceBlack: { type: GraphQLBoolean },
      iceBlue: { type: GraphQLBoolean },
      iceCrust: { type: GraphQLBoolean },
      snowIceFrozenGranular: { type: GraphQLBoolean },
      snowIceMonorailStable: { type: GraphQLBoolean },
      snowIceMonorailUnstable: { type: GraphQLBoolean },
      snowIcePostholes: { type: GraphQLBoolean },
      snowMinor: { type: GraphQLBoolean },
      snowPackedPowder: { type: GraphQLBoolean },
      snowUnpackedPowder: { type: GraphQLBoolean },
      snowDrifts: { type: GraphQLBoolean },
      snowSticky: { type: GraphQLBoolean },
      snowSlush: { type: GraphQLBoolean },
      obstaclesBlowdown: { type: GraphQLBoolean },
      obstaclesOther: { type: GraphQLBoolean },
    },
    async resolve(_unused: any, input: ITripReport, {user}: {user: IUser | undefined | null}) {
      const { id, ...fields} = input;
      if (id) {
        try {
          const authorObj = await User.findById(input.author);
          if (!isCorrectUser(user, authorObj)) {
            throw new Error('Invalid user match');
          }
          if (conditionsExist(fields as AddTripReportVariables)) {
            // modify and return trip report
            const newTripReport = await TripReport.findOneAndUpdate({
              _id: id,
            },
            { ...fields },
            {new: true});
            return newTripReport;
          } else {
            // else delete the report as it is empty
              return TripReport.findByIdAndDelete(id);
          }
        } catch (err) {
          return err;
        }
      }
    },
  },
  deleteTripReport: {
    type: TripReportType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }, {user}: {user: IUser | undefined | null}) {
      try {
        const tripReportObj = await TripReport.findById(id);
        const authorId = tripReportObj && tripReportObj.author ? tripReportObj.author : null;
        const authorObj = await User.findById(authorId);
        if (!isCorrectUser(user, authorObj)) {
          throw new Error('Invalid user match');
        }
        return TripReport.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
  addEditTripReport: {
    type: TripReportType,
    args: {
      id: { type: GraphQLID },
      date: { type: GraphQLString },
      author: { type: GraphQLNonNull(GraphQLID) },
      mountains: { type: new GraphQLList(GraphQLID)},
      trails: { type: new GraphQLList(GraphQLID)},
      campsites: { type: new GraphQLList(GraphQLID)},
      users: { type: new GraphQLList(GraphQLID)},
      privacy: { type: GraphQLString },
      notes: { type: GraphQLString },
      link: { type: GraphQLString },
      mudMinor: { type: GraphQLBoolean },
      mudMajor: { type: GraphQLBoolean },
      waterSlipperyRocks: { type: GraphQLBoolean },
      waterOnTrail: { type: GraphQLBoolean },
      leavesSlippery: { type: GraphQLBoolean },
      iceBlack: { type: GraphQLBoolean },
      iceBlue: { type: GraphQLBoolean },
      iceCrust: { type: GraphQLBoolean },
      snowIceFrozenGranular: { type: GraphQLBoolean },
      snowIceMonorailStable: { type: GraphQLBoolean },
      snowIceMonorailUnstable: { type: GraphQLBoolean },
      snowIcePostholes: { type: GraphQLBoolean },
      snowMinor: { type: GraphQLBoolean },
      snowPackedPowder: { type: GraphQLBoolean },
      snowUnpackedPowder: { type: GraphQLBoolean },
      snowDrifts: { type: GraphQLBoolean },
      snowSticky: { type: GraphQLBoolean },
      snowSlush: { type: GraphQLBoolean },
      obstaclesBlowdown: { type: GraphQLBoolean },
      obstaclesOther: { type: GraphQLBoolean },
      // additional inputs not directly in TripReport:
      originalDate: { type: GraphQLString },
      originalMountains: { type: new GraphQLList(GraphQLID)},
      originalTrails: { type: new GraphQLList(GraphQLID)},
      originalCampsites: { type: new GraphQLList(GraphQLID)},
    },
    async resolve(_unused: any, input: Input, {user}: {user: IUser | undefined | null}) {
      try {
        const authorDoc = await User.findById(input.author);
        if (!isCorrectUser(user, authorDoc)) {
          throw new Error('Invalid user match');
        }
        if (authorDoc) {
          return await addEditTripReport({...input, authorDoc});
        } else {
          throw new Error('Could not find author');
        }
      } catch (err) {
        return err;
      }
    },
  },
};

export default tripReportMutations;
