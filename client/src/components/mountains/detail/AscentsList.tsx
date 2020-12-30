import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  ButtonPrimary,
  GhostButton,
} from '../../../styling/styleUtils';
import { Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import {MountainDatum} from '../../peakLists/detail/completionModal/components/AddMountains';
import EditAscentReport from '../../peakLists/detail/completionModal/EditAscentReport';
import NewAscentReport from '../../peakLists/detail/completionModal/NewAscentReport';
import {
  DateObject,
  formatDate,
  getDates,
} from '../../peakLists/Utils';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
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
  mountain: MountainDatum;
}

const AscentsList = (props: Props) => {
  const { mountain } = props;

  const getString = useFluent();
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const userMountains = (currentUser && currentUser.mountains) ? currentUser.mountains : [];
  const completedDates = userMountains.find(
    // currentUser has raw object ids instead of resolved mountain data
    (completedMountain) => (completedMountain.mountain as unknown as string) === mountain.id);

  const [dateToEdit, setDateToEdit] = useState<DateObject | null>(null);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const openEditMountainModal = useCallback(() => setEditMountainId(mountain.id), [mountain.id]);
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
          text={getString('global-text-value-modal-sign-up-today-ascents-list', {
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
          textDate = getString('global-formatted-text-date', {
            day, month, year: year.toString(),
          });
        } else {
          textDate = getString('global-formatted-text-month-year', {
            month, year: year.toString(),
          });
        }
      } else {
        textDate = formatDate(date);
      }
      const onClick = () => setDateToEdit(date);
      return (
        <AscentListItem
          key={date.dateAsNumber + index.toString()}
          onClick={onClick}
        >
          <strong>{textDate}</strong>
          <GhostButton>
            {getString('trip-reports-view-edit-button')}
          </GhostButton>
        </AscentListItem>
      );
    });
    output = (
      <>
        {completionListItems}
        <AddAscentButton onClick={openEditMountainModal}>
          <CalendarButton icon='calendar-alt' />
          {getString('mountain-detail-add-another-ascent')}
        </AddAscentButton>
        {editAscentModal}
      </>
    );
  } else {
    output = (
      <>
        <BasicListItem>{getString('mountain-detail-no-ascents-text', {
          'mountain-name': mountain.name,
        })}</BasicListItem>
        <AddAscentButton onClick={openEditMountainModal}>
          <CalendarButton icon='calendar-alt' />
          {getString('mountain-detail-add-ascent-date')}
        </AddAscentButton>
      </>
    );
  }
  return (
    <>
      <ItemTitle>{getString('global-text-value-ascent-dates')}:</ItemTitle>
      {output}
      {ascentModal}
      <MapRenderProp
        id={mountain.id}
        mountains={completedDates && completedDates.mountain
              ? [{...mountain, ascentCount: 1}] : [{...mountain, ascentCount: 0}]}
        center={mountain.location}
        type={PeakListVariants.standard}
      />
    </>
  );
};

export default AscentsList;
