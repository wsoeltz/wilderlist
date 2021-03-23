import { gql, useQuery } from '@apollo/client';
import { PeakList, User } from '../../types/graphQLTypes';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!, $userId: ID!, $friendId: ID!) {
    peakList(id: $id) {
      id
      name
      type
      bbox
      numMountains
      numTrails
      numCampsites
      privacy
      author {
        id
      }
    }
    user(id: $friendId) {
      id
      name
    }
    me: user(id: $userId) {
      id
      name
    }
  }
`;

export interface UserDatum {
  id: User['id'];
  name: User['name'];
}

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    name: PeakList['name'];
    type: PeakList['type'];
    bbox: PeakList['bbox'];
    numMountains: PeakList['numMountains'];
    numTrails: PeakList['numTrails'];
    numCampsites: PeakList['numCampsites'];
    privacy: PeakList['privacy'];
    author: null | {id: string};
  };
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
