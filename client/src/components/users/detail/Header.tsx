import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import BackupImage from '../../../assets/images/default-user-image.jpg';
import useFluent from '../../../hooks/useFluent';
import {
  useAcceptFriendRequestMutation,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
} from '../../../queries/users/friendRequestMutations';
import { UserDatum } from '../../../queries/users/useUserProfile';
import { preventNavigation } from '../../../routing/Utils';
import {
  boldFontWeight,
  ButtonPrimary,
  GhostButton,
  Label,
  placeholderColor,
} from '../../../styling/styleUtils';
import { FriendStatus } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive, mediumSize, mobileSize } from '../../../Utils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';

const contactLinkMobileSize = 950;

const Root = styled.div`
  display: grid;
  grid-template-columns: 7rem 1fr auto;
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
  display: flex;
  align-items: center;

  @media(max-width: ${mediumSize}px) and (min-width: ${mobileSize}px) {
    padding-right: 1rem;
  }

  @media(max-width: ${contactLinkMobileSize}px) {
    font-size: 0.9rem;
  }
`;

const ProfilePicture = styled.img`
  max-width: 100%;
  border-radius: 4000px;
`;

const BoldLink = styled.a`
  white-space: nowrap;
  font-size: 0.9rem;
`;

const ContactLabel = styled(Label)`
  margin-right: 1rem;
  display: inline-block;
  font-size: 0.8rem;
  font-weight: ${boldFontWeight};
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
  font-size: 0.7rem;
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
    user: { name, email, redditId }, user,
    currentUserId, friendStatus,
  } = props;

  const getString = useFluent();

  const [removeFriendModalOpen, setRemoveFriendModalOpen] = useState<boolean>(false);

  const initialProfilePictureUrl = user.hideProfilePicture ? BackupImage : user.profilePictureUrl;
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(initialProfilePictureUrl);

  let actionButtons: React.ReactElement<any> | null;
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
      title={getString('global-text-value-are-you-sure-modal')}
      text={getString('user-profile-remove-friend-modal', {
        name: user.name,
      })}
      confirmText={getString('global-text-value-modal-confirm')}
      cancelText={getString('global-text-value-modal-cancel')}
    />
  );

  if (currentUserId === user.id) {
    actionButtons = null;
  } else if (friendStatus === null) {
    actionButtons = (
      <ButtonPrimary onClick={sendFriendRequest}>
        {getString('user-profile-requests-add-friend')}
      </ButtonPrimary>
    );
  } else if (friendStatus === FriendStatus.friends) {
    actionButtons = (
      <SmallGhostButton onClick={removeFriend}>
        {getString('user-profile-requests-remove-friend')}
      </SmallGhostButton>
    );
  } else if (friendStatus === FriendStatus.sent) {
    actionButtons = (
      <>
        <SmallText>
          {getString('user-profile-requests-pending-request')}
        </SmallText>
        <SmallGhostButton onClick={cancelOrDeclineRequest}>
          {getString('user-profile-requests-cancel-request')}
        </SmallGhostButton>
      </>
    );
  } else if (friendStatus === FriendStatus.recieved) {
    actionButtons = (
      <>
        <SmallText>
          {getString('user-profile-sent-you-a-friend-request', {
            name: user.name,
          })}
        </SmallText>
        <DeclineButton onClick={cancelOrDeclineRequest}>
          {getString('user-profile-requests-decline-request')}
        </DeclineButton>
        <ButtonPrimary onClick={acceptFriendRequest}>
          {getString('user-profile-requests-accept-request')}
        </ButtonPrimary>
      </>
    );
  } else {
    actionButtons = null;
    failIfValidOrNonExhaustive(friendStatus, 'Invalid value for friendStatus ' + friendStatus);
  }

  let emailOutput: React.ReactElement<any> | null;
  if (user.hideEmail === true) {
    emailOutput = null;
  } else if (redditId) {
    emailOutput = !user.email ? (
      <ListInfo>
        <ContactLabel>
          {getString('global-text-value-modal-reddit')}:
        </ContactLabel>
        <BoldLink href={`https://www.reddit.com/user/${name}`} target='_blank'>
          <EmailIcon icon={faReddit as IconDefinition} />
          u/{name}
        </BoldLink>
      </ListInfo>
      ) : (
      <>
        <ListInfo>
          <ContactLabel>
            {getString('global-text-value-modal-email')}:
          </ContactLabel>
          <BoldLink href={`mailto:${email}`}>
            <EmailIcon icon='envelope' />
            {email}
          </BoldLink>
        </ListInfo>
        <ListInfo>
          <ContactLabel>
            {getString('global-text-value-modal-reddit')}:
          </ContactLabel>
          <BoldLink href={`https://www.reddit.com/user/${name}`} target='_blank'>
            <EmailIcon icon={faReddit as IconDefinition} />
            u/{name}
          </BoldLink>
        </ListInfo>
      </>
    );
  } else if (user.email) {
    emailOutput = (
      <ListInfo>
        <ContactLabel>
          {getString('global-text-value-modal-email')}:
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

  const onImageError = () => {
    if (profilePictureUrl !== BackupImage) {
      setProfilePictureUrl(BackupImage);
    }
  };

  return (
    <Root>
      <TitleContent>
        <Title>{name}</Title>
        {emailOutput}
      </TitleContent>
      <ProfilePictureContainer>
        <ProfilePicture
          alt={name}
          title={name}
          src={profilePictureUrl}
          onError={onImageError}
        />
      </ProfilePictureContainer>
      <ButtonContainer>
        <ActionButtonContainer>
          {actionButtons}
        </ActionButtonContainer>
      </ButtonContainer>
      {areYouSureModal}
    </Root>
  );
};

export default Header;
