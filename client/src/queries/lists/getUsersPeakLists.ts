import { gql, useQuery } from '@apollo/client';
import {
  PeakList,
  User,
} from '../../types/graphQLTypes';

export interface CardPeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  locationText: PeakList['locationText'];
  numMountains: PeakList['numMountains'];
  numTrails: PeakList['numTrails'];
  numCampsites: PeakList['numCampsites'];
  numCompletedTrips: PeakList['numCompletedTrips'];
  numCompletedAscents: PeakList['numCompletedAscents'];
  numCompletedTrails: PeakList['numCompletedTrails'];
  numCompletedCampsites: PeakList['numCompletedCampsites'];
  privacy: PeakList['privacy'];
  latestTrip: PeakList['latestTrip'];
  bbox: PeakList['bbox'];
  isActive: PeakList['isActive'];
  parent: null | {id: PeakList['id']};
}

const GET_USERS_PEAK_LISTS = gql`
  query GetUsersPeakLists($userId: ID) {
    user(id: $userId) {
      id
      peakLists {
        id
        name
        shortName
        type
        locationText
        parent {
          id
        }
        bbox
        numMountains
        numTrails
        numCampsites
        privacy
        numCompletedTrips(userId: $userId)
        numCompletedAscents(userId: $userId)
        numCompletedTrails(userId: $userId)
        numCompletedCampsites(userId: $userId)
        latestTrip(userId: $userId)
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

export const refetchUsersPeakLists = (variables: Variables) => ({query: GET_USERS_PEAK_LISTS, variables});

export const useUsersPeakLists = (variables: Variables) => useQuery<PeakListsSuccessResponse, Variables>(
  GET_USERS_PEAK_LISTS, {variables},
);
