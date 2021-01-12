import { gql, useQuery } from '@apollo/client';
import {
  State,
  Trail,
} from '../../types/graphQLTypes';

const GET_TRAILS_FROM_LIST = gql`
  query getTrailsIn($ids: [ID]) {
    trails: trailsIn(ids: $ids) {
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
  trails: Array<{
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
  }>;
}

interface QueryVariables {
  ids: string[];
}

export const useTrailsFromList = (ids: string[]) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_TRAILS_FROM_LIST, {
    variables: { ids },
  });
