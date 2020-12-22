import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { withRouter } from 'react-router';
import { User } from '../../types/graphQLTypes';
import { asyncForEach } from '../../Utils';
import { notEmpty } from '../../Utils';
import { REMOVE_PEAK_LIST_FROM_USER } from '../peakLists/detail/Header';
import {
  AddRemovePeakListSuccessResponse,
  AddRemovePeakListVariables,
} from '../peakLists/list';
import {
  FriendRequestSuccessResponse,
  FriendRequestVariables,
  REMOVE_FRIEND,
} from '../users/list/UserCard';
import ListUsers from './users/ListUsers';

export const GET_USERS = gql`
  query ListUsers {
    users {
      id
      name
      email
      profilePictureUrl
      peakLists {
        id
      }
      friends {
        user {
          id
        }
      }
      mountainPermissions
      peakListPermissions
      permissions
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

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  email: User['email'];
  profilePictureUrl: User['profilePictureUrl'];
  friends: User['friends'];
  peakLists: User['peakLists'];
  mountainPermissions: User['mountainPermissions'];
  peakListPermissions: User['peakListPermissions'];
  permissions: User['permissions'];
}

export interface SuccessResponse {
  users: UserDatum[];
}

const AdminUsers = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_USERS);

  const [removePeakListFromUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(REMOVE_PEAK_LIST_FROM_USER);
  const [removeFriendMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(REMOVE_FRIEND);
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

  const deleteUser = async ({id: userId, friends, peakLists}: UserDatum) => {
    try {
      if (peakLists) {
        await asyncForEach(peakLists, ({id: peakListId}: {id: string}) =>
          removePeakListFromUser({variables: {peakListId, userId}}),
        );
      }
      if (friends) {
        const filteredFriends = friends.filter(notEmpty);
        await asyncForEach(filteredFriends, ({user: {id: friendId}}: {user: {id: string}}) =>
          removeFriendMutation({variables: {friendId, userId}}),
        );
      }
      deleteUserMutation({variables: {id: userId}});
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div>
        <div>
          <h2>Users</h2>
        </div>
        <div>
          <ListUsers
            loading={loading}
            error={error}
            data={data}
            deleteUser={deleteUser}
          />
        </div>
      </div>
    </>
  );
};

export default withRouter(AdminUsers);
