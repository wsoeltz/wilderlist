import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Campsite,
  Mountain,
  Trail,
  User,
} from '../../types/graphQLTypes';
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
          locationTextShort
          elevation
          location
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
          type
          center
          line
          trailLength
          locationTextShort
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
          type
          locationTextShort
          location
        }
        date
      }

    }
  }
`;

export interface SuccessResponse {
  user: null | {
    id: User['id'];
    ascentNotifications: null | Array<{
      id: string;
      user: User | null;
      mountain: null | {
        id: Mountain['id'];
        name: Mountain['name'];
        locationTextShort: Mountain['name'];
        elevation: Mountain['elevation'];
        location: Mountain['location'];
      };
      date: string;
    }>;
    trailNotifications: null | Array<{
      id: string;
      user: User | null;
      trail: null | {
        id: Trail['id'];
        name: Trail['name'];
        type: Trail['type'];
        center: Trail['center'];
        line: Trail['line'];
        trailLength: Trail['trailLength'];
        locationTextShort: Mountain['name'];
      };
      date: string;
    }>;
    campsiteNotifications: null | Array<{
      id: string;
      user: User | null;
      campsite: null | {
        id: Campsite['id'];
        name: Campsite['name'];
        type: Campsite['type'];
        locationTextShort: Mountain['name'];
        location: Campsite['location'];
      };
      date: string;
    }>;
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

export const refetchUsersNotifications = (userId: string) => ({query: GET_NOTIFICATIONS, variables: {userId}});

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
