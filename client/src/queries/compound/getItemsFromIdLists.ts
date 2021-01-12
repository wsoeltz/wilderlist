import { gql, useQuery } from '@apollo/client';
import {
  Campsite,
  Mountain,
  PeakList,
  State,
  Trail,
  User,
} from '../../types/graphQLTypes';

const GET_ITEMS_FROM_ID_LISTS = gql`
  query getItemsFromIdLists($mountainIds: [ID], $campsiteIds: [ID], $trailIds: [ID]) {
    mountains: mountainsIn(ids: $mountainIds) {
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

    campsites: campsitesIn(ids: $campsiteIds) {
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

    trails: trailsIn(ids: $trailIds) {
      id
      name
      center
      line
      type
      states {
        id
        name
        abbreviation
      }
      children {
        id
        name
        center
        type
        line
      }
      parents {
        id
        name
      }
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
  trails: Array<{
    id: Trail['id'];
    name: Trail['name'];
    center: Trail['center'];
    line: Trail['line'];
    type: Trail['type'];
    states: Array<{
      id: State['id'];
      name: State['name'];
      abbreviation: State['abbreviation'];
    }>;
    children: Array<{
      id: Trail['id'];
      name: Trail['name'];
      center: Trail['center'];
      type: Trail['type'];
      line: Trail['line'];
    }>;
    parents: Array<{
      id: Trail['id'];
      name: Trail['name'];
    }>;
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
