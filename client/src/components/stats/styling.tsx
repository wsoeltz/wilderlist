import React from 'react';
import styled from 'styled-components';
import {
  primaryColor,
  Card,
  lightBaseColor,
} from '../../styling/styleUtils';
import { GetString } from 'fluent-react/compat';

export const Root = styled.div`
  margin-bottom: 4rem;
`;

export const SingleColumn = styled.div`
  margin-bottom: 2rem;
`;

export const TwoColumns = styled(SingleColumn)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 450px) {
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 1rem;
  }
`;

export const CardRoot = styled(Card)`
  margin-bottom: 0;
  display: flex;
  justify-content: flex-start;
  text-align: center;
  flex-direction: column;

  &:hover {
    cursor: auto;
    background-color: #fff;
  }
`;

const BigNumber = styled.div`
  font-family: DeliciousRomanWeb;
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${primaryColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Label = styled.div`
  font-size: 1.4rem;
  text-transform: capitalize;
  color: ${primaryColor};
`;

const SmallNumber = styled.div`
  font-family: DeliciousRomanWeb;
  font-size: 1.8rem;
  font-weight: 600;
  color: ${primaryColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const SmallLabel = styled.div`
  font-size: 1rem;
  text-transform: capitalize;
  color: ${primaryColor};
`;

export const LargeStyledNumber = (
  {value, label}: {value: number, label: string}) => {
  return (
    <CardRoot>
      <BigNumber>{value}</BigNumber>
      <Label>
        {label}
      </Label>
    </CardRoot>
  );
}

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
  {tripReports, mountains, lists, getFluentString}:
  {tripReports: number, mountains: number, lists: number, getFluentString: GetString}) => {
  console.log(getFluentString);
  const total = tripReports + mountains + lists;
  return (
    <CardRoot>
      <ContributionsRoot>
        <TotalRoot>
          <TotalNumber>{total}</TotalNumber>
          <Label>
            {'Total Wilderlist Contributions'}
          </Label>
        </TotalRoot>
        <Segment>
          <SmallNumber>{tripReports}</SmallNumber>
          <SmallLabel>
            {'Trip Reports Written'}
          </SmallLabel>
        </Segment>
        <Segment>
          <SmallNumber>{mountains}</SmallNumber>
          <SmallLabel>
            {'Mountains Added'}
          </SmallLabel>
        </Segment>
        <Segment>
          <SmallNumber>{lists}</SmallNumber>
          <SmallLabel>
            {'Hiking Lists Created'}
          </SmallLabel>
        </Segment>
      </ContributionsRoot>
    </CardRoot>
  );
}

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
  {avgTime, startDate, getFluentString}:
  {avgTime: number | undefined, startDate: string | undefined, getFluentString: GetString}) => {
  if (!startDate || !avgTime) {
    return (
      <CardRoot>
        <Label>
          {'You need more than one recorded hike with a full date to see your average.'}
        </Label>
      </CardRoot>
    );
  }
  console.log(getFluentString);
  const weeksRaw = avgTime / 7;
  const weeks = Math.floor(weeksRaw);
  const daysRaw = 7 * (weeksRaw - weeks);
  const days = Math.floor(daysRaw);
  const hoursRaw = 24 * (daysRaw - days);
  const hours = Math.floor(hoursRaw);
  const calcTime: Array<React.ReactElement<any>> = [];
  if (weeks) {
    calcTime.push(<React.Fragment key={weeks}>{weeks}<TimeLabel>weeks</TimeLabel>{' '}</React.Fragment>);
  }
  if (days) {
    calcTime.push(<React.Fragment key={days}>{days}<TimeLabel>days</TimeLabel>{' '}</React.Fragment>);
  }
  if (hours) {
    calcTime.push(<React.Fragment key={hours}>{hours}<TimeLabel>hours</TimeLabel></React.Fragment>);
  }
  return (
    <CardRoot>
      <BigNumber>{calcTime}</BigNumber>
      <Label>
        {'Average time between hikes since ' + startDate}
      </Label>
    </CardRoot>
  );

}

const ValueListLabel = styled(Label)`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-gap: 0.25rem;
  align-items: center;
`;

const ValueLabel = styled.strong`
  width: 100%;
  text-align: right;
`;
const CountLabel = styled.small`
  width: 100%;
  text-align: left;
`;

export const TopFourValuesList = (
  {val1, val2, val3, val4, getFluentString}:
  { val1: {label: string, count: number} | undefined,
    val2: {label: string, count: number} | undefined,
    val3: {label: string, count: number} | undefined,
    val4: {label: string, count: number} | undefined,
    getFluentString: GetString}) => {
  console.log(getFluentString);
  const label1 = val1 ? (
    <ValueListLabel>
      <ValueLabel>
        {val1.label}
      </ValueLabel>
      <div>-</div>
      <CountLabel>
        {val1.count} ascents
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
        {val2.count} ascents
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
        {val3.count} ascents
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
        {val4.count} ascents
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

