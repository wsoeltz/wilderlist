import React from 'react';
import { MountainDatum, DateDatum } from './index';
import styled from 'styled-components';
import { TableCellBase } from '../detail/MountainRow';
import { lightBorderColor, InputBase, warningColor, baseColor } from '../../../styling/styleUtils';

export const gridCols = {
  userInput: 1,
  expectedName: 2,
  userDate: 3,
  expectedDate: 4,
}

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
  officialMountain: MountainDatum,
  userInput: string;
  mountains: MountainDatum[],
  fixMountain: (newMountain: MountainDatum) => void;
  duplicate: boolean;
  date: DateDatum | null | undefined;
  dateInput: string;
  index: number;
}

const MountainItem = (props: Props) => {
  const {
    officialMountain, userInput, mountains, fixMountain,
    duplicate, date, dateInput, index,
  } = props;
  const options = mountains.map(mtn => {
    return <option value={mtn.id} key={mtn.id}>{mtn.name}</option>
  });
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target) {
      const newMountain = mountains.find(({id}) => id === e.target.value);
      if (newMountain) {
        fixMountain(newMountain);
      }
    }
  }

  let dateValue: React.ReactElement<any> | null;
  let dateInputText: React.ReactElement<any> | null;
  if (date === undefined) {
    dateInputText = <LightText>No date specified</LightText>;
    dateValue = (
      <DateInputContainer>
        <DayLabel>Day</DayLabel>
        <MonthLabel>Month</MonthLabel>
        <YearLabel>Year</YearLabel>
        <MonthInput placeholder='M'/>
        <DayInput placeholder='D'/>
        <YearInput placeholder='YYYY'/>
      </DateInputContainer>
    );
  } else if (date === null) {
    dateInputText = (
      <WarningText>
        Date specified but could not be determined:
        <br />
        <strong>{dateInput}</strong>
      </WarningText>);
    dateValue = (
      <DateInputContainer>
        <DayLabel>Day</DayLabel>
        <MonthLabel>Month</MonthLabel>
        <YearLabel>Year</YearLabel>
        <MonthInput placeholder='M'/>
        <DayInput placeholder='D'/>
        <YearInput placeholder='YYYY'/>
      </DateInputContainer>
    );
  } else {
    dateInputText = <>{dateInput}</>;
    dateValue = (
      <DateInputContainer>
        <DayLabel>Day</DayLabel>
        <MonthLabel>Month</MonthLabel>
        <YearLabel>Year</YearLabel>
        <MonthInput placeholder='M' defaultValue={date.month.toString()}/>
        <DayInput placeholder='D' defaultValue={date.day.toString()}/>
        <YearInput placeholder='YYYY' defaultValue={date.year.toString()}/>
      </DateInputContainer>
    );
  }



  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;
  const color = duplicate === true ? warningColor : baseColor;
  const duplicateWarning = duplicate === true ? (
    <WarningText><strong>Duplicate:</strong> There is more than one selection with this name</WarningText>
    ) : null;
  return (
    <>
      <UserInput style={{backgroundColor}}>{userInput}</UserInput>
      <ExpectedName style={{backgroundColor}}>
        <MountainSelect value={officialMountain.id} onChange={onChange} style={{color}}>
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