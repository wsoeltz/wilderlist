import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { mountainDetailLink, userProfileLink } from '../../routing/Utils';
import { PreContentHeaderFull } from '../../styling/Grid';
import {
  ButtonPrimary,
  GhostButton,
  lowWarningColorLight,
  SemiBold,
} from '../../styling/styleUtils';
import { User } from '../../types/graphQLTypes';
import {
  ADD_MOUNTAIN_COMPLETION,
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../peakLists/detail/MountainCompletionModal';
import { formatStringDate } from '../peakLists/Utils';

const GET_NOTIFICATIONS = gql`
  query notifications($userId: ID) {
    user(id: $userId) {
      id
      ascentNotifications {
        id
        user {
          id
          name
        }
        mountain {
          id
          name
        }
        date
      }
    }
  }
`;

interface SuccessResponse {
  user: null | {
    id: User['id'];
    ascentNotifications: User['ascentNotifications'];
  };
}

const CLEAR_ASCENT_NOTIFICATION = gql`
  mutation clearAscentNotification(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    clearAscentNotification(
      userId: $userId,
      mountainId: $mountainId,
      date: $date
    ) {
      id
      ascentNotifications {
        id
        user {
          id
          name
        }
        mountain {
          id
          name
        }
        date
      }
    }
  }
`;

const slideDown = keyframes`
  0%   {
    opacity: 0;
    height: 0px;
  }
  100% {
    opacity: 1;
    height: 50px;
  }
`;

const Root = styled(PreContentHeaderFull)`
  height: 50px;
  overflow: hidden;
  background-color: ${lowWarningColorLight};
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  animation: ${slideDown} 0.5s ease-in-out forwards;
`;

const ConfirmButton = styled(ButtonPrimary)`
  margin: 0 1rem;
`;

interface Props {
  userId: string;
}

const NotificationBar = (props: Props) => {
  const { userId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);
  const [clearAscentNotification] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(CLEAR_ASCENT_NOTIFICATION);

  const {loading, error, data} = useQuery<SuccessResponse, {userId: string}>(GET_NOTIFICATIONS, {
    variables: { userId },
  });

  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const { user } = data;
    if (user && user.ascentNotifications && user.ascentNotifications.length) {
      const { id, user: friend, mountain, date } = user.ascentNotifications[0];
      const dismissNotification = () => {
        clearAscentNotification({variables: {
          userId, mountainId: mountain.id, date,
        }});
      };
      const onConfirm = () => {
        addMountainCompletion({variables: {
          userId, mountainId: mountain.id, date,
        }});
        dismissNotification();
      };
      return (
        <Root key={id}>
          <div>
            <Link to={userProfileLink(friend.id)}><SemiBold>{friend.name}</SemiBold></Link>
            {' '}
            {getFluentString('notification-bar-ascent-marked')}
            {' '}
            <Link to={mountainDetailLink(mountain.id)}><SemiBold>{mountain.name}</SemiBold></Link>
            {' '}
            {getFluentString('global-text-value-on')}
            {' '}
            <SemiBold>{formatStringDate(date)}</SemiBold>
          </div>
          <ConfirmButton onClick={onConfirm}>
            Confirm
          </ConfirmButton>
          <GhostButton onClick={dismissNotification}>
            Dismiss
          </GhostButton>
        </Root>
      );
    } else {
      return null;
    }
  } else {
    return null;
  }

};

export default NotificationBar;
