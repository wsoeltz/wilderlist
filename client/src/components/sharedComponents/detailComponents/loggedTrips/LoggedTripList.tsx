import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {
  addTripReportLink,
  editTripReportLink,
  mountainDetailLink,
  campsiteDetailLink,
  trailDetailLink,
} from '../../../../routing/Utils';
import {Routes} from '../../../../routing/routes';
import {
  AscentListItem,
  BasicListItem,
  ItemTitle,
} from '../../../../styling/sharedContentStyles';
import {
  CompactButtonPrimaryLink,
  SemiBold,
} from '../../../../styling/styleUtils';
import { CoreItem, CoreItems } from '../../../../types/itemTypes';
import {
  formatDate,
  getDates,
} from '../../../../utilities/dateUtils';

const AddAscentButton = styled(CompactButtonPrimaryLink)`
  margin-top: 0.5rem;
`;

const CalendarButton = styled(FontAwesomeIcon)`
  color: #fff;
  margin-right: 0.5rem;
`;

interface Props {
  id: string;
  name: string;
  completedDates: string[];
  type: CoreItem;
}

const AscentsList = (props: Props) => {
  const { id, name, completedDates, type } = props;

  const getString = useFluent();

  let returnLink: (id: string) => string;
  if (type === CoreItem.mountain) {
    returnLink = mountainDetailLink;
  } else if (type === CoreItem.campsite) {
    returnLink = campsiteDetailLink;
  } else if (type === CoreItem.trail) {
    returnLink = trailDetailLink;
  } else {
    returnLink = () => Routes.Landing;
  }

  const field = type + 's' as CoreItems;

  const addTripReportUrl = addTripReportLink({
    refpath: returnLink(id),
    [field]: [id],
  });

  let output: React.ReactElement<any>;
  if (completedDates && completedDates.length) {
    const dates = getDates(completedDates);
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
      const editTripReportUrl = editTripReportLink({
        refpath: returnLink(id),
        [field]: [id],
        date: date.original,
      });
      return (
        <AscentListItem
          key={date.dateAsNumber + index.toString()}
        >
          <SemiBold>{textDate}</SemiBold>
          <br />
          <small>
            <Link to={editTripReportUrl}>
              {getString('trip-reports-view-edit-button')}
            </Link>
          </small>
        </AscentListItem>
      );
    });
    output = (
      <>
        {completionListItems}
        <AddAscentButton to={addTripReportUrl}>
          <CalendarButton icon='calendar-alt' />
          {getString('item-detail-log-trip', {type})}
        </AddAscentButton>
      </>
    );
  } else {
    output = (
      <>
        <BasicListItem>
          <em>{getString('item-detail-no-ascents-text', {name, type})}</em>
        </BasicListItem>
        <AddAscentButton to={addTripReportUrl}>
          <CalendarButton icon='calendar-alt' />
          {getString('item-detail-log-trip', {type})}
        </AddAscentButton>
      </>
    );
  }
  return (
    <>
      <ItemTitle>{getString('global-text-value-item-dates', {type})}:</ItemTitle>
      {output}
    </>
  );
};

export default AscentsList;
