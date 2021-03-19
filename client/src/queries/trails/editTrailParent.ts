import { gql, useMutation } from '@apollo/client';
import {
  Trail,
} from '../../types/graphQLTypes';

const EDIT_PARENT_TRAIL = gql`
  mutation(
    $id: ID!,
    $name: String!,
    $children: [ID!]!,
    $bbox: [Float!]!,
    $states: [ID!]!,
    $trailLength: Float!,
  ) {
    trail: updateParentRouteTrail(
      id: $id,
      name: $name,
      children: $children,
      bbox: $bbox,
      states: $states,
      trailLength: $trailLength,
    ) {
        id
        name
        bbox
        locationText
        locationTextShort
        trailLength
        children {
          id
          name
        }
    }
  }
`;

export interface SuccessResponse {
  trail: null | {
    id: Trail['id'];
    bbox: Trail['bbox'];
    locationText: Trail['locationText'];
    locationTextShort: Trail['locationTextShort'];
    trailLength: Trail['trailLength'];
  };
}

export interface Variables {
  id: string;
  name: string;
  children: string[];
  bbox: [number, number, number, number];
  states: string[];
  trailLength: number;
}

export const useEditParentTrail = () => {
  const [editParentTrail] = useMutation<SuccessResponse, Variables>(EDIT_PARENT_TRAIL);
  return editParentTrail;
};
