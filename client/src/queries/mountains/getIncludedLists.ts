import { gql, useQuery } from '@apollo/client';
import { Mountain, PeakList } from '../../types/graphQLTypes';

const GET_MOUNTAINS_INCLUDE_LISTS = gql`
  query getMountainsIncludedLists($id: ID!) {
    mountain(id: $id) {
      id
      lists {
        id
        name
        numUsers
        mountains {
          id
          elevation
        }
        parent {
          id
          mountains {
            id
            elevation
          }
        }
      }
    }
  }
`;

export interface MountainDatum {
  id: Mountain['id'];
  elevation: Mountain['elevation'];
}

interface QuerySuccessResponse {
  mountain: {
    id: Mountain['name'];
    lists: Array<{
      id: PeakList['id'];
      name: PeakList['name'];
      numUsers: PeakList['numUsers'];
      mountains: MountainDatum[];
      parent: {
        id: PeakList['id'];
        mountains: MountainDatum[];
      }
    }>;
  };
}

interface QueryVariables {
  id: string;
}

export const useGetIncludedListsForMountain = (id: string) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_MOUNTAINS_INCLUDE_LISTS, {
    variables: { id },
  });
