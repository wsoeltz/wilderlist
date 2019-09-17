import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { friendsWithUserProfileLink, searchListDetailLink } from '../../routing/Utils';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
  SearchContainer,
} from '../../styling/Grid';
import { ButtonPrimaryLink, PlaceholderText } from '../../styling/styleUtils';
import { FriendStatus, PeakList, User } from '../../types/graphQLTypes';
import GhostPeakListCard from '../peakLists/list/GhostPeakListCard';
import ListPeakLists, { PeakListDatum } from '../peakLists/list/ListPeakLists';
import StandardSearch from '../sharedComponents/StandardSearch';
import GhostUserCard from '../users/list/GhostUserCard';
import ListUsers, { UserDatum } from '../users/list/ListUsers';

const PlaceholderButton = styled(ButtonPrimaryLink)`
  font-style: normal;
`;

const GET_USERS_PEAK_LISTS = gql`
  query SearchPeakLists($userId: ID!) {
    user(id: $userId) {
      id
      peakLists {
        id
        name
        shortName
        type
        mountains {
          id
          state {
            id
            name
            regions {
              id
              name
              states {
                id
              }
            }
          }
        }
        parent {
          id
          mountains {
            id
            state {
              id
              name
              regions {
                id
                name
                states {
                  id
                }
              }
            }
          }
        }
      }
      mountains {
        mountain {
          id
        }
        dates
      }
      friends {
        user {
          id
          name
          profilePictureUrl
          peakLists {
            id
            shortName
            type
            mountains {
              id
            }
            parent {
              id
              mountains {
                id
              }
            }
          }
          mountains {
            mountain {
              id
              name
            }
            dates
          }
        }
        status
      }
    }
  }
`;

interface SuccessResponse {
  user: {
    id: User['id'];
    peakLists: PeakListDatum[];
    mountains: User['mountains'];
    friends: Array<{
      user: UserDatum
      status: FriendStatus;
    }>;
  };
}

interface Variables {
  userId: string;
}

export const ADD_PEAK_LIST_TO_USER = gql`
  mutation addPeakListToUser($userId: ID!, $peakListId: ID!) {
    addPeakListToUser(userId: $userId, peakListId: $peakListId) {
      id
      peakLists {
        id
      }
    }
  }
`;

export interface AddRemovePeakListSuccessResponse {
  id: User['id'];
  peakLists: {
    id: PeakList['id'];
  };
}

export interface AddRemovePeakListVariables {
  userId: string;
  peakListId: string;
}

interface Props extends RouteComponentProps {
  userId: string;
}

const Dashboard = (props: Props) => {
  const { userId, history } = props;

  const searchPeakLists = (value: string) => {
    const url = searchListDetailLink('search') + '?query=' + value + '&page=' + 1;
    history.push(url);
  };
  const searchFriends = (value: string) => {
    const url = friendsWithUserProfileLink('search') + '?query=' + value + '&page=' + 1;
    history.push(url);
  };

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_USERS_PEAK_LISTS, {
    variables: { userId },
  });

  let peakListsList: React.ReactElement<any> | null;
  let friendsList: React.ReactElement<any> | null;
  if (loading === true) {
    const loadingListCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 5; i++) {
      loadingListCards.push(<GhostPeakListCard key={i} />);
    }
    peakListsList = <>{loadingListCards}</>;

    const loadingUserCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 15; i++) {
      loadingUserCards.push(<GhostUserCard key={i} />);
    }
    friendsList = <>{loadingUserCards}</>;
  } else if (error !== undefined) {
    console.error(error);
    peakListsList = (<p>There was an error</p>);
    friendsList = (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { user } = data;
    const { peakLists, friends, mountains } = user;
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
          peakListData={peakLists}
          userListData={usersLists}
          listAction={null}
          actionText={''}
          completedAscents={completedAscents}
          profileView={true}
          noResultsText={''}
          showTrophies={true}
        />
      );
    }
    if (friends.length === 0) {
      friendsList = (
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
      friendsList = (
        <ListUsers
          userData={friendsAsUsersArray}
          showCurrentUser={false}
          currentUserId={userId}
          friendsList={friends}
          noResultsText={''}
          openInSidebar={false}
          sortByStatus={true}
        />
      );
    }
  } else {
    peakListsList = null;
    friendsList = null;
  }

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
        <SearchContainer>
          <StandardSearch
            placeholder='Search users'
            setSearchQuery={searchFriends}
            focusOnMount={false}
            initialQuery={''}
          />
        </SearchContainer>
        <ContentBody>
          {friendsList}
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(Dashboard);