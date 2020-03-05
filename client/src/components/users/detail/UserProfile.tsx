import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import { History } from 'history';
import React, {useContext} from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { comparePeakListIsolatedLink, comparePeakListLink } from '../../../routing/Utils';
import { PlaceholderText } from '../../../styling/styleUtils';
import { FriendStatus, User } from '../../../types/graphQLTypes';
import { mobileSize } from '../../../Utils';
import { AppContext, IAppContext } from '../../App';
import { ViewMode } from '../../peakLists/list';
import ListPeakLists, { CardPeakListDatum } from '../../peakLists/list/ListPeakLists';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Header from './Header';

const ListContainer = styled.div`
  margin-top: 3rem;
`;

const GET_USER = gql`
  query getUser($userId: ID!, $profileId: ID!) {
    user(id: $profileId) {
      id
      name
      email
      redditId
      profilePictureUrl
      hideEmail
      hideProfilePicture
      peakLists {
        id
        name
        shortName
        type
        parent {
          id
        }
        numMountains
        numCompletedAscents(userId: $profileId)
        latestAscent(userId: $profileId)
        isActive(userId: $profileId)
      }
    }
    me: user(id: $userId) {
      id
      friends {
        user {
          id
        }
        status
      }
    }
  }
`;

export interface UserDatum {
  id: User['name'];
  name: User['name'];
  email: User['email'];
  redditId: User['redditId'];
  hideEmail: User['hideEmail'];
  hideProfilePicture: User['hideProfilePicture'];
  profilePictureUrl: User['profilePictureUrl'];
  peakLists: CardPeakListDatum[];
}

interface QuerySuccessResponse {
  user: UserDatum;
  me: {
    friends: Array<{
      user: {
        id: User['id'];
      }
      status: FriendStatus;
    }>,
  };
}

interface QueryVariables {
  userId: string;
  profileId: string;
}

interface Props {
  userId: string;
  id: string;
  history: History;
  setActionDisabled?: (peakListId: string) => boolean;
}

const UserProfile = (props: Props) => {
  const { id, history, userId, setActionDisabled } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_USER, {
    variables: { profileId: id, userId },
  });
  const renderProp = ({windowWidth}: IAppContext) => {
    if (loading === true) {
      return <LoadingSpinner />;
    } else if (error !== undefined) {
      console.error(error);
      return (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else if (data !== undefined) {
      const {user, me} = data;
      if (!me || !user) {
        return (
          <PlaceholderText>
            {getFluentString('global-error-retrieving-data')}
          </PlaceholderText>
        );
      } else {
        const { peakLists } = user;
        const userListData = peakLists.map(peak => peak.id);
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

        const compareAscents = user.id === userId ? null : (peakListId: string) => {
          const url = windowWidth >= mobileSize
            ? comparePeakListLink(user.id, peakListId)
            : comparePeakListIsolatedLink(user.id, peakListId);
          history.push(url);
        };

        const noResultsText = getFluentString('user-profile-no-lists', {
          'user-name': user.name,
        });

        return (
          <>
            <Helmet>
              <title>{getFluentString('meta-data-detail-default-title', {
                title: `${user.name}`,
              })}</title>
            </Helmet>
            <Header
              user={user}
              currentUserId={userId}
              friendStatus={friendStatus}
            />
            <ListContainer>
              <ListPeakLists
                viewMode={ViewMode.Card}
                peakListData={peakLists}
                userListData={userListData}
                listAction={compareAscents}
                actionText={getFluentString('user-profile-compare-ascents')}
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
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    }
  };
  return (
    <AppContext.Consumer
      children={renderProp}
    />
  );
};

export default UserProfile;
