import React from 'react';
import { MountainDatum, DateDatum } from './index';

interface Props {
  officialMountain: MountainDatum,
  userInput: string;
  mountains: MountainDatum[],
  fixMountain: (newMountain: MountainDatum) => void;
  duplicate: boolean;
  date: DateDatum | null | undefined;
  dateInput: string;
}

const MountainItem = (props: Props) => {
  const {
    officialMountain, userInput, mountains, fixMountain,
    duplicate, date, dateInput,
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
  if (date === undefined) {
    dateValue = (
      <>
        <em>No date specified</em>
        <input placeholder='month'/>
        <input placeholder='day'/>
        <input placeholder='year'/>
      </>
    );
  } else if (date === null) {
    dateValue = (
      <>
        <strong>A date was specified but could not be determined</strong>
        <input placeholder='month'/>
        <input placeholder='day'/>
        <input placeholder='year'/>
      </>
    );
  } else {
    dateValue = (
      <>
        <>The following date was read</>
        <input placeholder='month' defaultValue={date.month.toString()}/>
        <input placeholder='day' defaultValue={date.day.toString()}/>
        <input placeholder='year' defaultValue={date.year.toString()}/>
      </>
    );
  }


  const color = duplicate === true ? 'red' : 'black';
  return (
    <li style={{color}}>
      <strong>You said:{' '}</strong>{userInput}
      {' '}
      <strong>We said:{' '}</strong>
      <select value={officialMountain.id} onChange={onChange}>
        {options}
      </select>
      {' | '}
      <strong>Your date:{' '}</strong>{dateInput}
      <strong>Our date:{' '}</strong>
      {dateValue}
    </li>
  );

};

export default MountainItem;