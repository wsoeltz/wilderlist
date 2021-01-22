import { gql, useQuery } from '@apollo/client';
import { Conditions, TripReport } from '../../types/graphQLTypes';

export const nPerPage = 15;

export const GET_LATEST_TRIP_REPORTS_FOR_ITEM = gql`
  query getLatestTripReportsForItem(
    $mountain: ID,
    $campsite: ID,
    $trail: ID,
    $nPerPage: Int!,
  ) {
    tripReports: tripReportsForItem(
      mountain: $mountain,
      campsite: $campsite,
      trail: $trail,
      nPerPage: $nPerPage,
    ) {
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
  mountain: string | null;
  trail: string | null;
  campsite: string | null;
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

export interface Input {
  mountain?: string | null;
  trail?: string | null;
  campsite?: string | null;
  pageNumber: number;
}

export const refetchLatestTripReports = ({mountain, trail, campsite, pageNumber}: Input) =>
  ({query: GET_LATEST_TRIP_REPORTS_FOR_ITEM, variables: {
    mountain: mountain ? mountain : null,
    trail: trail ? trail : null,
    campsite: campsite ? campsite : null,
    nPerPage: nPerPage * pageNumber,
  }});

export const useLatestTripReports = ({mountain, trail, campsite, pageNumber}: Input) =>
  useQuery<SuccessResponse, QueryVariables>(
    GET_LATEST_TRIP_REPORTS_FOR_ITEM, {variables: {
      mountain: mountain ? mountain : null,
      trail: trail ? trail : null,
      campsite: campsite ? campsite : null,
      nPerPage: nPerPage * pageNumber,
    }},
  );
