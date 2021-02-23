import { gql, useQuery } from '@apollo/client';
import {
  Trail,
} from '../../types/graphQLTypes';

const GET_BASIC_TRAIL_DETAIL = gql`
  query GetBasicTrailData($id: ID) {
    trail(id: $id) {
      id
      name
      center
      line
      bbox
      type
      childrenCount
      trailLength
      avgSlope
      locationText
      locationTextShort
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
    bbox: Trail['bbox'];
    type: Trail['type'];
    childrenCount: Trail['childrenCount'];
    trailLength: Trail['trailLength'];
    avgSlope: Trail['avgSlope'];
    locationText: Trail['locationText'];
    locationTextShort: Trail['locationTextShort'];
    parents: Array<{
      id: Trail['id'];
      name: Trail['name'];
    }>;
  };
}

interface QueryVariables {
  id: string | null;
}

export const useBasicTrailDetail = (id: string | null) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_BASIC_TRAIL_DETAIL, {
    variables: { id },
  });
