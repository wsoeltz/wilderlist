import { gql, useMutation } from '@apollo/client';
import {
  FriendStatus,
  User,
} from '../../types/graphQLTypes';

const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($userId: ID!, $friendId: ID!) {
  sendFriendRequest(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation acceptFriendRequest($userId: ID!, $friendId: ID!) {
  acceptFriendRequest(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($userId: ID!, $friendId: ID!) {
  removeFriend(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

export interface FriendRequestVariables {
  userId: string;
  friendId: string;
}

export interface FriendRequestSuccessResponse {
  id: User['id'];
  friends: Array<{
    user: {
      id: User['id'];
      friends: Array<{
        user: {
          id: User['id'];
        }
        status: FriendStatus;
      }>;
    },
    status: FriendStatus;
  }>;
}

export const useSendFriendRequestMutation = () => {
  const [sendFriendRequestMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(SEND_FRIEND_REQUEST);
  return sendFriendRequestMutation;
};
export const useAcceptFriendRequestMutation = () => {
  const [acceptFriendRequestMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(ACCEPT_FRIEND_REQUEST);
  return acceptFriendRequestMutation;
};
export const useRemoveFriendMutation = () => {
  const [removeFriendMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(REMOVE_FRIEND);
  return removeFriendMutation;
};
