import { gql, useQuery } from '@apollo/client';
import { TripReport } from '../../types/graphQLTypes';

const GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE = gql`
  query GetTripReportByAuthorDateAndItems
    ($author: ID!, $mountain: ID, $trail: ID, $campsite: ID, $date: String!) {
    tripReport: tripReportByAuthorDateAndItems(
    author: $author, mountain: $mountain, trail: $trail, campsite: $campsite, date: $date,) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
        location
        state {
          id
          abbreviation
        }
        elevation
        latitude
        longitude
      }
      trails {
        id
        name
        center
        type
      }
      campsites {
        id
        name
        location
        type
      }
      users {
        id
        name
      }
      privacy
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
  mountain: string | null;
  trail: string | null;
  campsite: string | null;
  date: string;
}

export const refetchTripReportForDateAndMountain = (variables: QueryVariables) => (
  {query: GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE, variables}
);

export const useGetTripReportForDateAndMountain = (variables: QueryVariables) => 
  useQuery<SuccessResponse, QueryVariables>(GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE, {variables});
