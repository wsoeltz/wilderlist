import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ReactDatePickerProps } from 'react-datepicker';
import styled from 'styled-components/macro';
import {
  SelectBoxBase,
  SelectDateOption,
  years,
} from '../Utils';

const CalendarHeaderRoot = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`;

const MonthNavBtn = styled.button`
  background-color: transparent;
`;

const SelectYear = styled(SelectBoxBase)`
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding-right: 30px;
`;

const SelectMonth = styled(SelectBoxBase)`
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  padding-right: 25px;
`;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const renderCustomHeader: ReactDatePickerProps['renderCustomHeader'] = (dateProps) => {
  const {
    date, changeYear, changeMonth, decreaseMonth,
    increaseMonth,
  } = dateProps;
  const prevMonthButtonDisabled =
    date.getFullYear() === years[0] && date.getMonth() === 0;
  const nextMonthButtonDisabled =
    date.getFullYear() === years[years.length - 1] && date.getMonth() === 11;
  return (
    <CalendarHeaderRoot>
        <MonthNavBtn onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
          <FontAwesomeIcon icon='chevron-left' />
        </MonthNavBtn>
        <SelectYear
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}
        >
          {years.map(option => (
            <SelectDateOption key={option} value={option}>
              {option}
            </SelectDateOption>
          ))}
        </SelectYear>

        <SelectMonth
          value={months[date.getMonth()]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
        >
          {months.map(option => (
            <SelectDateOption key={option} value={option}>
              {option}
            </SelectDateOption>
          ))}
        </SelectMonth>

        <MonthNavBtn onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
          <FontAwesomeIcon icon='chevron-right' />
        </MonthNavBtn>
      </CalendarHeaderRoot>
  );
};

export default renderCustomHeader;
