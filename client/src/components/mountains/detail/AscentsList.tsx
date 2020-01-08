import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {
  ButtonPrimary,
  GhostButton,
} from '../../../styling/styleUtils';
import { CompletedMountain, Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import NewAscentReport from '../../peakLists/detail/completionModal/NewAscentReport';
import EditAscentReport from '../../peakLists/detail/completionModal/EditAscentReport';
import {
  DateObject,
  formatDate,
  getDates,
} from '../../peakLists/Utils';
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

interface Props {
  completedDates: CompletedMountain | undefined;
  userId: string | null;
  mountainId: string;
  mountainName: string;
  getFluentString: GetString;
}

const AscentsList = (props: Props) => {
  const { completedDates, userId, mountainId, mountainName, getFluentString } = props;

  const [dateToEdit, setDateToEdit] = useState<DateObject | null>(null);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const closeAscentModalModal = () => {
    setEditMountainId(null);
    setDateToEdit(null);
  };

  let ascentModal: React.ReactElement<any> | null;
  if (editMountainId === null) {
    ascentModal = null;
  } else {
    if (!userId) {
      ascentModal = (
        <SignUpModal
          text={getFluentString('global-text-value-modal-sign-up-today-ascents-list', {
            'mountain-name': mountainName,
          })}
          onCancel={closeAscentModalModal}
        />
      );
    } else {
      ascentModal = editMountainId === null ? null : (
        <NewAscentReport
          editMountainId={editMountainId}
          closeEditMountainModalModal={closeAscentModalModal}
          userId={userId}
          mountainName={mountainName}
          variant={PeakListVariants.standard}
        />
      );
    }
  }

  const editAscentModal =
    dateToEdit === null || userId === null ? null : (
    <EditAscentReport
      editMountainId={mountainId}
      closeEditMountainModalModal={closeAscentModalModal}
      userId={userId}
      mountainName={mountainName}
      variant={PeakListVariants.standard}
      date={dateToEdit}
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
            () => setDateToEdit(date)
          }
        >
          {getFluentString('trip-reports-view-edit-button')}
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
        {editAscentModal}
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
      {ascentModal}
    </VerticalContentItem>
  );
};

export default AscentsList;
