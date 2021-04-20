import { gql, useQuery } from '@apollo/client';
import { State } from '../../types/graphQLTypes';

const GET_STATES = gql`
  query getStates {
    states {
      id
      name
      abbreviation
    }
  }
`;

export interface StateDatum {
  id: State['id'];
  name: State['name'];
  abbreviation: State['abbreviation'];
}

interface QuerySuccessResponse {
  states: StateDatum[];
}

export const useStates = () => useQuery<QuerySuccessResponse>(GET_STATES);
