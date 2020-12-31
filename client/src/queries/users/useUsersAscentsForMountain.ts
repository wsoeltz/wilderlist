import { gql, useQuery } from '@apollo/client';
import {
  Mountain,
  User,
} from '../../types/graphQLTypes';

const GET_USER_ASCENTS_FOR_MOUNTAIN = gql`
  query getUsersAscentsForMountain($id: ID!) {
    user(id: $id) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

interface Variables {
  id: string;
}

interface SuccessResponse {
  user: {
    id: User['id'];
    mountains: Array<{
      mountain: {id: Mountain['id']} | null;
      dates: string[];
    }>
  };
}

export const useUsersAscentsForMountain = (id: string) =>
  useQuery<SuccessResponse, Variables>(GET_USER_ASCENTS_FOR_MOUNTAIN, {
    variables: { id },
  });
