import { gql , useQuery} from '@apollo/client';
import {
  User,
} from '../../types/graphQLTypes';

const GET_DATA_FOR_STATS = gql`
  query GetDataForStats($userId: ID!) {
    user(id: $userId) {
      id
      mountains {
        mountain {
          id
          name
          elevation
          state {
            id
            name
            abbreviation
          }
        }
        dates
      }
      authoredMountains {
        id
      }
      authoredPeakLists {
        id
      }
      authoredTripReports {
        id
      }
      peakLists {
        id
        numMountains
        numCompletedAscents(userId: $userId)
        type
      }
    }
  }
`;

interface SuccessResponse {
  user: {
    id: User['id'];
    mountains: User['mountains'];
    authoredMountains: User['authoredMountains'];
    authoredPeakLists: User['authoredPeakLists'];
    authoredTripReports: User['authoredTripReports'];
    peakLists: User['peakLists'];
  };
}

interface Variables {
  userId: string;
}

export const useGetStatsData = (userId: string) => useQuery<SuccessResponse, Variables>(
  GET_DATA_FOR_STATS, {
    variables: { userId },
  });
