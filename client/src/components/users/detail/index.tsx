import React from 'react';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
} from '../../../styling/Grid';
import BackButton from '../../sharedComponents/BackButton';
import UserProfile from './UserProfile';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {useParams, useHistory} from 'react-router-dom';

const UserProfilePage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const history = useHistory();
  const { id }: any = useParams();

  const profileId = id === userId ? userId : id;

  if (userId) {
    return (
      <>
        <ContentLeftLarge>
          <ContentHeader>
            <BackButton />
          </ContentHeader>
          <ContentBody>
            <UserProfile
              userId={userId}
              id={profileId}
              history={history}
            />
          </ContentBody>
        </ContentLeftLarge>
      </>
    );
  } else {
    return null;
  }

};

export default UserProfilePage;
