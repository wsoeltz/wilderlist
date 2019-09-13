import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import { History } from 'history';
import React, {useContext} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { comparePeakListIsolatedLink, comparePeakListLink } from '../../../routing/Utils';
import { FriendStatus, User } from '../../../types/graphQLTypes';
import { mobileSize } from '../../../Utils';
import { AppContext, IAppContext } from '../../App';
import ListPeakLists, { PeakListDatum } from '../../peakLists/list/ListPeakLists';
import Header from './Header';
import styled from 'styled-components';
import { lightBaseColor } from '../../../styling/styleUtils';

const ListContainer = styled.div`
  margin-top: 3rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  text-transform: uppercase;
  color: ${lightBaseColor};
  margin-bottom: 1.2rem;
`;

const GET_USER = gql`
  query getUser($userId: ID!, $profileId: ID!) {
    user(id: $profileId) {
      id
      name
      email
      profilePictureUrl
      mountains {
        mountain {
          id
        }
        dates
      }

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
  profilePictureUrl: User['profilePictureUrl'];
  mountains: User['mountains'];
  peakLists: PeakListDatum[];
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
}

const UserProfile = (props: Props) => {
  const { id, history, userId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const isCurrentUser = userId === id;

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_USER, {
    variables: { profileId: id, userId },
  });
  const renderProp = ({windowWidth}: IAppContext) => {
    if (loading === true) {
      return null;
    } else if (error !== undefined) {
      console.error(error);
      return null;
    } else if (data !== undefined) {
      const {
        user: { peakLists },
        user,
        me,
      } = data;

      const userListData = peakLists.map(peak => peak.id);
      const completedAscents = user.mountains !== null ? user.mountains : [];
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

      const compareAscents = (peakListId: string) => {
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
          <Header
            user={user}
            currentUserId={userId}
            friendStatus={friendStatus}
          />
          <ListContainer>
            <SectionTitle>
              {getFluentString('user-profile-lists-in-progress')}
            </SectionTitle>
            <ListPeakLists
              peakListData={peakLists}
              userListData={userListData}
              listAction={compareAscents}
              actionText={getFluentString('user-profile-compare-ascents')}
              completedAscents={completedAscents}
              isCurrentUser={isCurrentUser}
              noResultsText={noResultsText}
            />
          </ListContainer>
        </>
      );
    } else {
      return null;
    }
  };
  return (
    <AppContext.Consumer
      children={renderProp}
    />
  );
};

export default UserProfile;
