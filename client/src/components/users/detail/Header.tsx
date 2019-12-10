import { useMutation } from '@apollo/react-hooks';
import {
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { comparePeakListIsolatedLink, comparePeakListLink, preventNavigation } from '../../../routing/Utils';
import {
  boldFontWeight,
  ButtonPrimary,
  ButtonPrimaryLink,
  GhostButton,
  Label,
  placeholderColor,
} from '../../../styling/styleUtils';
import { FriendStatus } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import {
  ACCEPT_FRIEND_REQUEST,
  FriendRequestSuccessResponse,
  FriendRequestVariables,
  REMOVE_FRIEND,
  SEND_FRIEND_REQUEST,
} from '../list/UserCard';
import { UserDatum } from './UserProfile';

const contactLinkMobileSize = 780;

const Root = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto auto;
`;

const TitleContent = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  grid-column: 3;
  grid-row: 2;
  text-align: right;

  @media(max-width: ${contactLinkMobileSize}px) {
    grid-column: 1/ span 3;
    grid-row: 3;
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    text-align: left;
  }
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const ListInfo = styled.h3`
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const ProfilePictureContainer = styled.div`
  grid-row: 2;
  grid-column: 1;
  padding-right: 2rem;

  @media(max-width: ${contactLinkMobileSize}px) {
    font-size: 0.9rem;
  }
`;

const ProfilePicture = styled.img`
  max-width: 10rem;
  border-radius: 4000px;

  @media(max-width: 550px) {
    max-width: 6rem;
  }
`;

const ProfilePictureEmpty = styled.div`
  max-width: 100%;
  width: 10rem;
  padding-top: 100%;
  border-radius: 4000px;
  background-color: gray;

  @media(max-width: 550px) {
    max-width: 6rem;
  }
`;

const BoldLink = styled.a`
  font-weight: ${boldFontWeight};
  white-space: nowrap;

  @media(max-width: ${contactLinkMobileSize}px) {
    font-size: 0.9rem;
  }
`;

const ContactLabel = styled(Label)`
  margin-right: 1rem;
  display: inline-block;

  @media(max-width: ${contactLinkMobileSize}px) {
    font-size: 0.9rem;
  }
`;

const EmailIcon = styled(FontAwesomeIcon)`
  font-size: 1.1rem;
  margin-right: 0.45rem;
  position: relative;
  top: 3px;
`;

const SmallText = styled.div`
  color: ${placeholderColor};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ActionButtonContainer = styled.div`
  margin-bottom: 1rem;
`;

const SmallGhostButton = styled(GhostButton)`
  font-size: 0.6rem;
`;

const DeclineButton = styled(GhostButton)`
  margin-right: 0.4rem;
`;

interface Props {
  user: UserDatum;
  friendStatus: FriendStatus | null;
  currentUserId: string;
}

const Header = (props: Props) => {
  const {
    user: { name, email, profilePictureUrl, redditId }, user,
    currentUserId, friendStatus,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [removeFriendModalOpen, setRemoveFriendModalOpen] = useState<boolean>(false);

  let actionButtons: React.ReactElement<any> | null;
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
  const cancelOrDeclineRequest = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    removeFriendMutation({variables: {userId: currentUserId, friendId: user.id}});
  };
  const removeFriend = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    setRemoveFriendModalOpen(true);
  };

  const closeAreYouSureModal = () => {
    setRemoveFriendModalOpen(false);
  };

  const confirmRemove = () => {
    if (removeFriendModalOpen !== false) {
      removeFriendMutation({variables: {userId: currentUserId, friendId: user.id}});
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = removeFriendModalOpen === false ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={getFluentString('global-text-value-are-you-sure-modal')}
      text={getFluentString('user-profile-remove-friend-modal', {
        name: user.name,
      })}
      confirmText={getFluentString('global-text-value-modal-confirm')}
      cancelText={getFluentString('global-text-value-modal-cancel')}
    />
  );

  if (currentUserId === user.id) {
    actionButtons = null;
  } else if (friendStatus === null) {
    actionButtons = (
      <ButtonPrimary onClick={sendFriendRequest}>
        {getFluentString('user-profile-requests-add-friend')}
      </ButtonPrimary>
    );
  } else if (friendStatus === FriendStatus.friends) {
    actionButtons = (
      <SmallGhostButton onClick={removeFriend}>
        {getFluentString('user-profile-requests-remove-friend')}
      </SmallGhostButton>
    );
  } else if (friendStatus === FriendStatus.sent) {
    actionButtons = (
      <>
        <SmallText>
          {getFluentString('user-profile-requests-pending-request')}
        </SmallText>
        <SmallGhostButton onClick={cancelOrDeclineRequest}>
          {getFluentString('user-profile-requests-cancel-request')}
        </SmallGhostButton>
      </>
    );
  } else if (friendStatus === FriendStatus.recieved) {
    actionButtons = (
      <>
        <SmallText>
          {getFluentString('user-profile-sent-you-a-friend-request', {
            name: user.name,
          })}
        </SmallText>
        <DeclineButton onClick={cancelOrDeclineRequest}>
          {getFluentString('user-profile-requests-decline-request')}
        </DeclineButton>
        <ButtonPrimary onClick={acceptFriendRequest}>
          {getFluentString('user-profile-requests-accept-request')}
        </ButtonPrimary>
      </>
    );
  } else {
    failIfValidOrNonExhaustive(friendStatus, 'Invalid value for friendStatus ' + friendStatus);
    actionButtons = null;
  }

  const compareAllAscentsBtn = user.id === currentUserId ? null : (
    <div>
      <ButtonPrimaryLink
        desktopURL={comparePeakListLink(user.id, 'all')}
        mobileURL={comparePeakListIsolatedLink(user.id, 'all')}
      >
        {getFluentString('user-profile-compare-all-ascents')}
      </ButtonPrimaryLink>
    </div>
  );

  let emailOutput: React.ReactElement<any> | null;
  if (user.hideEmail === true) {
    emailOutput = null;
  } else if (redditId) {
    emailOutput = !user.email ? (
      <ListInfo>
        <ContactLabel>
          {getFluentString('global-text-value-modal-reddit')}:
        </ContactLabel>
        <BoldLink href={`https://www.reddit.com/user/${name}`} target='_blank'>
          <EmailIcon icon={faReddit} />
          u/{name}
        </BoldLink>
      </ListInfo>
      ) : (
      <>
        <ListInfo>
          <ContactLabel>
            {getFluentString('global-text-value-modal-email')}:
          </ContactLabel>
          <BoldLink href={`mailto:${email}`}>
            <EmailIcon icon='envelope' />
            {email}
          </BoldLink>
        </ListInfo>
        <ListInfo>
          <ContactLabel>
            {getFluentString('global-text-value-modal-reddit')}:
          </ContactLabel>
          <BoldLink href={`https://www.reddit.com/user/${name}`} target='_blank'>
            <EmailIcon icon={faReddit} />
            u/{name}
          </BoldLink>
        </ListInfo>
      </>
    );
  } else if (user.email) {
    emailOutput = (
      <ListInfo>
        <ContactLabel>
          {getFluentString('global-text-value-modal-email')}:
        </ContactLabel>
        <BoldLink href={`mailto:${email}`}>
          <EmailIcon icon='envelope' />
          {email}
        </BoldLink>
      </ListInfo>
    );
  } else {
    emailOutput = null;
  }

  const profilePicture = user.hideProfilePicture === true ? (
      <ProfilePictureContainer>
        <ProfilePictureEmpty />
      </ProfilePictureContainer>
    ) : (
      <ProfilePictureContainer>
        <ProfilePicture alt={name} title={name} src={profilePictureUrl}/>
      </ProfilePictureContainer>
    );

  return (
    <Root>
      <TitleContent>
        <Title>{name}</Title>
        {emailOutput}
      </TitleContent>
      {profilePicture}
      <ButtonContainer>
        <ActionButtonContainer>
          {actionButtons}
        </ActionButtonContainer>
        {compareAllAscentsBtn}
      </ButtonContainer>
      {areYouSureModal}
    </Root>
  );
};

export default Header;
