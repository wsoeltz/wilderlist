import { gql, useMutation, useQuery } from '@apollo/client';
import { User } from '../../types/graphQLTypes';
import {
  ACCEPT_FRIEND_REQUEST,
  FriendRequestSuccessResponse,
  FriendRequestVariables,
  REMOVE_FRIEND,
} from '../users/friendRequestMutations';

const GET_NOTIFICATIONS = gql`
  query notifications($userId: ID) {
    user(id: $userId) {
      id
      friendRequests {
        user {
          id
          name
        }
      }
      ascentNotifications {
        id
        user {
          id
          name
        }
        mountain {
          id
          name
          state {
            id
            abbreviation
          }
          location
          elevation
        }
        date
      }

      trailNotifications {
        id
        user {
          id
          name
        }
        trail {
          id
          name
          center
          type
        }
        date
      }

      campsiteNotifications {
        id
        user {
          id
          name
        }
        campsite {
          id
          name
          location
          type
        }
        date
      }

    }
  }
`;

export interface SuccessResponse {
  user: null | {
    id: User['id'];
    ascentNotifications: User['ascentNotifications'];
    trailNotifications: User['trailNotifications'];
    campsiteNotifications: User['campsiteNotifications'];
    friendRequests: User['friendRequests'];
  };
}

const CLEAR_ASCENT_NOTIFICATION = gql`
  mutation clearAscentNotification(
    $userId: ID!,
    $mountainId: ID,
    $trailId: ID,
    $campsiteId: ID,
    $date: String!
    ) {
    user: clearAscentNotification(
      userId: $userId,
      mountainId: $mountainId,
      trailId: $trailId,
      campsiteId: $campsiteId,
      date: $date
    ) {
      id
      ascentNotifications {
        id
        user {
          id
          name
        }
        mountain {
          id
          name
          state {
            id
            abbreviation
          }
          location
          elevation
        }
        date
      }

      trailNotifications {
        id
        user {
          id
          name
        }
        trail {
          id
          name
          center
          type
        }
        date
      }

      campsiteNotifications {
        id
        user {
          id
          name
        }
        campsite {
          id
          name
          location
          type
        }
        date
      }
    }
  }
`;

export interface ClearNotificationVariables {
  userId: string;
  mountainId: string | null;
  trailId: string | null;
  campsiteId: string | null;
  date: string;
}

export const refetchUsersNotifications = (userId: string) => ({query: GET_NOTIFICATIONS, variables: {userId}})

export const useGetNotifications = (userId: string) => useQuery<SuccessResponse, {userId: string}>(
  GET_NOTIFICATIONS, {variables: { userId }},
);

export const useClearAscentNotification = (userId: string) => {
  const [clearAscentNotification] =
  useMutation<SuccessResponse, ClearNotificationVariables>(CLEAR_ASCENT_NOTIFICATION, {
    refetchQueries: () => [{query: GET_NOTIFICATIONS, variables: { userId }}],
  });
  return clearAscentNotification;
};

export const useAcceptFriendRequestMutation = (userId: string) => {
  const [acceptFriendRequestMutation] =
  useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(ACCEPT_FRIEND_REQUEST, {
    refetchQueries: () => [{query: GET_NOTIFICATIONS, variables: { userId }}],
  });
  return acceptFriendRequestMutation;
};

export const useRemoveFriendMutation = (userId: string) => {
  const [removeFriendMutation] =
  useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(REMOVE_FRIEND, {
    refetchQueries: () => [{query: GET_NOTIFICATIONS, variables: { userId }}],
  });
  return removeFriendMutation;
};
