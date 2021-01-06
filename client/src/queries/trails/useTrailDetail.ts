import { gql, useQuery } from '@apollo/client';
import {
  State,
  Trail,
} from '../../types/graphQLTypes';

const GET_TRAIL_DETAIL = gql`
  query getTrail($id: ID) {
    trail(id: $id) {
      id
      name
      center
      line
      type
      states {
        id
        name
        abbreviation
      }
      children {
        id
        name
        center
        type
        line
      }
      parents {
        id
        name
      }
    }
  }
`;

interface QuerySuccessResponse {
  trail: null | {
    id: Trail['id'];
    name: Trail['name'];
    center: Trail['center'];
    line: Trail['line'];
    type: Trail['type'];
    states: Array<{
      id: State['id'];
      name: State['name'];
      abbreviation: State['abbreviation'];
    }>;
    children: Array<{
      id: Trail['id'];
      name: Trail['name'];
      center: Trail['center'];
      type: Trail['type'];
      line: Trail['line'];
    }>;
    parents: Array<{
      id: Trail['id'];
      name: Trail['name'];
    }>;
  };
}

interface QueryVariables {
  id: string | null;
}

export const useTrailDetail = (id: string | null) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_TRAIL_DETAIL, {
    variables: { id },
  });
