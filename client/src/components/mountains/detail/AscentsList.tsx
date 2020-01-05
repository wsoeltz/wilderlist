import { useMutation } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {
  ButtonPrimary,
  GhostButton,
} from '../../../styling/styleUtils';
import { CompletedMountain, Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import { convertFieldsToDate } from '../../../Utils';
import {
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../../peakLists/detail/completionModal/MountainCompletionModal';
import NewAscentReport from '../../peakLists/detail/completionModal/NewAscentReport';
import {
  DateObject,
  formatDate,
  getDates,
} from '../../peakLists/Utils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import SignUpModal from '../../sharedComponents/SignUpModal';
import {
  AscentListItem,
  BasicListItem,
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';

const AddAscentButton = styled(ButtonPrimary)`
  margin-top: 1rem;
`;

const CalendarButton = styled(FontAwesomeIcon)`
  color: #fff;
  margin-right: 0.5rem;
`;

const REMOVE_MOUNTAIN_COMPLETION = gql`
  mutation removeMountainCompletion(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    removeMountainCompletion(
      userId: $userId,
      mountainId: $mountainId,
      date: $date
    ) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

const getDateAsString = (date: DateObject) => {
  const day = isNaN(date.day) ? '' : date.day;
  const month = isNaN(date.month) ? '' : date.month;
  const year = isNaN(date.year) ? '' : date.year;
  const result = convertFieldsToDate(day.toString(), month.toString(), year.toString());
  if (result.error || result.date === undefined) {
    return '';
  }
  return result.date;
};

interface Props {
  completedDates: CompletedMountain | undefined;
  userId: string | null;
  mountainId: string;
  mountainName: string;
  getFluentString: GetString;
}

const AscentsList = (props: Props) => {
  const { completedDates, userId, mountainId, mountainName, getFluentString } = props;

  const [removeMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(REMOVE_MOUNTAIN_COMPLETION);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };

  let editMountainModal: React.ReactElement<any> | null;
  if (editMountainId === null) {
    editMountainModal = null;
  } else {
    if (!userId) {
      editMountainModal = (
        <SignUpModal
          text={getFluentString('global-text-value-modal-sign-up-today-ascents-list', {
            'mountain-name': mountainName,
          })}
          onCancel={closeEditMountainModalModal}
        />
      );
    } else {
      editMountainModal = editMountainId === null ? null : (
        <NewAscentReport
          editMountainId={editMountainId}
          closeEditMountainModalModal={closeEditMountainModalModal}
          userId={userId}
          mountainName={mountainName}
          variant={PeakListVariants.standard}
        />
      );
    }
  }

  const [dateToRemove, setDateToRemove] = useState<DateObject | null>(null);

  const closeAreYouSureModal = () => {
    setDateToRemove(null);
  };

  const confirmRemove = () => {
    if (userId && dateToRemove !== null) {
      removeMountainCompletion({ variables: { userId, mountainId, date: getDateAsString(dateToRemove)}});
    }
    closeAreYouSureModal();
  };

  const areYouSureModal = dateToRemove === null ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={getFluentString('global-text-value-are-you-sure-modal')}
      text={getFluentString('mountain-detail-remove-ascent-modal-text', {
        date: formatDate(dateToRemove),
      })}
      confirmText={getFluentString('global-text-value-modal-confirm')}
      cancelText={getFluentString('global-text-value-modal-cancel')}
    />
  );

  let output: React.ReactElement<any>;
  if (completedDates && completedDates.dates.length) {
    const dates = getDates(completedDates.dates);
    const completionListItems = dates.map((date, index) => (
      <AscentListItem key={date.dateAsNumber + index.toString()}>
        <strong>{formatDate(date)}</strong>
        <GhostButton
          onClick={
            () => setDateToRemove(date)
          }
        >
          {getFluentString('mountain-detail-remove-ascent')}
        </GhostButton>
      </AscentListItem>
    ));
    output = (
      <>
        {completionListItems}
        <AddAscentButton onClick={() => setEditMountainId(mountainId)}>
          <CalendarButton icon='calendar-alt' />
          {getFluentString('mountain-detail-add-another-ascent')}
        </AddAscentButton>
        {areYouSureModal}
      </>
    );
  } else {
    output = (
      <>
        <BasicListItem>{getFluentString('mountain-detail-no-ascents-text', {
          'mountain-name': mountainName,
        })}</BasicListItem>
        <AddAscentButton onClick={() => setEditMountainId(mountainId)}>
          <CalendarButton icon='calendar-alt' />
          {getFluentString('mountain-detail-add-ascent-date')}
        </AddAscentButton>
      </>
    );
  }
  return (
    <VerticalContentItem>
      <ItemTitle>{getFluentString('global-text-value-ascent-dates')}:</ItemTitle>
      {output}
      {editMountainModal}
    </VerticalContentItem>
  );
};

export default AscentsList;
