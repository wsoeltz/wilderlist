import { gql, useQuery } from '@apollo/client';
import usePrevious from '../../hooks/usePrevious';
import { Mountain, State } from '../../types/graphQLTypes';

const SEARCH_MOUNTAINS = gql`
  query SearchMountains(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!
    $state: ID,
    $minElevation: Float,
    $maxElevation: Float,
  ) {
    mountains: mountainSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
      state: $state,
      minElevation: $minElevation,
      maxElevation: $maxElevation,
    ) {
      id
      name
      state {
        id
        abbreviation
      }
      elevation
      location
    }
  }
`;

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
  elevation: Mountain['elevation'];
  location: Mountain['location'];
}

interface SuccessResponse {
  mountains: MountainDatum[];
}

interface Variables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
  state: string | null;
  minElevation: number | null;
  maxElevation: number | null;
}

export const useBasicSearchMountains = (variables: Variables) => {
  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_MOUNTAINS, {variables});

  const prevData = usePrevious(data);

  let dataToUse: SuccessResponse | undefined;
  if (data !== undefined) {
    dataToUse = data;
  } else if (prevData !== undefined) {
    dataToUse = prevData;
  } else {
    dataToUse = undefined;
  }

  return {loading, error, data: dataToUse};
};
