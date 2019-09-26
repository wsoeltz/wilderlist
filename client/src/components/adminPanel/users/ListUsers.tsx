import { ApolloError } from 'apollo-boost';
import React from 'react';
import styled from 'styled-components';
import { LinkButton } from '../../../styling/styleUtils';
import { SuccessResponse } from '../AdminUsers';

const UserListItem = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-column-gap: 8px;
`;

const UserImage = styled.img`
  grid-column: 1;
  grid-row: 1;
  max-width: 100%;
  border-radius: 10000px;
`;

const UserInfo = styled.div`
  grid-row: 1;
  grid-column: 2;
`;

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteUser: (id: string) => void;
}

const ListUsers = (props: Props) => {
  const {loading, error, data, deleteUser } = props;

  if (loading === true) {
    return (<p>Loading</p>);
  } else if (error !== undefined) {
    console.error(error);
    return (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { users } = data;
    const usersElms = users.map(user => {
      return (
        <UserListItem key={user.id}>
          <UserInfo>
            <strong><LinkButton>{user.name}</LinkButton></strong>
            <button
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>
            <div><small>{user.email}</small></div>
          </UserInfo>
          <UserImage src={user.profilePictureUrl} />
        </UserListItem>
      );
    });
    return(
      <>
        {usersElms}
      </>
    );
  } else {
    return null;
  }
};

export default ListUsers;
