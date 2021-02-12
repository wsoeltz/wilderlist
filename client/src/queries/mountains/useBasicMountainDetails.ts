import { gql, useQuery } from '@apollo/client';
import {
  Mountain,
  User,
} from '../../types/graphQLTypes';

const GET_MOUNTAIN_DETAIL = gql`
  query getMountain($id: ID) {
    mountain(id: $id) {
      id
      name
      elevation
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
  mountain: null | {
    id: Mountain['name'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    location: Mountain['location'];
    locationText: Mountain['locationText'];
    locationTextShort: Mountain['locationTextShort'];
    author: null | { id: User['id'] };
    status: Mountain['status'];
  };
}

interface QueryVariables {
  id: string | null;
}

export const useBasicMountainDetails = (id: string | null) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_MOUNTAIN_DETAIL, {
    variables: { id },
  });
