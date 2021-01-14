import { gql, useQuery } from '@apollo/client';
import { Conditions, TripReport } from '../../types/graphQLTypes';

export const nPerPage = 7;

export const GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN = gql`
  query getLatestTripReportsForMountain($mountain: ID!, $nPerPage: Int!) {
    tripReports: tripReportsForMountain(
    mountain: $mountain, nPerPage: $nPerPage) {
      id
      date
      author {
        id
        name
        hideProfileInSearch
      }
      mountains {
        id
        name
      }
      users {
        id
        name
        hideProfileInSearch
      }
      notes
      privacy
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

export interface SuccessResponse {
  tripReports: TripReport[];
}

interface QueryVariables {
  mountain: string;
  nPerPage: number;
}

export const isCondition = (key: string) => {
  const conditionsObject: Conditions = {
    mudMinor: null,
    mudMajor: null,
    waterSlipperyRocks: null,
    waterOnTrail: null,
    leavesSlippery: null,
    iceBlack: null,
    iceBlue: null,
    iceCrust: null,
    snowIceFrozenGranular: null,
    snowIceMonorailStable: null,
    snowIceMonorailUnstable: null,
    snowIcePostholes: null,
    snowMinor: null,
    snowPackedPowder: null,
    snowUnpackedPowder: null,
    snowDrifts: null,
    snowSticky: null,
    snowSlush: null,
    obstaclesBlowdown: null,
    obstaclesOther: null,
  };
  const conditionsKeys = Object.keys(conditionsObject);
  if (conditionsKeys.indexOf(key) !== -1) {
    return true;
  } else {
    return false;
  }
};

export const refetchLatestTripReports = (mountain: string, pageNumber: number) =>
  ({query: GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN, variables: {mountain, nPerPage: nPerPage * pageNumber}});

export const useLatestTripReports = (mountain: string, pageNumber: number) =>
  useQuery<SuccessResponse, QueryVariables>(
    GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN, {variables: { mountain, nPerPage: nPerPage * pageNumber }},
  );
