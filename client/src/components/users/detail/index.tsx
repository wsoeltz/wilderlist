import React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {
  ContentBody,
  ContentContainer,
  ContentHeader,
} from '../../../styling/Grid';
import BackButton from '../../sharedComponents/BackButton';
import ListUsers from '../list';
import UserProfile from './UserProfile';

const UserProfilePage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const history = useHistory();
  const { id }: any = useParams();

  const profileId = id === userId ? userId : id;

  if (profileId === 'search') {
    return <ListUsers />;
  } else if (userId) {
    return (
      <>
        <ContentContainer>
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
        </ContentContainer>
      </>
    );
  } else {
    return null;
  }

};

export default UserProfilePage;
