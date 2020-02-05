import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { friendsWithUserProfileLink, searchListDetailLink } from '../../routing/Utils';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
  ContentRightSmall,
  SearchContainer,
} from '../../styling/Grid';
import { ButtonPrimaryLink, PlaceholderText } from '../../styling/styleUtils';
import { FriendStatus, User } from '../../types/graphQLTypes';
import PeakListDetail from '../peakLists/detail/PeakListDetail';
import { ViewMode } from '../peakLists/list';
import GhostPeakListCard from '../peakLists/list/GhostPeakListCard';
import ListPeakLists, { CardPeakListDatum } from '../peakLists/list/ListPeakLists';
import BackButton from '../sharedComponents/BackButton';
import StandardSearch from '../sharedComponents/StandardSearch';
import GhostUserCard from '../users/list/GhostUserCard';
import ListUsers, { UserDatum } from '../users/list/ListUsers';

const PlaceholderButton = styled(ButtonPrimaryLink)`
  font-style: normal;
`;

export const GET_USERS_PEAK_LISTS = gql`
  query GetUsersFriends($userId: ID!) {
    user(id: $userId) {
      id
      peakLists {
        id
        name
        shortName
        type
        parent {
          id
        }
        numMountains
        numCompletedAscents(userId: $userId)
        latestAscent(userId: $userId)
        isActive(userId: $userId)
      }
    }
  }
`;

const GET_USERS_FRIENDS = gql`
  query GetFriendsForUser($userId: ID!) {
    user(id: $userId) {
      id
      friends {
        user {
          id
          name
          profilePictureUrl
        }
        status
      }
    }
  }
`;

interface PeakListsSuccessResponse {
  user: {
    id: User['id'];
    peakLists: CardPeakListDatum[];
    mountains: User['mountains'];
  };
}

interface FirendsSuccessResponse {
  user: {
    id: User['id'];
    friends: Array<{
      user: UserDatum
      status: FriendStatus;
    }>;
  };
}

interface Variables {
  userId: string;
}

interface Props extends RouteComponentProps {
  userId: string;
}

const Dashboard = (props: Props) => {
  const { userId, history, match } = props;
  const { peakListId }: any = match.params;

  const searchPeakLists = (value: string) => {
    const url = searchListDetailLink('search') + '?query=' + value + '&page=1&origin=dashboard';
    history.push(url);
  };
  const searchFriends = (value: string) => {
    const url = friendsWithUserProfileLink('search') + '?query=' + value + '&page=' + 1;
    history.push(url);
  };

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {
    loading: listLoading,
    error: listsError,
    data: listsData,
  } = useQuery<PeakListsSuccessResponse, Variables>(GET_USERS_PEAK_LISTS, {
    variables: { userId },
  });
  const {
    loading: friendsLoading,
    error: friendsError,
    data: friendsData,
  } = useQuery<FirendsSuccessResponse, Variables>(GET_USERS_FRIENDS, {
    variables: { userId },
  });

  let peakListsList: React.ReactElement<any> | null;
  if (listLoading === true) {
    const loadingListCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingListCards.push(<GhostPeakListCard key={i} />);
    }
    peakListsList = <>{loadingListCards}</>;
  } else if (listsError !== undefined) {
    console.error(listsError);
    peakListsList = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>);
  } else if (listsData !== undefined) {
    const { user } = listsData;
    const { peakLists, mountains } = user;
    if (peakLists.length === 0) {
      peakListsList = (
        <PlaceholderText>
          <div>
            <p>
              {getFluentString('dashboard-empty-state-no-active-lists-text')}
            </p>
            <p>
              <PlaceholderButton
                to={searchListDetailLink('search')}
              >
                {getFluentString('dashboard-empty-state-no-active-lists-button')}
              </PlaceholderButton>
            </p>
          </div>
        </PlaceholderText>
      );
    } else {
      const usersLists = peakLists.map(peakList => peakList.id);
      const completedAscents = mountains !== null ? mountains : [];
      peakListsList = (
        <ListPeakLists
          viewMode={ViewMode.Card}
          peakListData={peakLists}
          userListData={usersLists}
          listAction={null}
          actionText={''}
          completedAscents={completedAscents}
          profileId={undefined}
          noResultsText={''}
          showTrophies={true}
          dashboardView={true}
        />
      );
    }
  } else {
    peakListsList = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }

  let rightSideContent: React.ReactElement<any> | null;
  if (peakListId !== undefined) {
    rightSideContent = (
      <PeakListDetail userId={userId} id={peakListId} mountainId={undefined}/>
    );
  } else if (friendsLoading === true) {
    const loadingUserCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 5; i++) {
      loadingUserCards.push(<GhostUserCard key={i} />);
    }
    rightSideContent = <>{loadingUserCards}</>;
  } else if (friendsError !== undefined) {
    console.error(friendsError);
    rightSideContent = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>);
  } else if (friendsData !== undefined) {
    const { user } = friendsData;
    const { friends } = user;
    if (friends.length === 0) {
      rightSideContent = (
        <PlaceholderText>
          <div>
            <p>
              {getFluentString('dashboard-empty-state-no-friends-text')}
            </p>
            <p>
              <PlaceholderButton
                to={friendsWithUserProfileLink('search')}
              >
                {getFluentString('dashboard-empty-state-no-friends-button')}
              </PlaceholderButton>
            </p>
          </div>
        </PlaceholderText>
      );
    } else {
      const friendsAsUsersArray = friends.map(friend => friend.user);
      rightSideContent = (
        <ListUsers
          userData={friendsAsUsersArray}
          showCurrentUser={false}
          currentUserId={userId}
          friendsList={friends}
          noResultsText={''}
          noFriendsText={''}
          openInSidebar={false}
          sortByStatus={true}
        />
      );
    }
  } else {
    rightSideContent = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }

  const rightSideUtility = peakListId !== undefined ? (
      <ContentHeader>
        <BackButton />
      </ContentHeader>
    ) : (
      <SearchContainer>
        <StandardSearch
          placeholder='Search users'
          setSearchQuery={searchFriends}
          focusOnMount={false}
          initialQuery={''}
        />
      </SearchContainer>
    );

  return (
    <>
      <ContentLeftLarge>
        <SearchContainer>
          <StandardSearch
            placeholder='Search lists'
            setSearchQuery={searchPeakLists}
            focusOnMount={false}
            initialQuery={''}
          />
        </SearchContainer>
        <ContentBody>
          {peakListsList}
        </ContentBody>
      </ContentLeftLarge>
      <ContentRightSmall>
        {rightSideUtility}
        <ContentBody>
          {rightSideContent}
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(Dashboard);
