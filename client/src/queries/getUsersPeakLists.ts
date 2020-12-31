import { gql, useQuery } from '@apollo/client';
import {
  PeakList,
  User,
} from '../types/graphQLTypes';

export interface CardPeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  numMountains: PeakList['numMountains'];
  numCompletedAscents: PeakList['numCompletedAscents'];
  latestAscent: PeakList['latestAscent'];
  isActive: PeakList['isActive'];
  parent: null | {id: PeakList['id']};
  stateOrRegionString: PeakList['stateOrRegionString'];
}

export const GET_USERS_PEAK_LISTS = gql`
  query GetUsersPeakLists($userId: ID) {
    user(id: $userId) {
      id
      peakLists {
        id
        name
        shortName
        type
        parent {
          id
        }
        numMountains
        stateOrRegionString
        numCompletedAscents(userId: $userId)
        latestAscent(userId: $userId)
        isActive(userId: $userId)
      }
    }
  }
`;

interface Variables {
  userId: string | null;
}

interface PeakListsSuccessResponse {
  user: {
    id: User['id'];
    peakLists: CardPeakListDatum[];
  };
}

export const refetchUsersLists = (variables: Variables) => ({query: GET_USERS_PEAK_LISTS, variables});

export const useUsersPeakLists = (variables: Variables) => useQuery<PeakListsSuccessResponse, Variables>(
  GET_USERS_PEAK_LISTS, {variables},
);
