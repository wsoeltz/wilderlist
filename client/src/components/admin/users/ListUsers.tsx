import { ApolloError, useMutation } from '@apollo/client';
import {Types} from 'mongoose';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {userProfileLink} from '../../../routing/Utils';
import { LinkButton } from '../../../styling/styleUtils';
import { PermissionTypes } from '../../../types/graphQLTypes';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import {
  PermissionsSuccessResponse as CampsitePermissionsSuccessResponse,
  PermissionsVariables as CampsitePermissionsVariables,
  UPDATE_CAMPSITE_PERMISSIONS,
} from '../campsites/ListCampsites';
import {
  PermissionsSuccessResponse as PeakListPermissionsSuccessResponse,
  PermissionsVariables as PeakListPermissionsVariables,
  UPDATE_PEAK_LIST_PERMISSIONS,
} from '../lists/ListPeakLists';
import {
  PermissionsSuccessResponse as MountainPermissionsSuccessResponse,
  PermissionsVariables as MountainPermissionsVariables,
  UPDATE_MOUNTAIN_PERMISSIONS,
} from '../mountains/ListMountains';
import { ListItem } from '../sharedStyles';
import { SuccessResponse, UserDatum } from './';

const UserContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 50px;
  grid-column-gap: 8px;
  align-items: center;
`;

const UserImage = styled.img`
  grid-column: 2;
  grid-row: 1;
  max-width: 100%;
  border-radius: 10000px;
  margin: auto;
`;

const UserInfo = styled.div`
  grid-row: 1;
  grid-column: 1;
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
  const [updateCampsitePermissions] =
    useMutation<CampsitePermissionsSuccessResponse, CampsitePermissionsVariables>(
      UPDATE_CAMPSITE_PERMISSIONS);
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

  const grantCampsitePermission = (id: string) => {
    updateCampsitePermissions({variables: {id, campsitePermissions: 10}});
  };

  const revokeCampsitePermission = (id: string) => {
    updateCampsitePermissions({variables: {id, campsitePermissions: -1}});
  };

  const resetCampsitePermission = (id: string) => {
    updateCampsitePermissions({variables: {id, campsitePermissions: 0}});
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
      const campsitePermissions = user.campsitePermissions === null
                                  ? 0 : user.campsitePermissions;
      const peakListPermissions = user.peakListPermissions === null
                                  ? 0 : user.peakListPermissions;
      const permissions = user.permissions === PermissionTypes.admin
        ? <div><small>{user.permissions}</small></div> : null;
      const hideEmail = user.hideEmail
        ? <div><small><strong>Hidden Email </strong></small></div>
        : null;
      const hideProfilePicture = user.hideProfilePicture
        ? <div><small><strong>Hidden Profile Picture</strong></small></div>
        : null;
      const hideProfileInSearch = user.hideProfileInSearch
        ? <div><small><strong>Hidden Profile In Search</strong></small></div>
        : null;
      const disableEmailNotifications = user.disableEmailNotifications
        ? <div><small><strong>Disabled Email Notifications</strong></small></div>
        : null;
      const joinedDate = new Types.ObjectId(user.id).getTimestamp();

      const content = (
        <UserContent>
          <UserInfo>
            {permissions}
            <div>{user.email}</div>
            <div>Joined: {joinedDate.toDateString()}</div>
            <br />
            {hideEmail}
            {hideProfilePicture}
            {hideProfileInSearch}
            {disableEmailNotifications}
            <div><small>Mountain Permissions: {mountainPermissions}</small></div>
            <div><small>
              <LinkButton
                onClick={() => grantMountainPermission(user.id)}
              >{'Grant'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => resetMountainPermission(user.id)}
              >{'Reset'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => revokeMountainPermission(user.id)}
              >{'Revoke'}</LinkButton>
            </small></div>
            <br />
            <div><small>Campsite Permissions: {campsitePermissions}</small></div>
            <div><small>
              <LinkButton
                onClick={() => grantCampsitePermission(user.id)}
              >{'Grant'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => resetCampsitePermission(user.id)}
              >{'Reset'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => revokeCampsitePermission(user.id)}
              >{'Revoke'}</LinkButton>
            </small></div>
            <br />
            <div><small>PeakList Permissions: {peakListPermissions}</small></div>
            <div><small>
              <LinkButton
                onClick={() => grantPeakListPermission(user.id)}
              >{'Grant'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => resetPeakListPermission(user.id)}
              >{'Reset'}</LinkButton>
              {' | '}
              <LinkButton
                onClick={() => revokePeakListPermission(user.id)}
              >{'Revoke'}</LinkButton>
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
          onDelete={() => setUserToDelete(user)}
          url={userProfileLink(user.id)}
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
