import { gql, useQuery } from '@apollo/client';
import {
  Mountain,
  PeakList,
  State,
  User,
} from '../../types/graphQLTypes';

const GET_MOUNTAIN_DETAIL = gql`
  query getMountain($id: ID) {
    mountain(id: $id) {
      id
      name
      elevation
      location
      description
      resources {
        title
        url
      }
      state {
        id
        name
        abbreviation
      }
      lists {
        id
      }
      author {
        id
      }
      status
    }
  }
`;

interface QuerySuccessResponse {
  mountain: null | {
    id: Mountain['name'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    location: Mountain['location'];
    description: Mountain['description'];
    resources: Mountain['resources'];
    state: {
      id: State['id'];
      name: State['name'];
    };
    lists: Array<{
      id: PeakList['id'];
    }>;
    author: null | { id: User['id'] };
    status: Mountain['status'];
  };
}

interface QueryVariables {
  id: string | null;
}

export const useMountainDetail = (id: string | null) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_MOUNTAIN_DETAIL, {
    variables: { id },
  });
