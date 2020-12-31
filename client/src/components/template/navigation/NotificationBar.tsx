import React, {useCallback, useState} from 'react';
import { Link } from 'react-router-dom';
import styled, {keyframes} from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  useAcceptFriendRequestMutation,
  useClearAscentNotification,
  useGetNotifications,
  useRemoveFriendMutation,
} from '../../../queries/notifications/useGetNotifications';
import {
  useTripReportMutaions,
} from '../../../queries/tripReports/tripReportMutations';
import { mountainDetailLink, userProfileLink } from '../../../routing/Utils';
import { PreContentHeaderFull } from '../../../styling/Grid';
import {
  ButtonPrimary,
  GhostButton,
  lowWarningColorLight,
  SemiBold,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import {mobileSize} from '../../../Utils';
import AscentReportFromNotification from '../../peakLists/detail/completionModal/AscentReportFromNotification';
import { formatStringDate } from '../../peakLists/Utils';

const slideDown = keyframes`
  0%   {
    opacity: 0;
    min-height: 0px;
  }
  100% {
    opacity: 1;
    min-height: 50px;
  }
`;

const Root = styled(PreContentHeaderFull)`
  overflow: hidden;
  background-color: ${lowWarningColorLight};
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  animation: ${slideDown} 0.5s ease-in-out forwards;
  z-index: 2000;

  @media (max-width: ${mobileSize}px) {
    position: fixed;
    left: 0;
    right: 0;
    top: 90px;
  }
`;

const buttonSize = '0.7rem';

const ConfirmButton = styled(ButtonPrimary)`
  margin: 0 1rem;
  font-size: ${buttonSize};
`;

const TripReportButton = styled(ButtonPrimary)`
  margin-right: 1rem;
  font-size: ${buttonSize};
  white-space: nowrap;
`;

const DismissButton = styled(GhostButton)`
  font-size: ${buttonSize};
`;

interface Props {
  userId: string;
}

const NotificationBar = (props: Props) => {
  const { userId } = props;

  const getString = useFluent();

  const [isAscentReportModalOpen, setIsAscentReportModalOpen] = useState<boolean>(false);
  const closeEditMountainModalModal = useCallback(
    () => setIsAscentReportModalOpen(false),
  [setIsAscentReportModalOpen]);
  const openEditMountainModalModal = useCallback(
    () => setIsAscentReportModalOpen(true),
  [setIsAscentReportModalOpen]);

  const {loading, error, data} = useGetNotifications(userId);
  const {addMountainCompletion} = useTripReportMutaions(null, 0);
  const clearAscentNotification = useClearAscentNotification(userId);
  const acceptFriendRequestMutation = useAcceptFriendRequestMutation(userId);
  const removeFriendMutation = useRemoveFriendMutation(userId);

  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const { user } = data;
    if (user && user.friendRequests && user.friendRequests.length && user.friendRequests[0].user) {
      const { id, name } = user.friendRequests[0].user;
      const friendId = id ? id : null;
      const dismissNotification = () => {
        if (friendId) {
          removeFriendMutation({variables: { friendId, userId }});
        }
      };
      if (friendId) {
        const onConfirm = () => {
          acceptFriendRequestMutation({variables: { friendId, userId }});
        };

        return (
          <Root key={id}>
            <div>
              <Link to={userProfileLink(friendId)}><SemiBold>{name}</SemiBold></Link>
              {' '}
              {getString('user-profile-sent-you-a-friend-request', {name: ''})}
            </div>
            <ConfirmButton onClick={onConfirm}>
              {getString('user-profile-requests-accept-request')}
            </ConfirmButton>
            <DismissButton onClick={dismissNotification}>
              {getString('user-profile-requests-decline-request')}
            </DismissButton>
          </Root>
        );
      } else {
        dismissNotification();
        return null;
      }
    } else if (user && user.ascentNotifications && user.ascentNotifications.length) {
      const { id, user: friend, mountain, date } = user.ascentNotifications[0];
      const mountainId = mountain ? mountain.id : null;
      const dismissNotification = () => {
        clearAscentNotification({variables: {
          userId, mountainId, date,
        }});
      };
      if (friend && mountain && mountainId) {
        const onConfirm = () => {
          addMountainCompletion({variables: {
            userId, mountainId, date,
          }});
          dismissNotification();
        };

        const ascentReportModal = isAscentReportModalOpen === false ? null : (
          <AscentReportFromNotification
            initialMountainList={[mountain]}
            closeEditMountainModalModal={closeEditMountainModalModal}
            userId={user.id}
            textNote={null}
            variant={PeakListVariants.standard}
            date={date}
            ascentNotifications={user.ascentNotifications}
          />
        );

        return (
          <Root key={id}>
            <div>
              <Link to={userProfileLink(friend.id)}><SemiBold>{friend.name}</SemiBold></Link>
              {' '}
              {getString('notification-bar-ascent-marked')}
              {' '}
              <Link to={mountainDetailLink(mountainId)}><SemiBold>{mountain.name}</SemiBold></Link>
              {' '}
              {getString('global-text-value-on')}
              {' '}
              <SemiBold>{formatStringDate(date)}</SemiBold>
            </div>
            <ConfirmButton onClick={onConfirm}>
              {getString('global-text-value-modal-confirm')}
            </ConfirmButton>
            <TripReportButton onClick={openEditMountainModalModal}>
              {getString('global-text-value-modal-create-trip-report')}
            </TripReportButton>
            <DismissButton onClick={dismissNotification}>
              {getString('global-text-value-modal-dismiss')}
            </DismissButton>
            {ascentReportModal}
          </Root>
        );
      } else {
        dismissNotification();
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }

};

export default NotificationBar;
