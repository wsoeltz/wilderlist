import { ApolloError, useMutation } from '@apollo/client';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import { LinkButton } from '../../../styling/styleUtils';
import { PermissionTypes } from '../../../types/graphQLTypes';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { SuccessResponse, UserDatum } from '../AdminUsers';
import {
  PermissionsSuccessResponse as MountainPermissionsSuccessResponse,
  PermissionsVariables as MountainPermissionsVariables,
  UPDATE_MOUNTAIN_PERMISSIONS,
} from '../mountains/ListMountains';
import {
  PermissionsSuccessResponse as PeakListPermissionsSuccessResponse,
  PermissionsVariables as PeakListPermissionsVariables,
  UPDATE_PEAK_LIST_PERMISSIONS,
} from '../peakLists/ListPeakLists';
import { ListItem } from '../sharedStyles';

const UserContent = styled.div`
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
  deleteUser: (user: UserDatum) => void;
}

const ListUsers = (props: Props) => {
  const {loading, error, data, deleteUser } = props;

  const [userToDelete, setUserToDelete] = useState<UserDatum | null>(null);

  const closeAreYouSureModal = () => {
    setUserToDelete(null);
  };
  const confirmRemove = () => {
    if (userToDelete !== null) {
      deleteUser(userToDelete);
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = userToDelete === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete user ' + userToDelete.name + '? This cannot be undone.'}
      confirmText={'Confirm'}
      cancelText={'Cancel'}
    />
  );

  const [updateMountainPermissions] =
    useMutation<MountainPermissionsSuccessResponse, MountainPermissionsVariables>(
      UPDATE_MOUNTAIN_PERMISSIONS);
  const [updatePeakListPermissions] =
    useMutation<PeakListPermissionsSuccessResponse, PeakListPermissionsVariables>(
      UPDATE_PEAK_LIST_PERMISSIONS);

  const grantMountainPermission = (id: string) => {
    updateMountainPermissions({variables: {id, mountainPermissions: 10}});
  };

  const revokeMountainPermission = (id: string) => {
    updateMountainPermissions({variables: {id, mountainPermissions: -1}});
  };

  const resetMountainPermission = (id: string) => {
    updateMountainPermissions({variables: {id, mountainPermissions: 0}});
  };

  const grantPeakListPermission = (id: string) => {
    updatePeakListPermissions({variables: {id, peakListPermissions: 10}});
  };

  const revokePeakListPermission = (id: string) => {
    updatePeakListPermissions({variables: {id, peakListPermissions: -1}});
  };

  const resetPeakListPermission = (id: string) => {
    updatePeakListPermissions({variables: {id, peakListPermissions: 0}});
  };

  if (loading === true) {
    return (<p>Loading</p>);
  } else if (error !== undefined) {
    console.error(error);
    return (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { users } = data;
    const usersElms = users.map(user => {
      const mountainPermissions = user.mountainPermissions === null
                                  ? 0 : user.mountainPermissions;
      const peakListPermissions = user.peakListPermissions === null
                                  ? 0 : user.peakListPermissions;
      const permissions = user.permissions === PermissionTypes.admin
        ? <div><small>{user.permissions}</small></div> : null;
      const content = (
        <UserContent>
          <UserInfo>
            {permissions}
            <div><small>{user.email}</small></div>
            <div><small>Mountain Permissions: {mountainPermissions}</small></div>
            <div><small>
              <LinkButton
                onClick={() => grantMountainPermission(user.id)}
              >{'Grant Mountain Privileges'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => resetMountainPermission(user.id)}
              >{'Reset Mountain Privileges'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => revokeMountainPermission(user.id)}
              >{'Revoke Mountain Privileges'}</LinkButton>
            </small></div>
            <div><small>PeakList Permissions: {peakListPermissions}</small></div>
            <div><small>
              <LinkButton
                onClick={() => grantPeakListPermission(user.id)}
              >{'Grant PeakList Privileges'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => resetPeakListPermission(user.id)}
              >{'Reset PeakList Privileges'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => revokePeakListPermission(user.id)}
              >{'Revoke PeakList Privileges'}</LinkButton>
            </small></div>
          </UserInfo>
          <UserImage src={user.profilePictureUrl} />
        </UserContent>
      );
      return (
        <ListItem
          key={user.id}
          title={user.name}
          content={content}
          onEdit={null}
          onDelete={() => setUserToDelete(user)}
        />
      );
    });
    return(
      <>
        {usersElms}
        {areYouSureModal}
      </>
    );
  } else {
    return null;
  }
};

export default ListUsers;
