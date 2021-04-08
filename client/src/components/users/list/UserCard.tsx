import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import BackupImage from '../../../assets/images/default-user-image.jpg';
import useFluent from '../../../hooks/useFluent';
import { CardPeakListDatum } from '../../../queries/lists/getUsersPeakLists';
import {
  useAcceptFriendRequestMutation,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
} from '../../../queries/users/friendRequestMutations';
import {usePeakListDataForUser} from '../../../queries/users/usePeakListDataForUser';
import { UserDatum } from '../../../queries/users/useUserSearch';
import { preventNavigation, userProfileLink } from '../../../routing/Utils';
import {
  ButtonPrimary,
  GhostButton,
  lightBaseColor,
  lightBorderColor,
  SemiBold,
} from '../../../styling/styleUtils';
import {
  FriendStatus,
  PeakListVariants,
} from '../../../types/graphQLTypes';
import {
  formatDate,
  getDates,
  getType,
} from '../../../utilities/dateUtils';
import { failIfValidOrNonExhaustive } from '../../../Utils';
const InlineCard = styled.div`
  margin: 0 -1rem;
  padding: 1rem;
  border-top: solid 1px ${lightBorderColor};
  display: grid;
  grid-template-columns: 4rem 1fr;
  grid-column-gap: 1rem;

  &:last-of-type {
    border-bottom: solid 1px ${lightBorderColor};
  }
`;
const FlexRow = styled.div`
  display: flex;
  font-size: 0.875rem;
  color: ${lightBaseColor};
`;

const PullRight = styled.div`
  margin-left: auto;
  padding-left: 2rem;
  white-space: nowrap;
`;

export const Title = styled.h1`
  font-size: 1rem;
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

const DeclineButton = styled(GhostButton)`
  margin-right: 0.6rem;
`;

const getListsInProgress =
  (peakLists: CardPeakListDatum[]) => {
    const completedLists: string[] = [];
    const listsInProgress: string[] = [];
    peakLists.forEach(peakList => {
      const {numCompletedTrips, type, shortName} = peakList;
      const numMountains = peakList.numMountains ? peakList.numMountains : 0;
      const numTrails = peakList.numTrails ? peakList.numTrails : 0;
      const numCampsites = peakList.numCampsites ? peakList.numCampsites : 0;
      const numItems = numMountains + numTrails + numCampsites;

      let totalRequiredTrips: number;
      if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
        totalRequiredTrips = numItems;
      } else if (type === PeakListVariants.fourSeason) {
        totalRequiredTrips = numItems * 4;
      } else if (type === PeakListVariants.grid) {
        totalRequiredTrips = numItems * 12;
      } else {
        totalRequiredTrips = 0;
        failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
      }

      if (totalRequiredTrips > 0 && numCompletedTrips === totalRequiredTrips) {// list complete
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

  const {loading, error, data} = usePeakListDataForUser(user.id);

  const initialProfilePictureUrl = user.hideProfilePicture ? BackupImage : user.profilePictureUrl;
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(initialProfilePictureUrl);

  const sendFriendRequestMutation = useSendFriendRequestMutation();
  const acceptFriendRequestMutation = useAcceptFriendRequestMutation();
  const removeFriendMutation = useRemoveFriendMutation();

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

  const url = userProfileLink(user.id);

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
        preposition,
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
      <FlexRow>
        <TextContainer>
          <Title>
            <Link to={url}><SemiBold>{user.name}</SemiBold></Link>
          </Title>
          {completedListsElement}
          {listsInProgressElement}
        </TextContainer>
        <PullRight>
          <ButtonPrimary onClick={sendFriendRequest}>
            {getString('user-profile-requests-add-friend')}
          </ButtonPrimary>
        </PullRight>
      </FlexRow>
    );
  } else if (friendStatus === FriendStatus.friends) {
    cardContent = (
      <FlexRow>
        <TextContainer>
          <Title>
            <Link to={url}><SemiBold>{user.name}</SemiBold></Link>
          </Title>
          <Subtitle>
            {ascentText}
          </Subtitle>
          {completedListsElement}
          {listsInProgressElement}
        </TextContainer>
      </FlexRow>
    );
  } else if (friendStatus === FriendStatus.sent) {
    cardContent = (
      <FlexRow>
        <TextContainer>
          <Title>
            <Link to={url}><SemiBold>{user.name}</SemiBold></Link>
          </Title>
          <Subtitle>
            {getString('user-profile-requests-pending-request')}
          </Subtitle>
          {completedListsElement}
          {listsInProgressElement}
        </TextContainer>
        <PullRight>
          <GhostButton onClick={removeFriend}>
            {getString('user-profile-requests-cancel-request')}
          </GhostButton>
        </PullRight>
      </FlexRow>
    );
  } else if (friendStatus === FriendStatus.recieved) {
    cardContent = (
      <FlexRow>
        <TextContainer>
          <Title>
            <Link to={url}><SemiBold>{user.name}</SemiBold></Link>
          </Title>
          <Subtitle>
            {getString('user-profile-sent-you-a-friend-request', {
              name: user.name,
            })}
          </Subtitle>
          {completedListsElement}
          {listsInProgressElement}
        </TextContainer>
        <PullRight>
          <DeclineButton onClick={removeFriend}>
            {getString('user-profile-requests-decline-request')}
          </DeclineButton>
          <ButtonPrimary onClick={acceptFriendRequest}>
            {getString('user-profile-requests-accept-request')}
          </ButtonPrimary>
        </PullRight>
      </FlexRow>
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
    <InlineCard>
      <Link to={url}>
        <ProfilePicture
          src={profilePictureUrl}
          style={{opacity}}
          alt={user.name}
          title={user.name}
          onError={onImageError}
        />
      </Link>
      <div>
        {cardContent}
      </div>
    </InlineCard>
  );
};

export default UserCard;
