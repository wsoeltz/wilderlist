import { gql, useMutation, useQuery } from '@apollo/client';
import React, {useState} from 'react';
import { withRouter } from 'react-router';
import {
  useRemovePeakListFromUser,
} from '../../../queries/lists/addRemovePeakListsToUser';
import {
  useRemoveFriendMutation,
} from '../../../queries/users/friendRequestMutations';
import { User } from '../../../types/graphQLTypes';
import { asyncForEach, notEmpty } from '../../../Utils';
import StandardSearch from '../../sharedComponents/StandardSearch';
import ListUsers from './ListUsers';

export const GET_USERS = gql`
  query ListUsers($searchQuery: String!) {
    users: usersSearchByNewest(searchQuery: $searchQuery, nPerPage: 30, pageNumber: 1) {
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
      campsitePermissions
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
  campsitePermissions: User['campsitePermissions'];
  peakListPermissions: User['peakListPermissions'];
  permissions: User['permissions'];
}

export interface SuccessResponse {
  users: UserDatum[];
}

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {loading, error, data} = useQuery<SuccessResponse>(GET_USERS, {variables: {searchQuery}});

  const removePeakListFromUser = useRemovePeakListFromUser();
  const removeFriendMutation = useRemoveFriendMutation();
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

  const filterUsers = (value: string) => {
    setSearchQuery(value);
  };
  return (
    <>
      <div>
        <StandardSearch
          placeholder={'Filter trails'}
          setSearchQuery={filterUsers}
          focusOnMount={false}
          initialQuery={searchQuery}
        />
      </div>
      <div>
        <ListUsers
          loading={loading}
          error={error}
          data={data}
          deleteUser={deleteUser}
        />
      </div>
    </>
  );
};

export default withRouter(AdminUsers);
