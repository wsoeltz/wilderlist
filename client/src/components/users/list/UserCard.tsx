import { gql, useMutation, useQuery } from '@apollo/client';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import BackupImage from '../../../assets/images/default-user-image.jpg';
import useFluent from '../../../hooks/useFluent';
import { comparePeakListLink, preventNavigation } from '../../../routing/Utils';
import {
  ButtonPrimary,
  Card,
  GhostButton,
  lightBaseColor,
} from '../../../styling/styleUtils';
import {
  FriendStatus,
  PeakListVariants,
  User,
} from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import { CardPeakListDatum } from '../../peakLists/list/ListPeakLists';
import {
  formatDate,
  getDates,
  getType,
} from '../../peakLists/Utils';
import { UserDatum } from './ListUsers';

const GET_PEAK_LIST_DATA_FOR_USER = gql`
  query getPeakListDataForUser($id: ID!) {
    user(id: $id) {
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
        numCompletedAscents(userId: $id)
        latestAscent(userId: $id)
        isActive(userId: $id)
      }
      latestAscent {
        mountain {
          id
          name
        }
        dates
      }
    }
  }
`;

interface PeakListsForUserVariables {
  id: string;
}

interface PeakListsForUserResponse {
  user: {
    id: User['id'];
    peakLists: CardPeakListDatum[];
    latestAscent: User['latestAscent'];
  };
}

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($userId: ID!, $friendId: ID!) {
  sendFriendRequest(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation acceptFriendRequest($userId: ID!, $friendId: ID!) {
  acceptFriendRequest(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($userId: ID!, $friendId: ID!) {
  removeFriend(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

export interface FriendRequestVariables {
  userId: string;
  friendId: string;
}

export interface FriendRequestSuccessResponse {
  id: User['id'];
  friends: Array<{
    user: {
      id: User['id'];
      friends: Array<{
        user: {
          id: User['id'];
        }
        status: FriendStatus;
      }>;
    },
    status: FriendStatus;
  }>;
}

const LinkWrapper = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: inherit;
  grid-row: span 3;
  grid-column: span 2;

  &:hover {
    color: inherit;
  }
`;

export const Root = styled(Card)`
  display: grid;
  grid-template-columns: 6rem 1fr;
  grid-template-rows: 1fr auto;
  grid-column-gap: 1.1rem;
`;

export const Title = styled.h1`
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 0.4rem;
`;
export const TextContainer = styled.div`
  grid-row: 1;
  grid-column: 2;
`;

const ProfilePicture = styled.img`
  grid-row: 1 / span 2;
  grid-column: 1;
  max-width: 100%;
  margin-right: 1.5rem;
  border-radius: 4000px;
`;

const Subtitle = styled.p`
  color: ${lightBaseColor};
  margin: 0.4rem 0;
`;

const SubtitleSmall = styled(Subtitle)`
  font-size: 0.9rem;
`;

const TextTitle = styled.strong`
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  grid-column: 2
  grid-row: 2;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const DeclineButton = styled(GhostButton)`
  margin-right: 0.6rem;
`;

const getListsInProgress =
  (peakLists: CardPeakListDatum[]) => {
    const completedLists: string[] = [];
    const listsInProgress: string[] = [];
    peakLists.forEach(({numMountains, numCompletedAscents, type, shortName}) => {
      let totalRequiredAscents: number;
      if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
        totalRequiredAscents = numMountains;
      } else if (type === PeakListVariants.fourSeason) {
        totalRequiredAscents = numMountains * 4;
      } else if (type === PeakListVariants.grid) {
        totalRequiredAscents = numMountains * 12;
      } else {
        totalRequiredAscents = 0;
        failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
      }

      if (totalRequiredAscents > 0 && numCompletedAscents === totalRequiredAscents) {// list complete
        completedLists.push(shortName + getType(type));
      } else { // list is incomplete
        listsInProgress.push(shortName + getType(type));
      }
    });
    return { completedLists, listsInProgress };
};

enum Preposition {
  on = 'on',
  in = 'in',
}

interface Props {
  user: UserDatum;
  friendStatus: FriendStatus | null;
  currentUserId: string;
}

const UserCard = (props: Props) => {
  const { user, friendStatus, currentUserId} = props;

  const getString = useFluent();

  const {loading, error, data} =
    useQuery<PeakListsForUserResponse, PeakListsForUserVariables>(GET_PEAK_LIST_DATA_FOR_USER, {
      variables: { id: user.id },
    });

  const initialProfilePictureUrl = user.hideProfilePicture ? BackupImage : user.profilePictureUrl;
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(initialProfilePictureUrl);

  const [sendFriendRequestMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(SEND_FRIEND_REQUEST);
  const [acceptFriendRequestMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(ACCEPT_FRIEND_REQUEST);
  const [removeFriendMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(REMOVE_FRIEND);

  const sendFriendRequest = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    sendFriendRequestMutation({
      variables: {userId: currentUserId, friendId: user.id}});
  };
  const acceptFriendRequest = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    acceptFriendRequestMutation({variables: {userId: currentUserId, friendId: user.id}});
  };
  const removeFriend = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    removeFriendMutation({variables: {userId: currentUserId, friendId: user.id}});
  };

  const numListsToShow = 3;
  let completedListsElement: React.ReactElement<any> | null;
  let listsInProgressElement: React.ReactElement<any> | null;
  let ascentText: string;
  if (loading === true) {
    completedListsElement = null;
    listsInProgressElement = null;
    ascentText = '';
  } else if (error !== undefined) {
    console.error(error);
    completedListsElement = null;
    listsInProgressElement = null;
    ascentText = '';
  } else if (data !== undefined) {
    const { user: {peakLists, latestAscent}} = data;
    const { completedLists, listsInProgress } = getListsInProgress(peakLists);
    if (completedLists.length === 0) {
      completedListsElement = null;
    } else {
      let listShortNames: string = '';
      for (let i = 0; i < numListsToShow; i++) {
        if (completedLists.length - 1 === i) { // last element in array
          if (listsInProgress.length === numListsToShow) {
            listShortNames = listShortNames + ' & ';
          }
          listShortNames = listShortNames + completedLists[i];
          break;
        } else if (i > 0) { //not last element or first element
          listShortNames = listShortNames + ', ' + completedLists[i];
        } else {
          listShortNames = listShortNames + completedLists[i];
          if (completedLists.length === 2) {
            listShortNames = listShortNames + ' & ';
          }
        }
        if (i === numListsToShow - 1 && completedLists.length > numListsToShow) {
          listShortNames =
            listShortNames + ' & ' +
            (completedLists.length - numListsToShow) + ' ' +
            getString('global-text-value-more');
        }
      }
      completedListsElement = (
        <SubtitleSmall>
          <TextTitle>
            {getString('user-card-completed')}: </TextTitle>
          {listShortNames}
        </SubtitleSmall>
      );
    }
    if (listsInProgress.length === 0) {
      listsInProgressElement = (
        <SubtitleSmall>
          <TextTitle>{getString('user-card-working-on')}: </TextTitle>
          {getString('user-card-not-currently-working-on')}
        </SubtitleSmall>
      );
    } else {
      let listShortNames: string = '';
      for (let i = 0; i < numListsToShow; i++) {
        if (listsInProgress.length - 1 === i) { // last element in array
          if (listsInProgress.length === numListsToShow) {
            listShortNames = listShortNames + ' & ';
          }
          listShortNames = listShortNames + listsInProgress[i];
          break;
        } else if (i > 0) { //not last element or first element
          listShortNames = listShortNames + ', ' + listsInProgress[i];
        } else {
          listShortNames = listShortNames + listsInProgress[i];
          if (listsInProgress.length === 2) {
            listShortNames = listShortNames + ' & ';
          }
        }
        if (i === numListsToShow - 1 && listsInProgress.length > numListsToShow) {
          listShortNames =
            listShortNames + ' & ' +
            (listsInProgress.length - numListsToShow) + ' ' +
            getString('global-text-value-more');
        }
      }
      listsInProgressElement = (
        <SubtitleSmall>
          <TextTitle>{getString('user-card-working-on')}: </TextTitle>
          {listShortNames}
        </SubtitleSmall>
      );
    }

    if (latestAscent !== null && latestAscent.dates.length && latestAscent.mountain && latestAscent.mountain.id) {
      const {mountain} = latestAscent;
      const date = getDates(latestAscent.dates)[0];
      let preposition: Preposition;
      if (isNaN(date.year)) {
        preposition = Preposition.on;
      } else if (isNaN(date.month)) {
        preposition = Preposition.in;
      } else if (isNaN(date.day)) {
        preposition = Preposition.in;
      } else {
        preposition = Preposition.on;
      }

      ascentText = getString('user-profile-latest-ascents', {
        'mountain-name': mountain.name,
        'preposition': preposition,
        'date': formatDate(date),
      });
    } else {
      ascentText = getString('user-profile-no-recent-ascents');
    }

  } else {
    completedListsElement = null;
    listsInProgressElement = null;
    ascentText = '';
  }

  let cardContent: React.ReactElement<any> | null;
  if (friendStatus === null) {
    cardContent = (
      <>
        <TextContainer>
          <Title>
            {user.name}
          </Title>
          {completedListsElement}
          {listsInProgressElement}
        </TextContainer>
        <ButtonContainer>
          <ButtonPrimary onClick={sendFriendRequest}>
            {getString('user-profile-requests-add-friend')}
          </ButtonPrimary>
        </ButtonContainer>
      </>
    );
  } else if (friendStatus === FriendStatus.friends) {
    cardContent = (
      <>
        <TextContainer>
          <Title>
            {user.name}
          </Title>
          <Subtitle>
            {ascentText}
          </Subtitle>
          {completedListsElement}
          {listsInProgressElement}
        </TextContainer>
      </>
    );
  } else if (friendStatus === FriendStatus.sent) {
    cardContent = (
      <>
        <TextContainer>
          <Title>
            {user.name}
          </Title>
          <Subtitle>
            {getString('user-profile-requests-pending-request')}
          </Subtitle>
          {completedListsElement}
          {listsInProgressElement}
        </TextContainer>
        <ButtonContainer>
          <GhostButton onClick={removeFriend}>
            {getString('user-profile-requests-cancel-request')}
          </GhostButton>
        </ButtonContainer>
      </>
    );
  } else if (friendStatus === FriendStatus.recieved) {
    cardContent = (
      <>
        <TextContainer>
          <Title>
            {user.name}
          </Title>
          <Subtitle>
            {getString('user-profile-sent-you-a-friend-request', {
              name: user.name,
            })}
          </Subtitle>
          {completedListsElement}
          {listsInProgressElement}
        </TextContainer>
        <ButtonContainer>
          <DeclineButton onClick={removeFriend}>
            {getString('user-profile-requests-decline-request')}
          </DeclineButton>
          <ButtonPrimary onClick={acceptFriendRequest}>
            {getString('user-profile-requests-accept-request')}
          </ButtonPrimary>
        </ButtonContainer>
      </>
    );
  } else {
    cardContent = null;
    failIfValidOrNonExhaustive(friendStatus, 'Invalid value for friendStatus ' + friendStatus);
  }

  const opacity = friendStatus === FriendStatus.friends ? 1 : 0.2;

  const onImageError = () => {
    if (profilePictureUrl !== BackupImage) {
      setProfilePictureUrl(BackupImage);
    }
  };

  return (
    <LinkWrapper
      to={comparePeakListLink(user.id, 'none')}
    >
      <Root>
        <ProfilePicture
          src={profilePictureUrl}
          style={{opacity}}
          alt={user.name}
          title={user.name}
          onError={onImageError}
        />
        {cardContent}
      </Root>
    </LinkWrapper>
  );
};

export default UserCard;
