import { gql, useQuery } from '@apollo/client';
import {
  State,
  Trail,
} from '../../types/graphQLTypes';

const GET_TRAIL_SEGMENTS_WITH_STATES = gql`
  query GetTrailSegmentsWithStates($id: ID) {
    trail(id: $id) {
      id
      name
      flag
      children {
        id
        name
        line
        center
        type
        states {
          id
          abbreviation
        }
      }
    }
  }
`;

interface QuerySuccessResponse {
  trail: null | {
    id: Trail['id'];
    name: Trail['name'];
    flag: Trail['flag'];
    children: Array<{
      id: Trail['id'];
      name: Trail['name'];
      line: Trail['line'];
      center: Trail['center'];
      type: Trail['type'];
      states: Array<{id: State['id'], abbreviation: State['abbreviation']}>;
    }>;
  };
}

interface QueryVariables {
  id: string | null;
}

export const useTrailSegmentsWithStates = (id: string | null) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_TRAIL_SEGMENTS_WITH_STATES, {
    variables: { id },
  });
