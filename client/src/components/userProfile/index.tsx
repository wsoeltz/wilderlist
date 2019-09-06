import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { comparePeakListLink } from '../../routing/Utils';
import {
  ContentBody,
  ContentLeftLarge,
} from '../../styling/Grid';
import { FriendStatus, User } from '../../types/graphQLTypes';
import ListPeakLists, { PeakListDatum } from '../peakLists/ListPeakLists';
import Header from './Header';

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

interface Props extends RouteComponentProps {
  userId: string;
}

const UserProfile = (props: Props) => {
  const { match, history, userId } = props;
  const { id }: any = match.params;

  const isCurrentUser = userId === id;

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_USER, {
    variables: { profileId: id, userId },
  });

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
      history.push(comparePeakListLink(user.id, peakListId));
    };

    return (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <Header
              user={user}
              currentUserId={userId}
              friendStatus={friendStatus}
            />
            <ListPeakLists
              peakListData={peakLists}
              userListData={userListData}
              listAction={compareAscents}
              actionText={'Compare Ascents'}
              completedAscents={completedAscents}
              isCurrentUser={isCurrentUser}
            />
          </ContentBody>
        </ContentLeftLarge>
      </>
    );
  } else {
    return null;
  }
};

export default withRouter(UserProfile);
