import { gql, useQuery } from '@apollo/client';
import {
  Campsite,
  Mountain,
  Trail,
} from '../../types/graphQLTypes';

const GET_ITEMS_FROM_ID_LISTS = gql`
  query getItemsFromIdLists($mountainIds: [ID], $campsiteIds: [ID], $trailIds: [ID]) {
    mountains: mountainsIn(ids: $mountainIds) {
      id
      name
      locationTextShort
      elevation
      location
    }

    campsites: campsitesIn(ids: $campsiteIds) {
      id
      name
      type
      locationTextShort
      location
    }

    trails: trailsIn(ids: $trailIds) {
      id
      name
      type
      center
      line
      trailLength
      locationTextShort
    }
  }

`;

interface QuerySuccessResponse {
  mountains: Array<{
    id: Mountain['id'];
    name: Mountain['name'];
    locationTextShort: Mountain['name'];
    elevation: Mountain['elevation'];
    location: Mountain['location'];
  }>;
  campsites: Array<{
    id: Campsite['id'];
    name: Campsite['name'];
    type: Campsite['type'];
    locationTextShort: Mountain['name'];
    location: Campsite['location'];
  }>;
  trails: Array<{
    id: Trail['id'];
    name: Trail['name'];
    type: Trail['type'];
    center: Trail['center'];
    line: Trail['line'];
    trailLength: Trail['trailLength'];
    locationTextShort: Mountain['name'];
  }>;
}

interface QueryVariables {
  mountainIds: string[];
  campsiteIds: string[];
  trailIds: string[];
}

export const useItemsFromIdLists = (variables: QueryVariables) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_ITEMS_FROM_ID_LISTS, {
    variables,
  });
