import { useQuery, useMutation } from '@apollo/react-hooks';
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

const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
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

  const [deleteUserMutation] = useMutation(DELETE_USER, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_USERS });
      if (response !== null && response.users !== null) {
        cache.writeQuery({
          query: GET_USERS,
          data: { users: response.users.filter(({id}) => id !== successData.deleteUser.id) },
        });
      }
    },
  });

  const deleteUser = async (id: string) => {
    deleteUserMutation({variables: {id}});
  }
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
            deleteUser={deleteUser}
          />
        </ContentBody>
      </UserListColumn>
    </>
  );
};

export default AdminPanel;
