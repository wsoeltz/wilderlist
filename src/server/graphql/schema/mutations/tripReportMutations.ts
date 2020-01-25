/* tslint:disable:await-promise */
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import {
  TripReport as ITripReport,
  User as IUser,
} from '../../graphQLTypes';
import TripReportType, { TripReport } from '../queryTypes/tripReportType';
import { User } from '../queryTypes/userType';
import { isCorrectUser } from '../../authorization';

interface AddTripReportVariables extends ITripReport {
  id: never;
}

const conditionsExist = (input: AddTripReportVariables) => {
  const {
    mountains, users, notes, link,
    mudMinor, mudMajor, waterSlipperyRocks, waterOnTrail, leavesSlippery,
    iceBlack, iceBlue, iceCrust, snowIceFrozenGranular, snowIceMonorailStable,
    snowIceMonorailUnstable, snowIcePostholes, snowMinor, snowPackedPowder,
    snowUnpackedPowder, snowDrifts, snowSticky, snowSlush, obstaclesBlowdown,
    obstaclesOther,
  } = input;
  return (
    (mountains && mountains.length > 1) || (users && users.length > 0) || notes || link ||
    mudMinor || mudMajor || waterSlipperyRocks || waterOnTrail || leavesSlippery ||
    iceBlack || iceBlue || iceCrust || snowIceFrozenGranular || snowIceMonorailStable ||
    snowIceMonorailUnstable || snowIcePostholes || snowMinor || snowPackedPowder ||
    snowUnpackedPowder || snowDrifts || snowSticky || snowSlush || obstaclesBlowdown ||
    obstaclesOther
  );
};

const tripReportMutations: any = {
  addTripReport: {
    type: TripReportType,
    args: {
      date: { type: GraphQLNonNull(GraphQLString) },
      author: { type: GraphQLNonNull(GraphQLID) },
      mountains: { type: new GraphQLList(GraphQLID)},
      users: { type: new GraphQLList(GraphQLID)},
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
          throw new Error('Invalid user match')
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
      users: { type: new GraphQLList(GraphQLID)},
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
            throw new Error('Invalid user match')
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
          throw new Error('Invalid user match')
        }
        return TripReport.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
};

export default tripReportMutations;
