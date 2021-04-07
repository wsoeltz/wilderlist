import { gql, useMutation, useQuery } from '@apollo/client';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
  Campsite,
  User,
} from '../../types/graphQLTypes';

const GET_USERS_SAVED_CAMPSITES = gql`
  query GetSavedCampsites($userId: ID) {
    user(id: $userId) {
      id
      savedCampsites {
        id
        name
        type
        location
        locationTextShort
      }
    }
  }
`;

const SAVE_MOUNTAIN_TO_USER = gql`
  mutation SaveCampsiteToUser($userId: ID!, $campsiteId: ID!) {
    user: saveCampsiteToUser(userId: $userId, campsiteId: $campsiteId) {
      id
      savedCampsites {
        id
        name
        type
        location
        locationTextShort
      }
    }
  }
`;

const REMOVED_SAVED_MOUNTAIN_FROM_USER = gql`
  mutation RemoveSaveCampsiteToUser($userId: ID!, $campsiteId: ID!) {
    user: removeSavedCampsiteFromUser(userId: $userId, campsiteId: $campsiteId) {
      id
      savedCampsites {
        id
        name
        type
        location
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
  campsiteId: string;
}

export interface CampsiteDatum {
  id: Campsite['id'];
  name: Campsite['name'];
  type: Campsite['type'];
  location: Campsite['location'];
  locationTextShort: Campsite['locationTextShort'];
}

interface SuccessResponse {
  user: null | {
    id: User['id'];
    savedCampsites: Array<null | CampsiteDatum>;
  };
}

export const useSavedCampsites = () => {
  const user = useCurrentUser();
  const userId = user && user._id ? user._id : null;

  const response = useQuery<SuccessResponse, Variables>(
    GET_USERS_SAVED_CAMPSITES, {variables: {userId}},
  );

  const [saveCampsiteToUser] = useMutation<SuccessResponse, MutationVariables>(
    SAVE_MOUNTAIN_TO_USER, {
      refetchQueries: [{query: GET_USERS_SAVED_CAMPSITES, variables: {userId}}],
    });

  const [removeSavedCampsiteFromUser] = useMutation<SuccessResponse, MutationVariables>(
    REMOVED_SAVED_MOUNTAIN_FROM_USER, {
      refetchQueries: [{query: GET_USERS_SAVED_CAMPSITES, variables: {userId}}],
    });

  return {response, saveCampsiteToUser, removeSavedCampsiteFromUser};
};
