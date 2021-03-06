import { gql, useMutation, useQuery } from '@apollo/client';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
  Mountain,
  User,
} from '../../types/graphQLTypes';

const GET_USERS_SAVED_MOUNTAINS = gql`
  query GetSavedMountains($userId: ID) {
    user(id: $userId) {
      id
      savedMountains {
        id
        name
        location
        elevation
        locationTextShort
      }
    }
  }
`;

const SAVE_MOUNTAIN_TO_USER = gql`
  mutation SaveMountainToUser($userId: ID!, $mountainId: ID!) {
    user: saveMountainToUser(userId: $userId, mountainId: $mountainId) {
      id
      savedMountains {
        id
        name
        location
        elevation
        locationTextShort
      }
    }
  }
`;

const REMOVED_SAVED_MOUNTAIN_FROM_USER = gql`
  mutation RemoveSaveMountainToUser($userId: ID!, $mountainId: ID!) {
    user: removeSavedMountainFromUser(userId: $userId, mountainId: $mountainId) {
      id
      savedMountains {
        id
        name
        location
        elevation
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
  mountainId: string;
}

interface SuccessResponse {
  user: null | {
    id: User['id'];
    savedMountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
      elevation: Mountain['elevation'];
      location: Mountain['location'];
      locationTextShort: Mountain['locationTextShort'];
    }>;
  };
}

export const useSavedMountains = () => {
  const user = useCurrentUser();
  const userId = user && user._id ? user._id : null;

  const response = useQuery<SuccessResponse, Variables>(
    GET_USERS_SAVED_MOUNTAINS, {variables: {userId}},
  );

  const [saveMountainToUser] = useMutation<SuccessResponse, MutationVariables>(
    SAVE_MOUNTAIN_TO_USER, {
      refetchQueries: [{query: GET_USERS_SAVED_MOUNTAINS, variables: {userId}}],
    });

  const [removeSavedMountainFromUser] = useMutation<SuccessResponse, MutationVariables>(
    REMOVED_SAVED_MOUNTAIN_FROM_USER, {
      refetchQueries: [{query: GET_USERS_SAVED_MOUNTAINS, variables: {userId}}],
    });

  return {response, saveMountainToUser, removeSavedMountainFromUser};
};
