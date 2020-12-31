import { gql, useQuery } from '@apollo/client';
import { TripReport } from '../../types/graphQLTypes';

const GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE = gql`
  query tripReportByAuthorDateAndMountain
    ($author: ID!, $mountain: ID!, $date: String!) {
    tripReport: tripReportByAuthorDateAndMountain(
    author: $author, mountain: $mountain, date: $date,) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
        state {
          id
          abbreviation
        }
        elevation
        latitude
        longitude
      }
      users {
        id
        name
      }
      notes
      link
      mudMinor
      mudMajor
      waterSlipperyRocks
      waterOnTrail
      leavesSlippery
      iceBlack
      iceBlue
      iceCrust
      snowIceFrozenGranular
      snowIceMonorailStable
      snowIceMonorailUnstable
      snowIcePostholes
      snowMinor
      snowPackedPowder
      snowUnpackedPowder
      snowDrifts
      snowSticky
      snowSlush
      obstaclesBlowdown
      obstaclesOther
    }
  }
`;

interface SuccessResponse {
  tripReport: TripReport | null;
}

interface QueryVariables {
  author: string;
  mountain: string;
  date: string;
}

export const refetchTripReportForDateAndMountain = (variables: QueryVariables) => (
  {query: refetchTripReportForDateAndMountain, variables}
);

export const useGetTripReportForDateAndMountain = (variables: QueryVariables) =>
  useQuery<SuccessResponse, QueryVariables>(GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE, {variables});
