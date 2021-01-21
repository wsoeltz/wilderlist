import { gql, useQuery } from '@apollo/client';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
  Campsite,
  CompletedCampsite,
  CompletedMountain,
  CompletedTrail,
  Mountain,
  Trail,
  User,
} from '../../types/graphQLTypes';

const GET_PROGRESS = gql`
  query getUsersProgress($userId: ID) {
    progress: user(id: $userId) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
      trails {
        trail {
          id
        }
        dates
      }
      campsites {
        campsite {
          id
        }
        dates
      }
    }
  }
`;

interface SuccessResponse {
  progress: null | {
    id: User['name'];
    mountains: null | Array<{
      mountain: null | {
        id: Mountain['id'];
      }
      dates: CompletedMountain['dates'],
    }>;
    trails: null | Array<{
      trail: null | {
        id: Trail['id'];
      }
      dates: CompletedTrail['dates'],
    }>;
    campsites: null | Array<{
      campsite: null | {
        id: Campsite['id'];
      }
      dates: CompletedCampsite['dates'],
    }>;
  };
}

interface Variables {
  userId: string | null;
}

export const refetchUsersProgress = (variables: Variables) => ({query: GET_PROGRESS, variables});

const useUsersProgress = () => {
  const user = useCurrentUser();
  const response = useQuery<SuccessResponse, Variables>(GET_PROGRESS, {
    variables: {
      userId: user && user._id ? user._id : null,
    },
  });
  return response;
};

export default useUsersProgress;
