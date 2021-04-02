import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../hooks/useFluent';
import {
  baseColor,
  lightBaseColor,
  primaryColor,
  SvgImg,
  SvgSmallImg,
} from '../../styling/styleUtils';
import AddHikingListSVG from './d3Viz/icons/add-hiking-list.svg';
import AddMountainSVG from './d3Viz/icons/add-mountain.svg';
import StarSVG from './d3Viz/icons/star.svg';
import TripReportSVG from './d3Viz/icons/trip-report.svg';

export const Title = styled.h3`
  text-align: center;
  margin-top: 0;
  margin-bottom: 0;
  color: ${baseColor};
  font-size: 1rem;
  display: flex;
  justify-content: center;
`;

export const Root = styled.div`
  margin-bottom: 4rem;
`;

export const SingleColumn = styled.div`
  margin-bottom: 2rem;
`;

export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;
  margin-bottom: 1rem;
`;

export const CardRoot = styled.div`
  margin-bottom: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;

  &:hover {
    cursor: auto;
    background-color: #fff;
  }
`;

const BigNumber = styled.div`
  font-size: 1.75rem;
  font-weight: 600;
  margin-right: 0.75rem;
  color: ${baseColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Label = styled.div`
  font-size: 1rem;
  color: ${baseColor};
`;

const SmallNumber = styled.div`
  font-family: DeliciousRomanWeb;
  font-size: 1.8rem;
  font-weight: 600;
  color: ${primaryColor};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.6rem;
`;
const SmallLabel = styled.div`
  font-size: 1rem;
  color: ${primaryColor};
`;

export const LargeStyledNumber = (
  {value, label, svg}: {value: number, label: string, svg: string}) => (
    <CardRoot>
      <SvgImg src={svg} alt={label} />
      <BigNumber>
        {value}
      </BigNumber>
      <Label>
        {label}
      </Label>
    </CardRoot>
  );

const ContributionsRoot = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-gap: 0.75rem;
`;

const TotalRoot = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 0.5rem;
`;

const Segment = styled.div`
  grid-column: 2;
`;

const TotalNumber = styled(BigNumber)`
  margin: 0;

  &:after {
    margin: 0;
    border: none;
  }
`;

export const ContributionsCard = (
  {tripReports, mountains, lists}:
  {tripReports: number, mountains: number, lists: number}) => {
  const total = tripReports + mountains + lists;
  const getString = useFluent();
  return (
    <CardRoot>
      <ContributionsRoot>
        <TotalRoot>
          <TotalNumber>
            <SvgImg
              src={StarSVG}
              alt={getString('stats-total-wilderlist-contributions')}
            />
            {total}
          </TotalNumber>
          <Label>
            {getString('stats-total-wilderlist-contributions')}
          </Label>
        </TotalRoot>
        <Segment>
          <SmallNumber>
            <SvgSmallImg src={TripReportSVG} alt={getString('stats-trip-reports-written')} />
            {tripReports}
          </SmallNumber>
          <SmallLabel>
            {getString('stats-trip-reports-written')}
          </SmallLabel>
        </Segment>
        <Segment>
          <SmallNumber>
            <SvgSmallImg src={AddMountainSVG} alt={getString('stats-mountains-added')} />
            {mountains}
          </SmallNumber>
          <SmallLabel>
            {getString('stats-mountains-added')}
          </SmallLabel>
        </Segment>
        <Segment>
          <SmallNumber>
            <SvgSmallImg src={AddHikingListSVG} alt={getString('stats-hiking-lists-created')} />
            {lists}
          </SmallNumber>
          <SmallLabel>
            {getString('stats-hiking-lists-created')}
          </SmallLabel>
        </Segment>
      </ContributionsRoot>
    </CardRoot>
  );
};

const TimeLabel = styled.span`
  font-size: 1rem;

  :not(:last-of-type) {
    margin-right: 1rem;
  }
`;

export const ContextNote = styled.small`
  color: ${lightBaseColor};
  margin: 1rem auto;
  line-height: 1.4;
`;

export const AverageTimeCard = (
  {avgTime, startDate}:
  {avgTime: number | undefined, startDate: string | undefined}) => {
  const getString = useFluent();
  if (!startDate || !avgTime) {
    return (
      <CardRoot>
        <Label>
          {getString('stats-no-average-time')}
        </Label>
      </CardRoot>
    );
  }
  const weeksRaw = avgTime / 7;
  const weeks = Math.floor(weeksRaw);
  const daysRaw = 7 * (weeksRaw - weeks);
  const days = Math.floor(daysRaw);
  const hoursRaw = 24 * (daysRaw - days);
  const hours = Math.floor(hoursRaw);
  const calcTime: Array<React.ReactElement<any>> = [];
  if (weeks) {
    const weeksText = weeks > 1 ? 'global-text-value-weeks' : 'global-text-value-week';
    calcTime.push(
      <React.Fragment key={weeks + 'weeks'}>
        {weeks}<TimeLabel>{getString(weeksText)}</TimeLabel>
        {' '}
      </React.Fragment>,
    );
  }
  if (days) {
    const daysText = days > 1 ? 'global-text-value-days' : 'global-text-value-day';
    calcTime.push(
      <React.Fragment key={days + 'days'}>
        {days}<TimeLabel>{getString(daysText)}</TimeLabel>
        {' '}
      </React.Fragment>,
    );
  }
  if (hours) {
    const hoursText = hours > 1 ? 'global-text-value-hours' : 'global-text-value-hour';
    calcTime.push(
      <React.Fragment key={hours + 'hours'}>
        {hours}<TimeLabel>{getString(hoursText)}</TimeLabel>
      </React.Fragment>,
    );
  }
  return (
    <CardRoot>
      <BigNumber>{calcTime}</BigNumber>
      <Label>
        {getString('stats-average-time-since-start', {'start-date': startDate})}
      </Label>
    </CardRoot>
  );

};

const ValueListLabel = styled(Label)`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-gap: 0.25rem;
  align-items: center;
`;

const ValueLabel = styled.strong`
  width: 100%;
  text-align: right;
  text-transform: capitalize;
`;
const CountLabel = styled.small`
  width: 100%;
  text-align: left;
`;

export const TopFourValuesList = (
  {val1, val2, val3, val4}:
  { val1: {label: string, count: number} | undefined,
    val2: {label: string, count: number} | undefined,
    val3: {label: string, count: number} | undefined,
    val4: {label: string, count: number} | undefined}) => {
  const getString = useFluent();
  const ascentsText = getString('global-text-value-ascents');
  const label1 = val1 ? (
    <ValueListLabel>
      <ValueLabel>
        {val1.label}
      </ValueLabel>
      <div>-</div>
      <CountLabel>
        {val1.count} {ascentsText}
      </CountLabel>
    </ValueListLabel>
  ) : null;
  const label2 = val2 ? (
    <ValueListLabel style={{fontSize: '1.2rem'}}>
      <ValueLabel>
        {val2.label}
      </ValueLabel>
      <div>-</div>
      <CountLabel>
        {val2.count} {ascentsText}
      </CountLabel>
    </ValueListLabel>
  ) : null;
  const label3 = val3 ? (
    <ValueListLabel style={{fontSize: '1rem'}}>
      <ValueLabel>
        {val3.label}
      </ValueLabel>
      <div>-</div>
      <CountLabel>
        {val3.count} {ascentsText}
      </CountLabel>
    </ValueListLabel>
  ) : null;
  const label4 = val4 ? (
    <ValueListLabel style={{fontSize: '0.85rem'}}>
      <ValueLabel>
        {val4.label}
      </ValueLabel>
      <div>-</div>
      <CountLabel>
        {val4.count} {ascentsText}
      </CountLabel>
    </ValueListLabel>
  ) : null;
  return (
    <CardRoot>
      {label1}
      {label2}
      {label3}
      {label4}
    </CardRoot>
  );
};
