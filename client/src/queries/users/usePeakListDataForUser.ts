import { gql, useQuery } from '@apollo/client';
import {
  User,
} from '../../types/graphQLTypes';
import { CardPeakListDatum } from '../lists/getUsersPeakLists';

const GET_PEAK_LIST_DATA_FOR_USER = gql`
  query getPeakListDataForUser($id: ID!) {
    user(id: $id) {
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
        numCompletedAscents(userId: $id)
        latestAscent(userId: $id)
        isActive(userId: $id)
      }
      latestAscent {
        mountain {
          id
          name
        }
        dates
      }
    }
  }
`;

interface PeakListsForUserVariables {
  id: string;
}

interface PeakListsForUserResponse {
  user: {
    id: User['id'];
    peakLists: CardPeakListDatum[];
    latestAscent: User['latestAscent'];
  };
}

export const usePeakListDataForUser = (id: string) =>
  useQuery<PeakListsForUserResponse, PeakListsForUserVariables>(GET_PEAK_LIST_DATA_FOR_USER, {
    variables: { id },
  });
