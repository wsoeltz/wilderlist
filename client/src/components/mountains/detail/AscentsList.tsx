import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  GhostButton,
} from '../../../styling/styleUtils';
import { CompletedMountain, Mountain } from '../../../types/graphQLTypes';
import { convertFieldsToDate } from '../../../Utils';
import MountainCompletionModal, {
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../../peakLists/detail/MountainCompletionModal';
import {
  DateObject,
  formatDate,
  getDates,
} from '../../peakLists/Utils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import { AscentListItem, BasicListItem } from './MountainDetail';

const AddAscentButton = styled(ButtonPrimary)`
  margin-top: 1rem;
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
  userId: string;
  mountainId: string;
  mountainName: string;
}

const AscentsList = (props: Props) => {
  const { completedDates, userId, mountainId, mountainName } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [removeMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(REMOVE_MOUNTAIN_COMPLETION);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  const editMountainModal = editMountainId === null ? null : (
    <MountainCompletionModal
      editMountainId={editMountainId}
      closeEditMountainModalModal={closeEditMountainModalModal}
      userId={userId}
    />
  );

  const [dateToRemove, setDateToRemove] = useState<DateObject | null>(null);

  const closeAreYouSureModal = () => {
    setDateToRemove(null);
  };

  const confirmRemove = () => {
    if (dateToRemove !== null) {
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
          {getFluentString('mountain-detail-add-ascent-date')}
        </AddAscentButton>
      </>
    );
  }
  return (
    <>
      {output}
      {editMountainModal}
    </>
  );
};

export default AscentsList;
