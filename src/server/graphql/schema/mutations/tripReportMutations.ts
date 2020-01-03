/* tslint:disable:await-promise */
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import {
  TripReport as ITripReport,
} from '../../graphQLTypes';
import TripReportType, { TripReport } from '../queryTypes/tripReportType';

interface AddTripReportVariables extends ITripReport {
  id: never;
}

const conditionsExist = (input: AddTripReportVariables) => {
  const {
    mountains, users, perfectConditions,
    mud, ice, snow, obstacles, notes, link,
  } = input;
  return (
    (mountains && mountains.length > 1) || (users && users.length > 1) ||
    perfectConditions || mud || ice || snow || obstacles || notes || link
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
      perfectConditions: { type: GraphQLBoolean },
      mud: { type: GraphQLInt },
      water: { type: GraphQLInt },
      ice: { type: GraphQLInt },
      snow: { type: GraphQLInt },
      obstacles: { type: GraphQLInt },
      notes: { type: GraphQLString },
      link: { type: GraphQLString },
    },
    async resolve(_unused: any, input: AddTripReportVariables) {
      // check if report for date, mountain, and author already exists
      const { author, date, mountains } = input;
      try {
        const existingReport = await TripReport
            .findOne({
              author, date,
              mountains: mountains[0],
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
      perfectConditions: { type: GraphQLBoolean },
      mud: { type: GraphQLInt },
      water: { type: GraphQLInt },
      ice: { type: GraphQLInt },
      snow: { type: GraphQLInt },
      obstacles: { type: GraphQLInt },
      notes: { type: GraphQLString },
      link: { type: GraphQLString },
    },
    async resolve(_unused: any, input: ITripReport) {
      const { id, ...fields} = input;
      if (id) {
        try {
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
    async resolve(_unused: any, { id }: { id: string }) {
      try {
        return TripReport.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
};

export default tripReportMutations;
