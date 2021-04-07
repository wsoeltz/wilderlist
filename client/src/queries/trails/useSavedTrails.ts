import { gql, useMutation, useQuery } from '@apollo/client';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
  Trail,
  User,
} from '../../types/graphQLTypes';

const GET_USERS_SAVED_TRAILS = gql`
  query GetSavedTrails($userId: ID) {
    user(id: $userId) {
      id
      savedTrails {
        id
        name
        type
        trailLength
        avgSlope
        line
        center
        locationTextShort
      }
    }
  }
`;

const SAVE_MOUNTAIN_TO_USER = gql`
  mutation SaveTrailToUser($userId: ID!, $trailId: ID!) {
    user: saveTrailToUser(userId: $userId, trailId: $trailId) {
      id
      savedTrails {
        id
        name
        type
        trailLength
        avgSlope
        line
        center
        locationTextShort
      }
    }
  }
`;

const REMOVED_SAVED_MOUNTAIN_FROM_USER = gql`
  mutation RemoveSaveTrailToUser($userId: ID!, $trailId: ID!) {
    user: removeSavedTrailFromUser(userId: $userId, trailId: $trailId) {
      id
      savedTrails {
        id
        name
        type
        trailLength
        avgSlope
        line
        center
        locationTextShort
      }
    }
  }
`;

interface Variables {
  userId: string | null;
}

interface MutationVariables {
  userId: string;
  trailId: string;
}

export interface TrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  trailLength: Trail['trailLength'];
  avgSlope: Trail['avgSlope'];
  line: Trail['line'];
  center: Trail['center'];
  locationTextShort: Trail['locationTextShort'];
}

interface SuccessResponse {
  user: null | {
    id: User['id'];
    savedTrails: Array<null | TrailDatum>;
  };
}

export const useSavedTrails = () => {
  const user = useCurrentUser();
  const userId = user && user._id ? user._id : null;

  const response = useQuery<SuccessResponse, Variables>(
    GET_USERS_SAVED_TRAILS, {variables: {userId}},
  );

  const [saveTrailToUser] = useMutation<SuccessResponse, MutationVariables>(
    SAVE_MOUNTAIN_TO_USER, {
      refetchQueries: [{query: GET_USERS_SAVED_TRAILS, variables: {userId}}],
    });

  const [removeSavedTrailFromUser] = useMutation<SuccessResponse, MutationVariables>(
    REMOVED_SAVED_MOUNTAIN_FROM_USER, {
      refetchQueries: [{query: GET_USERS_SAVED_TRAILS, variables: {userId}}],
    });

  return {response, saveTrailToUser, removeSavedTrailFromUser};
};
