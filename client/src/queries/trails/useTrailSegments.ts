import { gql, useQuery } from '@apollo/client';
import {
  Trail,
} from '../../types/graphQLTypes';

const GET_TRAIL_SEGMENTS = gql`
  query GetBasicTrailData($id: ID) {
    trail(id: $id) {
      id
      children {
        id
        name
        line
        center
        type
        locationTextShort
        trailLength
        avgSlope
      }
    }
  }
`;

interface QuerySuccessResponse {
  trail: null | {
    id: Trail['id'];
    children: Array<{
      id: Trail['id'];
      name: Trail['name'];
      line: Trail['line'];
      center: Trail['center'];
      type: Trail['type'];
      locationTextShort: Trail['locationTextShort'];
      trailLength: Trail['trailLength'];
      avgSlope: Trail['avgSlope'];
    }>;
  };
}

interface QueryVariables {
  id: string | null;
}

export const useTrailSegments = (id: string | null) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_TRAIL_SEGMENTS, {
    variables: { id },
  });
