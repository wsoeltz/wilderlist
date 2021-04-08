import { gql, useQuery } from '@apollo/client';
import { Campsite, Mountain, Trail, User } from '../../types/graphQLTypes';

const GET_ALL_USERS_ITEMS = gql`
  query GetAllUsersItems($userId: ID!) {
    allItems: user(id: $userId) {
      id
      mountains: allInProgressMountains {
        id
        name
        elevation
        location
      }
      trails: allInProgressTrails {
        id
        name
        type
        line
      }
      camspites: allInProgressCampsites {
        id
        name
        type
        location
      }
    }
  }
`;

interface SuccessResponse {
  allItems: null | {
    id: User['id'];
    mountains: Array<null | {
      id: Mountain['id'];
      name: Mountain['name'];
      elevation: Mountain['elevation'];
      location: Mountain['location'];
    }>
    trails: Array<null | {
      id: Trail['id'];
      name: Trail['name'];
      type: Trail['type'];
      line: Trail['line'];
    }>
    camspites: Array<null | {
      id: Campsite['id'];
      name: Campsite['name'];
      type: Campsite['type'];
      location: Campsite['location'];
    }>
  };
}

interface Variables {
  userId: string;
}

export const refetchAllInProgressItems = (userId: string) => ({query: GET_ALL_USERS_ITEMS, variables: {userId}});

export const useAllInProgressItems = (userId: string) => useQuery<SuccessResponse, Variables>(
  GET_ALL_USERS_ITEMS, {variables: {userId}},
);
