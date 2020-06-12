import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {
  ButtonPrimary,
  GhostButton,
} from '../../../styling/styleUtils';
import { CompletedMountain, Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import {MountainDatum} from '../../peakLists/detail/completionModal/components/AddMountains';
import EditAscentReport from '../../peakLists/detail/completionModal/EditAscentReport';
import NewAscentReport from '../../peakLists/detail/completionModal/NewAscentReport';
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
  mountain: MountainDatum;
  getFluentString: GetString;
}

const AscentsList = (props: Props) => {
  const { completedDates, userId, getFluentString, mountain } = props;

  const [dateToEdit, setDateToEdit] = useState<DateObject | null>(null);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(mountain.id);
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
            'mountain-name': mountain.name,
          })}
          onCancel={closeAscentModalModal}
        />
      );
    } else {
      ascentModal = editMountainId === null ? null : (
        <NewAscentReport
          initialMountainList={[mountain]}
          closeEditMountainModalModal={closeAscentModalModal}
          userId={userId}
          variant={PeakListVariants.standard}
        />
      );
    }
  }

  const editAscentModal =
    dateToEdit === null || userId === null ? null : (
    <EditAscentReport
      initialMountainList={[mountain]}
      closeEditMountainModalModal={closeAscentModalModal}
      userId={userId}
      variant={PeakListVariants.standard}
      date={dateToEdit}
    />
  );

  let output: React.ReactElement<any>;
  if (completedDates && completedDates.dates.length) {
    const dates = getDates(completedDates.dates);
    const completionListItems = dates.map((date, index) => {
      const {day, month, year} = date;
      let textDate: string;
      if (!isNaN(month) && !isNaN(year)) {
        if (!isNaN(day)) {
          textDate = getFluentString('global-formatted-text-date', {
            day, month, year: year.toString(),
          });
        } else {
          textDate = getFluentString('global-formatted-text-month-year', {
            month, year: year.toString(),
          });
        }
      } else {
        textDate = formatDate(date);
      }
      return (
        <AscentListItem
          key={date.dateAsNumber + index.toString()}
          onClick={() => setDateToEdit(date)}
        >
          <strong>{textDate}</strong>
          <GhostButton>
            {getFluentString('trip-reports-view-edit-button')}
          </GhostButton>
        </AscentListItem>
      );
    });
    output = (
      <>
        {completionListItems}
        <AddAscentButton onClick={() => setEditMountainId(mountain.id)}>
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
          'mountain-name': mountain.name,
        })}</BasicListItem>
        <AddAscentButton onClick={() => setEditMountainId(mountain.id)}>
          <CalendarButton icon='calendar-alt' />
          {getFluentString('mountain-detail-add-ascent-date')}
        </AddAscentButton>
      </>
    );
  }
  return (
    <>
      <ItemTitle>{getFluentString('global-text-value-ascent-dates')}:</ItemTitle>
      {output}
      {ascentModal}
    </>
  );
};

export default AscentsList;
