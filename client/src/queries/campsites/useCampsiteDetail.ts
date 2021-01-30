import { gql, useQuery } from '@apollo/client';
import {
  Campsite,
  State,
  User,
} from '../../types/graphQLTypes';

const GET_CAMPSITE_DETAIL = gql`
  query getCampsite($id: ID) {
    campsite(id: $id) {
      id
      name
      location
      type
      ownership
      state {
        id
        name
        abbreviation
      }
    }
  }
`;

interface QuerySuccessResponse {
  campsite: null | {
    id: Campsite['id'];
    name: Campsite['name'];
    location: Campsite['location'];
    type: Campsite['type'];
    ownership: Campsite['ownership'];
    state: {
      id: State['id'];
      name: State['name'];
      abbreviation: State['abbreviation'];
    };
    author: null | { id: User['id'] };
    status: Campsite['status'];
  };
}

interface QueryVariables {
  id: string | null;
}

export const useCampsiteDetail = (id: string | null) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_CAMPSITE_DETAIL, {
    variables: { id },
  });
