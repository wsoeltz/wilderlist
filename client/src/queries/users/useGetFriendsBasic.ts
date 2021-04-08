import { gql, useQuery } from '@apollo/client';
import {
  User,
} from '../../types/graphQLTypes';

const GET_FRIENDS = gql`
  query getFriends($userId: ID) {
    user(id: $userId) {
      id
      friends {
        user {
          id
          name
        }
        status
      }
    }
  }
`;

export interface FriendsDatum {
  user: {
    id: User['id'];
    friends: User['friends'];
  };
}

export const useGetFriendsBasic = (userId: string) => useQuery<FriendsDatum, {userId: string}>(GET_FRIENDS, {
  variables: { userId },
});
