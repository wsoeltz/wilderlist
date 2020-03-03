import { GetString } from 'fluent-react/compat';
import {sortBy} from 'lodash';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import { baseColor, InputBase, lightBorderColor, warningColor } from '../../../styling/styleUtils';
import { TableCellBase } from '../detail/MountainRow';
import { DateDatum, MountainDatum } from './index';

export const gridCols = {
  userInput: 1,
  expectedName: 2,
  userDate: 3,
  expectedDate: 4,
};

const TableCell = styled(TableCellBase)`
  justify-content: center;
`;

const UserInput = styled(TableCell)`
  grid-column: ${gridCols.userInput};
`;
const ExpectedName = styled(TableCell)`
  grid-column: ${gridCols.expectedName};
  flex-direction: column;
`;
const UserDate = styled(TableCell)`
  grid-column: ${gridCols.userDate};
`;
const ExpectedDate = styled(TableCell)`
  grid-column: ${gridCols.expectedDate};
`;
const MountainSelect = styled.select`
  padding: 0.3rem;
  border-radius: 4px;
`;
const DateInputContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: 3rem 3rem 5rem;
  grid-column-gap: 1rem;
  text-align: center;
`;
const MonthLabel = styled.div`
  grid-row: 1;
  grid-column: 1;
`;
const DayLabel = styled.div`
  grid-row: 1;
  grid-column: 2;
`;
const YearLabel = styled.div`
  grid-row: 1;
  grid-column: 3;
`;

const DateInputBase = styled(InputBase)`
  padding: 0.3rem;
  border-radius: 4px;
`;

const MonthInput = styled(DateInputBase)`
  grid-row: 2;
  grid-column: 1;
  text-align: center;
`;
const DayInput = styled(DateInputBase)`
  grid-row: 2;
  grid-column: 2;
  text-align: center;
`;
const YearInput = styled(DateInputBase)`
  grid-row: 2;
  grid-column: 3;
  text-align: center;
`;

const LightText = styled.span`
  opacity: 0.5;
`;

const WarningText = styled.span`
  text-align: center;
  color: ${warningColor};
`;

interface Props {
  officialMountain: MountainDatum;
  userInput: string;
  mountains: MountainDatum[];
  fixMountain: (newMountain: MountainDatum) => void;
  fixDate: (value: string | undefined, dayMonthYear: keyof DateDatum) => void;
  duplicate: boolean;
  date: DateDatum | null | undefined;
  dateInput: string;
  index: number;
  getFluentString: GetString;
}

const MountainItem = (props: Props) => {
  const {
    officialMountain, userInput, mountains, fixMountain,
    duplicate, date, dateInput, index, fixDate, getFluentString,
  } = props;
  const sortedMountains = sortBy(mountains, ['name', 'elevation']);
  const options = sortedMountains.map(mtn => {
    const abbreviation = mtn.state ? `(${mtn.state.abbreviation})` : '';
    return <option value={mtn.id} key={mtn.id}>
      {mtn.name} {abbreviation} - {mtn.elevation}ft
    </option>;
  });
  const onMountainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target) {
      const newMountain = mountains.find(({id}) => id === e.target.value);
      if (newMountain) {
        fixMountain(newMountain);
      }
    }
  };

  const initialDay = date ? date.day.toString() : undefined;
  const initialMonth = date ? date.month.toString() : undefined;
  const initialYear = date ? date.year.toString() : undefined;
  const [day, setDay] = useState<string | undefined>(initialDay);
  const [month, setMonth] = useState<string | undefined>(initialMonth);
  const [year, setYear] = useState<string | undefined>(initialYear);

  const onMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    fixDate(newMonth, 'month');
  };
  const onDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDay = e.target.value;
    setDay(newDay);
    fixDate(newDay, 'day');
  };
  const onYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    fixDate(newYear, 'year');
  };

  const dateValue: React.ReactElement<any> = (
    <DateInputContainer>
      <DayLabel>Day</DayLabel>
      <MonthLabel>Month</MonthLabel>
      <YearLabel>Year</YearLabel>
      <MonthInput type='number' placeholder='M' value={month} onChange={onMonthChange}/>
      <DayInput type='number' placeholder='D' value={day} onChange={onDayChange}/>
      <YearInput type='number' placeholder='YYYY' value={year} onChange={onYearChange}/>
    </DateInputContainer>
  );
  let dateInputText: React.ReactElement<any> | null;
  if (date === undefined) {
    dateInputText = <LightText>{getFluentString('import-ascents-no-date-specified')}</LightText>;
  } else if (date === null) {
    dateInputText = (
      <WarningText>
        {getFluentString('import-ascents-date-specified-but-could-not-get')}
        <br />
        <strong>{dateInput}</strong>
      </WarningText>);
  } else {
    dateInputText = <>{dateInput}</>;
  }

  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;
  const color = duplicate === true ? warningColor : baseColor;
  const duplicateWarning = duplicate === true ? (
    <WarningText
      dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-duplicate-text-warning')}}
    />
    ) : null;
  return (
    <>
      <UserInput style={{backgroundColor}}>{userInput}</UserInput>
      <ExpectedName style={{backgroundColor}}>
        <MountainSelect value={officialMountain.id} onChange={onMountainChange} style={{color}}>
          {options}
        </MountainSelect>
        {duplicateWarning}
      </ExpectedName>
      <UserDate style={{backgroundColor}}>
        {dateInputText}
      </UserDate>
      <ExpectedDate style={{backgroundColor}}>
        {dateValue}
      </ExpectedDate>
    </>
  );

};

export default MountainItem;
