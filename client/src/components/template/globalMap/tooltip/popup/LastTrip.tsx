import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {
  ButtonOutline,
  primaryColor,
  IncompleteText,
  CompleteText,
} from '../../../../../styling/styleUtils';
import {CoreItems, CoreItem} from '../../../../../types/itemTypes';
import {
  Icon,
  Root,
} from './Utils';
import useUsersProgress from '../../../../../queries/users/useUsersProgress';
import SimpleTextLoading from '../../../../sharedComponents/SimpleTextLoading';
import useFluent from '../../../../../hooks/useFluent';
import {
  formatDate,
  getDates,
} from '../../../../../utilities/dateUtils';
import {
  addTripReportLink,
} from '../../../../../routing/Utils';
import {useHistory} from 'react-router-dom';

const Content = styled.div`
  line-height: 1.2;
  padding-right: 2rem;
`;

const AscentButton = styled(ButtonOutline)`
  display: flex;
  align-items: center;
  width: min-content;
  text-align: left;
  margin-left: auto;
  padding: 0.2rem 0.4rem;
  font-size: 0.6rem;
`;

const AscentIcon = styled(Icon)`
  color: ${primaryColor};
  margin-right: 0.45rem;
`;

interface Props {
  id: string;
  itemType: CoreItems;
  close: () => void;
}

const LastTrip = ({id, itemType, close}: Props) => {
  const getString = useFluent();
  const {loading, data} = useUsersProgress();
  const item = (itemType as string).slice(0, itemType.length - 1) as CoreItem;
  const history = useHistory();

  let lastHikedText: React.ReactElement<any> | null;
  if (loading) {
    lastHikedText = <SimpleTextLoading />
  } else if (data !== undefined) {
    const target = data.progress && data.progress[itemType] !== null
      ? (data.progress[itemType] as any).find((d: any) => d[item] && d[item].id && d[item].id === id) : undefined;

    if (target && target.dates && target.dates.length) {
      const dates = getDates(target.dates);
      if (dates && dates[dates.length - 1]) {
        const {day, month, year} = dates[dates.length - 1];
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
          textDate = formatDate(dates[dates.length - 1]);
        }
        lastHikedText = (
          <CompleteText>
            {textDate}
          </CompleteText>
        );
      } else {
        lastHikedText = (
          <IncompleteText>
            {getString('global-text-value-not-done-dynamic', {type: itemType})}
          </IncompleteText>
        );
      }
    } else {
        lastHikedText = (
          <IncompleteText>
            {getString('global-text-value-not-done-dynamic', {type: itemType})}
          </IncompleteText>
        );
      }
  } else {
    lastHikedText = null;
  }

  const onAddAscent = () => {
    let tripReportUrl: string;
    if (itemType === CoreItems.mountains) {
      tripReportUrl = addTripReportLink({mountains: id})
    } else if (itemType === CoreItems.trails) {
      tripReportUrl = addTripReportLink({trails: id})
    } else if (itemType === CoreItems.campsites) {
      tripReportUrl = addTripReportLink({campsites: id})
    } else {
      tripReportUrl = addTripReportLink({})
    }
    history.push(tripReportUrl);
    close();
  }
  return (
    <Root>
      <Icon icon={faCalendarAlt} />
      <Content>
        <small>
          <em>{getString('last-trip-dynamic', {type: itemType})}</em>
        </small>
        <div>
          {lastHikedText}
        </div>
      </Content>
      <AscentButton onClick={onAddAscent}>
        <AscentIcon icon={faCalendarAlt} />
        <div>
          {getString('item-detail-log-trip', {type: item})}
        </div>
      </AscentButton>
    </Root>
  );
};

export default LastTrip;
