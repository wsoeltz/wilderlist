import { gql, useQuery } from '@apollo/client';
import {
  Campsite,
  User,
} from '../../types/graphQLTypes';

const GET_BASIC_CAMPSITE_DETAIL = gql`
  query getCampsite($id: ID) {
    campsite(id: $id) {
      id
      name
      type
      ownership
      website
      email
      phone
      location
      locationText
      locationTextShort
      author {
        id
      }
      status
    }
  }
`;

interface QuerySuccessResponse {
  campsite: null | {
    id: Campsite['id'];
    name: Campsite['name'];
    type: Campsite['type'];
    ownership: Campsite['ownership'];
    website: Campsite['website'];
    email: Campsite['email'];
    phone: Campsite['phone'];
    location: Campsite['location'];
    locationText: Campsite['locationText'];
    locationTextShort: Campsite['locationTextShort'];
    author: null | { id: User['id'] };
    status: Campsite['status'];
  };
}

interface QueryVariables {
  id: string | null;
}

export const useBasicCampsiteDetails = (id: string | null) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_BASIC_CAMPSITE_DETAIL, {
    variables: { id },
  });
