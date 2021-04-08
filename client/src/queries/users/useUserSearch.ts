import { gql, useQuery } from '@apollo/client';
import { FriendStatus, User} from '../../types/graphQLTypes';

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  profilePictureUrl: User['profilePictureUrl'];
  hideProfilePicture: User['hideProfilePicture'];
}

export interface FriendDatum {
  user: UserDatum;
  status: FriendStatus;
}

const SEARCH_USERS = gql`
  query searchUsers(
    $id: ID!
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!
  ) {
    users: usersSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      profilePictureUrl
      hideProfilePicture
    }
    me: user(id: $id) {
      id
      friends {
        user {
          id
          name
          profilePictureUrl
          hideProfilePicture
        }
        status
      }
    }
  }
`;

interface QuerySuccessResponse {
  users: UserDatum[];
  me: {
    id: User['id'];
    friends: FriendDatum[];
  };
}

interface QueryVariables {
  id: string | null;
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}

export const useUserSearch = (id: string | null, searchQuery: string, pageNumber: number, nPerPage: number) =>
 useQuery<QuerySuccessResponse, QueryVariables>(SEARCH_USERS, {
    variables: { id, searchQuery, pageNumber, nPerPage },
  });
