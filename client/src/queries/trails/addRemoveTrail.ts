import { gql, useMutation } from '@apollo/client';
import {
  Trail,
  TrailType,
} from '../../types/graphQLTypes';

const EDIT_TRAIL = gql`
  mutation(
    $id: ID!,
    $name: String,
    $type: String!,
    $waterCrossing: String,
    $allowsBikes: Boolean,
    $allowsHorses: Boolean,
    $skiTrail: Boolean,
  ) {
    trail: updateTrail(
      id: $id,
      name: $name,
      type: $type,
      waterCrossing: $waterCrossing,
      allowsBikes: $allowsBikes,
      allowsHorses: $allowsHorses,
      skiTrail: $skiTrail,
    ) {
        id
        name
        type
        waterCrossing
        allowsBikes
        allowsHorses
        skiTrail
        flag
    }
  }
`;

export interface SuccessResponse {
  trail: null | {
    id: Trail['id'];
    name: Trail['name'];
    type: Trail['type'];
    waterCrossing: Trail['waterCrossing'];
    allowsBikes: Trail['allowsBikes'];
    allowsHorses: Trail['allowsHorses'];
    skiTrail: Trail['skiTrail'];
    flag: Trail['flag'];
  };
}

export interface Variables {
  id: string;
  name?: string | null;
  type: TrailType;
  waterCrossing?: string | null;
  allowsBikes?: boolean | null;
  allowsHorses?: boolean | null;
  skiTrail?: boolean | null;
}

export const useEditTrail = () => {
  const [editTrail] = useMutation<SuccessResponse, Variables>(EDIT_TRAIL);
  return editTrail;
};
