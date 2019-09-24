import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge as UserListColumn,
} from '../../styling/Grid';
import { User } from '../../types/graphQLTypes';
import ListUsers from './users/ListUsers';

export const GET_USERS = gql`
  query ListUsers {
    users {
      id
      name
      email
      profilePictureUrl
    }
  }
`;

export interface SuccessResponse {
  users: Array<{
    id: User['id'];
    name: User['name'];
    email: User['email'];
    profilePictureUrl: User['profilePictureUrl'];
  }>;
}

const AdminPanel = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_USERS);
  return (
    <>
      <UserListColumn>
        <ContentHeader>
          <h2>Users</h2>
        </ContentHeader>
        <ContentBody>
          <ListUsers
            loading={loading}
            error={error}
            data={data}
          />
        </ContentBody>
      </UserListColumn>
    </>
  );
};

export default AdminPanel;
