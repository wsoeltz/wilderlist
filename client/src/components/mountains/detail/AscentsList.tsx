import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {useUsersAscentsForMountain} from '../../../queries/users/useUsersAscentsForMountain';
import { addTripReportLink, mountainDetailLink } from '../../../routing/Utils';
import {
  AscentListItem,
  BasicListItem,
  ItemTitle,
} from '../../../styling/sharedContentStyles';
import {
  ButtonPrimaryLink,
  GhostButton,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import {
  DateObject,
  formatDate,
  getDates,
} from '../../../utilities/dateUtils';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {MountainDatum} from '../../tripReports/add/components/AddMountains';
import EditAscentReport from '../../tripReports/add/EditAscentReport';

const AddAscentButton = styled(ButtonPrimaryLink)`
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
  const userId = currentUser ? currentUser._id : '';

  const {data} = useUsersAscentsForMountain(userId);

  const userMountains = data && data.user && data.user.mountains ? data.user.mountains : [];
  const completedDates = userMountains.find((m) => m.mountain && m.mountain.id === mountain.id);

  const addTripReportUrl = addTripReportLink({
    refpath: mountainDetailLink(mountain.id),
    mountain: mountain.id,
  });

  const [dateToEdit, setDateToEdit] = useState<DateObject | null>(null);

  const closeAscentModalModal = () => {
    setDateToEdit(null);
  };

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
        <AddAscentButton to={addTripReportUrl}>
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
        <AddAscentButton to={addTripReportUrl}>
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
