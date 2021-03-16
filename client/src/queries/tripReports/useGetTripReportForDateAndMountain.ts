import { gql, useQuery } from '@apollo/client';
import {
  Campsite,
  Conditions,
  Mountain,
  Trail,
  TripReport,
  User,
} from '../../types/graphQLTypes';

const GET_TRIP_REPORT_FOR_USER_ITEM_DATE = gql`
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
        locationTextShort
        elevation
        location
      }
      trails {
        id
        name
        type
        center
        line
        trailLength
        locationTextShort
      }
      campsites {
        id
        name
        type
        locationTextShort
        location
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
  tripReport: null | Conditions & {
    id: TripReport['id'];
    date: TripReport['date'];
    author: null | {
      id: User['id'];
      name: User['name'];
    };
    mountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
      locationTextShort: Mountain['name'];
      elevation: Mountain['elevation'];
      location: Mountain['location'];
    } | null>;
    trails: Array<{
      id: Trail['id'];
      name: Trail['name'];
      type: Trail['type'];
      center: Trail['center'];
      line: Trail['line'];
      trailLength: Trail['trailLength'];
      locationTextShort: Mountain['name'];
    } | null>;
    campsites: Array<{
      id: Campsite['id'];
      name: Campsite['name'];
      type: Campsite['type'];
      locationTextShort: Mountain['name'];
      location: Campsite['location'];
    } | null>;
    users: Array<{
      id: User['id'];
      name: User['name'];
    } | null>;
    notes: TripReport['notes'];
    link: TripReport['link'];
    privacy: TripReport['privacy'];
  };
}

interface QueryVariables {
  author: string;
  mountain: string | null;
  trail: string | null;
  campsite: string | null;
  date: string;
}

export const refetchTripReportForDateAndMountain = (variables: QueryVariables) => (
  {query: GET_TRIP_REPORT_FOR_USER_ITEM_DATE, variables, fetchPolicy: 'no-cache'}
);

export const useGetTripReportForDateAndMountain = (variables: QueryVariables) =>
  useQuery<SuccessResponse, QueryVariables>(GET_TRIP_REPORT_FOR_USER_ITEM_DATE, {variables, fetchPolicy: 'no-cache'});
