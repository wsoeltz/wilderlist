import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import styled, {keyframes} from 'styled-components/macro';
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
import { PeakListVariants, User } from '../../types/graphQLTypes';
import AscentReportFromNotification from '../peakLists/detail/completionModal/AscentReportFromNotification';
import {
  ADD_MOUNTAIN_COMPLETION,
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../peakLists/detail/completionModal/MountainCompletionModal';
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
          state {
            id
            abbreviation
          }
          latitude
          longitude
          elevation
        }
        date
      }
    }
  }
`;

export interface SuccessResponse {
  user: null | {
    id: User['id'];
    ascentNotifications: User['ascentNotifications'];
  };
}

export const CLEAR_ASCENT_NOTIFICATION = gql`
  mutation clearAscentNotification(
    $userId: ID!,
    $mountainId: ID,
    $date: String!
    ) {
    user: clearAscentNotification(
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
          state {
            id
            abbreviation
          }
          latitude
          longitude
          elevation
        }
        date
      }
    }
  }
`;

export interface ClearNotificationVariables {
  userId: string;
  mountainId: string | null;
  date: string;
}

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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [isAscentReportModalOpen, setIsAscentReportModalOpen] = useState<boolean>(false);

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);
  const [clearAscentNotification] =
    useMutation<SuccessResponse, ClearNotificationVariables>(CLEAR_ASCENT_NOTIFICATION);

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
            editMountainId={mountainId}
            closeEditMountainModalModal={() => setIsAscentReportModalOpen(false)}
            userId={user.id}
            textNote={null}
            mountainName={mountain.name}
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
              {getFluentString('notification-bar-ascent-marked')}
              {' '}
              <Link to={mountainDetailLink(mountainId)}><SemiBold>{mountain.name}</SemiBold></Link>
              {' '}
              {getFluentString('global-text-value-on')}
              {' '}
              <SemiBold>{formatStringDate(date)}</SemiBold>
            </div>
            <ConfirmButton onClick={onConfirm}>
              Confirm
            </ConfirmButton>
            <TripReportButton onClick={() => setIsAscentReportModalOpen(true)}>
              Create Trip Report
            </TripReportButton>
            <DismissButton onClick={dismissNotification}>
              Dismiss
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
