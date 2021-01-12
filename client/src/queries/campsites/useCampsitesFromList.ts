import { gql, useQuery } from '@apollo/client';
import {
  Campsite,
  State,
  User,
} from '../../types/graphQLTypes';

const GET_CAMPSITE_FROM_LIST = gql`
  query getCampsitesIn($ids: [ID]) {
    campsites: campsitesIn(ids: $ids) {
      id
      name
      location
      type
      state {
        id
        name
        abbreviation
      }
    }
  }
`;

interface QuerySuccessResponse {
  campsites: Array<{
    id: Campsite['id'];
    name: Campsite['name'];
    location: Campsite['location'];
    type: Campsite['type'];
    state: {
      id: State['id'];
      name: State['name'];
      abbreviation: State['abbreviation'];
    };
    author: null | { id: User['id'] };
    status: Campsite['status'];
  }>;
}

interface QueryVariables {
  ids: string[];
}

export const useCampsitesFromList = (ids: string[]) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_CAMPSITE_FROM_LIST, {
    variables: { ids },
  });
