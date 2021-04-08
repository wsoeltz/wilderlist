import { gql, useQuery } from '@apollo/client';
import {
  Mountain,
  PeakList,
  State,
  User,
} from '../../types/graphQLTypes';

const GET_MOUNTAINS_FROM_LIST = gql`
  query getMountainsIn($ids: [ID]) {
    mountains: mountainsIn(ids: $ids) {
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
  mountains: Array<{
    id: Mountain['name'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    location: Mountain['location'];
    description: Mountain['description'];
    resources: Mountain['resources'];
    state: {
      id: State['id'];
      name: State['name'];
      abbreviation: State['abbreviation'];
    };
    lists: Array<{
      id: PeakList['id'];
    }>;
    author: null | { id: User['id'] };
    status: Mountain['status'];
  }>;
}

interface QueryVariables {
  ids: string[];
}

export const useMountainsFromList = (ids: string[]) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_MOUNTAINS_FROM_LIST, {
    variables: { ids },
  });
