import { gql, useQuery } from '@apollo/client';
import { Mountain, PeakList, User } from '../../types/graphQLTypes';

const GET_PEAK_LIST = gql`
  query getUserAndMe($userId: ID!, $friendId: ID!) {
    user(id: $friendId) {
      id
      name
      permissions
      peakLists {
        id
        type
        mountains {
          id
          name
        }
        parent {
          id
          mountains {
            id
            name
          }
        }
      }
      mountains {
        mountain {
          id
          name
        }
        dates
      }
    }
    me: user(id: $userId) {
      id
      name
      permissions
      peakLists {
        id
        type
        mountains {
          id
          name
        }
        parent {
          id
          mountains {
            id
            name
          }
        }
      }
      mountains {
        mountain {
          id
          name
        }
        dates
      }
    }
  }
`;

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  permissions: User['permissions'];
  peakLists: Array<{
    id: PeakList['id'];
    type: PeakList['type'];
    mountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
    }>;
    parent: {
      id: PeakList['id'];
      mountains: Array<{
        id: Mountain['id'];
        name: Mountain['name'];
      }>;
    }
  }>;
  mountains: User['mountains'];
}

interface SuccessResponse {
  user: UserDatum;
  me: UserDatum;
}

interface Variables {
  userId: string;
  friendId: string;
}

export const useCompareAllMountains = (userId: string, friendId: string) => useQuery<SuccessResponse, Variables>(
  GET_PEAK_LIST, {variables: {userId, friendId}},
);
