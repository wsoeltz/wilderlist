import React from 'react';
import Helmet from 'react-helmet';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {useUserProfile} from '../../../queries/users/useUserProfile';
import { comparePeakListIsolatedLink } from '../../../routing/Utils';
import { PlaceholderText } from '../../../styling/styleUtils';
import { FriendStatus } from '../../../types/graphQLTypes';
import ListPeakLists from '../../peakLists/list/ListPeakLists';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Header from './Header';

const ListContainer = styled.div`
  margin-top: 3rem;
`;

interface Props {
  userId: string;
  id: string;
  setActionDisabled?: (peakListId: string) => boolean;
}

const UserProfile = (props: Props) => {
  const { id, userId, setActionDisabled } = props;
  const history = useHistory();
  const getString = useFluent();

  const {loading, error, data} = useUserProfile(id, userId);
  if (loading === true) {
    return <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const {user, me} = data;
    if (!me || !user) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const { peakLists } = user;
      const friendsList = me.friends;
      let friendStatus: FriendStatus | null;
      if (friendsList !== null && friendsList.length !== 0) {
        const friendData = friendsList.find(
          (friend) => friend.user.id === user.id);
        if (friendData !== undefined) {
          friendStatus = friendData.status;
        } else {
          friendStatus = null;
        }
      } else {
        friendStatus = null;
      }

      const compareAscents = user.id === userId ? null : (peakListId: string) =>
        history.push(comparePeakListIsolatedLink(user.id, peakListId));

      const noResultsText = getString('user-profile-no-lists', {
        'user-name': user.name,
      });

      return (
        <>
          <Helmet>
            <title>{getString('meta-data-detail-default-title', {
              title: `${user.name}`,
            })}</title>
          </Helmet>
          <Header
            user={user}
            currentUserId={userId}
            friendStatus={friendStatus}
            key={user.id}
          />
          <ListContainer>
            <ListPeakLists
              peakListData={peakLists}
              listAction={compareAscents}
              actionText={getString('user-profile-compare-ascents')}
              profileId={user.id}
              noResultsText={noResultsText}
              showTrophies={true}
              setActionDisabled={setActionDisabled}
            />
          </ListContainer>
        </>
      );
    }
  } else {
    return (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }
};

export default UserProfile;
