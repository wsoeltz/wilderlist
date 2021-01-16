import React from 'react';
import { Link } from 'react-router-dom';
import useFluent from '../../../hooks/useFluent';
import {
  useAcceptFriendRequestMutation,
  useClearAscentNotification,
  useGetNotifications,
  useRemoveFriendMutation,
} from '../../../queries/notifications/useGetNotifications';
import {
  useTripReportMutations,
} from '../../../queries/tripReports/tripReportMutations';
import {
  addTripReportLink,
  campsiteDetailLink,
  mountainDetailLink,
  trailDetailLink,
  userProfileLink,
} from '../../../routing/Utils';
import {
  SemiBold,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import { formatStringDate } from '../../../utilities/dateUtils';
import Notification from './Notification';

interface Props {
  userId: string;
}

const NotificationBar = (props: Props) => {
  const { userId } = props;

  const getString = useFluent();

  const {loading, error, data} = useGetNotifications(userId);
  const {addMountainCompletion, addTrailCompletion, addCampsiteCompletion} = useTripReportMutations(null, 0);
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
          <Notification
            key={id}
            confirmText={getString('global-text-value-modal-confirm')}
            onConfirm={onConfirm}
            dismissText={getString('global-text-value-modal-dismiss')}
            onDismiss={dismissNotification}
          >
            <Link to={userProfileLink(friendId)}><SemiBold>{name}</SemiBold></Link>
            {' '}
            {getString('user-profile-sent-you-a-friend-request', {name: ''})}
          </Notification>
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
          userId, mountainId, trailId: null, campsiteId: null, date,
        }});
      };
      if (friend && mountain && mountainId) {
        const onConfirm = () => {
          if (mountainId) {
            addMountainCompletion({variables: {
              userId, mountainId, date,
            }});
          }
          dismissNotification();
        };

        const addTripReportUrl = addTripReportLink({
          refpath: window.location.pathname,
          mountains: mountain ? mountain.id : null,
          trails: null,
          campsites: null,
          listtype: PeakListVariants.standard,
          notification: 'yes',
          date,
        });

        return (
          <Notification
            key={id}
            confirmText={getString('global-text-value-modal-confirm')}
            onConfirm={onConfirm}
            tripReportText={getString('global-text-value-modal-create-trip-report')}
            tripReportUrl={addTripReportUrl}
            dismissText={getString('global-text-value-modal-dismiss')}
            onDismiss={dismissNotification}
          >
            <Link to={userProfileLink(friend.id)}><SemiBold>{friend.name}</SemiBold></Link>
            {' '}
            {getString('notification-bar-ascent-marked')}
            {' '}
            <Link to={mountainDetailLink(mountain.id)}><SemiBold>{mountain.name}</SemiBold></Link>
            {' '}
            {getString('global-text-value-on')}
            {' '}
            <SemiBold>{formatStringDate(date)}</SemiBold>
          </Notification>
        );

      } else {
        dismissNotification();
        return null;
      }
    } else if (user && user.trailNotifications && user.trailNotifications.length) {
      const { id, user: friend, trail, date } = user.trailNotifications[0];
      const trailId = trail ? trail.id : null;
      const dismissNotification = () => {
        clearAscentNotification({variables: {
          userId, trailId, mountainId: null, campsiteId: null, date,
        }});
      };
      if (friend && trail && trailId) {
        const onConfirm = () => {
          if (trailId) {
            addTrailCompletion({variables: {
              userId, trailId, date,
            }});
          }
          dismissNotification();
        };

        const addTripReportUrl = addTripReportLink({
          refpath: window.location.pathname,
          trails: trail ? trail.id : null,
          mountains: null,
          campsites: null,
          listtype: PeakListVariants.standard,
          notification: 'yes',
          date,
        });

        return (
          <Notification
            key={id}
            confirmText={getString('global-text-value-modal-confirm')}
            onConfirm={onConfirm}
            tripReportText={getString('global-text-value-modal-create-trip-report')}
            tripReportUrl={addTripReportUrl}
            dismissText={getString('global-text-value-modal-dismiss')}
            onDismiss={dismissNotification}
          >
            <Link to={userProfileLink(friend.id)}><SemiBold>{friend.name}</SemiBold></Link>
            {' '}
            {getString('notification-bar-ascent-marked')}
            {' '}
            <Link to={trailDetailLink(trail.id)}><SemiBold>{trail.name}</SemiBold></Link>
            {' '}
            {getString('global-text-value-on')}
            {' '}
            <SemiBold>{formatStringDate(date)}</SemiBold>
          </Notification>
        );

      } else {
        dismissNotification();
        return null;
      }
    } else if (user && user.campsiteNotifications && user.campsiteNotifications.length) {
      const { id, user: friend, campsite, date } = user.campsiteNotifications[0];
      const campsiteId = campsite ? campsite.id : null;
      const dismissNotification = () => {
        clearAscentNotification({variables: {
          userId, campsiteId, mountainId: null, trailId: null, date,
        }});
      };
      if (friend && campsite && campsiteId) {
        const onConfirm = () => {
          if (campsiteId) {
            addCampsiteCompletion({variables: {
              userId, campsiteId, date,
            }});
          }
          dismissNotification();
        };

        const addTripReportUrl = addTripReportLink({
          refpath: window.location.pathname,
          campsites: campsite ? campsite.id : null,
          mountains: null,
          trails: null,
          listtype: PeakListVariants.standard,
          notification: 'yes',
          date,
        });

        return (
          <Notification
            key={id}
            confirmText={getString('global-text-value-modal-confirm')}
            onConfirm={onConfirm}
            tripReportText={getString('global-text-value-modal-create-trip-report')}
            tripReportUrl={addTripReportUrl}
            dismissText={getString('global-text-value-modal-dismiss')}
            onDismiss={dismissNotification}
          >
            <Link to={userProfileLink(friend.id)}><SemiBold>{friend.name}</SemiBold></Link>
            {' '}
            {getString('notification-bar-ascent-marked')}
            {' '}
            <Link to={campsiteDetailLink(campsite.id)}><SemiBold>{campsite.name}</SemiBold></Link>
            {' '}
            {getString('global-text-value-on')}
            {' '}
            <SemiBold>{formatStringDate(date)}</SemiBold>
          </Notification>
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
