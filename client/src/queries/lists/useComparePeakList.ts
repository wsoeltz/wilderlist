import { gql, useQuery } from '@apollo/client';
import { Mountain, PeakList, User } from '../../types/graphQLTypes';
import {
  PeakListDatum,
} from './usePeakListDetail';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!, $userId: ID!, $friendId: ID!) {
    peakList(id: $id) {
      id
      name
      shortName
      type
      parent {
        id
        name
        type
      }
      children {
        id
        name
        type
      }
      siblings {
        id
        name
        type
      }
      stateOrRegionString
      mountains {
        id
        name
        latitude
        longitude
        elevation
      }
    }
    user(id: $friendId) {
      id
      name
      permissions
      peakLists {
        id
        type
        mountains {
          id
        }
      }
      mountains {
        mountain {
          id
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
        }
      }
      mountains {
        mountain {
          id
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
    }>;
  }>;
  mountains: User['mountains'];
}

interface SuccessResponse {
  peakList: PeakListDatum;
  user: UserDatum;
  me: UserDatum;
}

interface Variables {
  id: string;
  userId: string;
  friendId: string;
}

export const useComparePeakList = (peakListId: string, userId: string, friendId: string) =>
  useQuery<SuccessResponse, Variables>(
  GET_PEAK_LIST, {
    variables: { id: peakListId, userId, friendId },
  });
