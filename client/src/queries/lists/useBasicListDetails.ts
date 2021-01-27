import { gql, useQuery } from '@apollo/client';
import {
  PeakList,
  User,
} from '../../types/graphQLTypes';

const GET_BASIC_LIST_DETAILS = gql`
  query GetBasicListDetails($id: ID!, $userId: ID) {
    peakList(id: $id) {
      id
      name
      shortName
      type
      stateOrRegionString
      numMountains
      numTrails
      numCampsites
      numCompletedAscents(userId: $userId)
      latestAscent(userId: $userId, raw: true)
      isActive(userId: $userId)
      parent {
        id
        type
      }
      children {
        id
        type
      }
      siblings {
        id
        type
      }
      author {
        id
      }
    }
  }
`;

interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  stateOrRegionString: PeakList['stateOrRegionString'];
  numMountains: PeakList['numMountains'];
  numTrails: PeakList['numTrails'];
  numCampsites: PeakList['numCampsites'];
  numCompletedAscents: PeakList['numCompletedAscents'];
  isActive: PeakList['isActive'];
  latestAscent: PeakList['latestAscent'];
  parent: null | {id: PeakList['id'], type: PeakList['type']};
  children: null | Array<{id: PeakList['id'], type: PeakList['type']}>;
  siblings: null | Array<{id: PeakList['id'], type: PeakList['type']}>;
  author: null | { id: User['id'] };
}

interface SuccessResponse {
  peakList: PeakListDatum;
}

interface Variables {
  id: string;
  userId: string | null;
}

export const useBasicListDetails = (id: string, userId: string | null) => useQuery<SuccessResponse, Variables>(
  GET_BASIC_LIST_DETAILS, {variables: { id, userId }},
);
