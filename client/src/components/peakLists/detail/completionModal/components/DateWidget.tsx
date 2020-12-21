import React, {useCallback} from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components/macro';
import useFluent from '../../../../../hooks/useFluent';
import {
  GhostButton,
  lightBlue,
  lightBorderColor,
  secondaryColor,
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {
  PeakListVariants,
} from '../../../../../types/graphQLTypes';
import {
  getMonthIndex,
  getSeason,
  Months,
  Seasons,
} from '../../../../../Utils';
import {mobileWidth} from '../../../../sharedComponents/Modal';
import { DateType } from '../../../Utils';
import '../react-datepicker.custom.css';
import {
  NoDateText,
  SelectBoxBase,
  SelectDateOption,
  today,
  years,
} from '../Utils';
import renderCustomHeader from './datePickerRenderProps';

const Root = styled.div`
  margin-bottom: 1rem;

  @media (min-width: ${mobileWidth}px) {
    min-width: 248px;
    min-height: 415px;
  }
`;

const DateInputContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  border: solid 1px ${lightBorderColor};
  border-top: none;

  /* This is necessary as datepicker wraps the datepicker
     in a blank div with no class name that can't be removed */
  div:not([class]) {
    display: flex;
  }
`;
const HideCalendar = styled.div`
  display: none;
`;

const SelectYearYearOnly = styled(SelectBoxBase)`
  border-radius: 4px;
  max-height: 2.5rem;
`;

const ToggleTypeButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const ToggleTypeButton = styled(GhostButton)`
  width: 100%;
  border-radius: 0;
  border: solid 1px ${lightBorderColor};
  background-color: ${tertiaryColor};

  &:not(:first-child) {
    border-left: none;
  }

  &.active {
    background-color: #fff;
    border-bottom: none;
  }

  &:hover {
    background-color: ${lightBlue};
    color: ${secondaryColor};
  }

  &:focus {
    outline: none;
  }
`;

export type Restrictions = {
  variant: PeakListVariants.standard;
} | {
  variant: PeakListVariants.winter;
} | {
  variant: PeakListVariants.fourSeason;
  season: Seasons;
} | {
  variant: PeakListVariants.grid;
  month: Months;
};

interface BaseProps {
  setDates: (date: Date | null) => void;
  setDateType: (date: DateType) => void;
  dateType: DateType;
  setYearOnly: (year: string) => void;
  startDate: Date | null;
  initialStartDate: Date | null;
  completionYear: string;
}

type Props = BaseProps & Restrictions;

const DateWidget = (props: Props) => {
  const {
    setDates, setDateType, dateType, setYearOnly,
    startDate, initialStartDate, completionYear,
  } = props;

  const getString = useFluent();

  const setDateToFull = useCallback(() => {
    setDates(null);
    setDateType(DateType.full);
  }, [setDates, setDateType]);
  const setDateToMonthYear = useCallback(() => {
    setDates(null);
    setDateType(DateType.monthYear);
  }, [setDates, setDateType]);
  const setDateToYearOnly = useCallback(() => {
    setDates(null);
    setYearOnly(new Date().getFullYear().toString());
    setDateType(DateType.yearOnly);
  }, [setDates, setDateType, setYearOnly]);
  const setDateToNone = useCallback(() => {
    setDates(null);
    setDateType(DateType.none);
  }, [setDates, setDateType]);

  const yearOutOfBounds = (year: number) => year > today.getFullYear();

  let filterDate: (date: Date) => boolean;
  let initialDate: Date;
  let toggleButtons: React.ReactElement<any> | null = null;
  let datePickers: React.ReactElement<any> | null;
  if (props.variant === PeakListVariants.standard) {
    initialDate = today;
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      return true;
    };
    toggleButtons = (
      <ToggleTypeButtonContainer>
        <ToggleTypeButton
          onClick={setDateToFull}
          className={dateType === DateType.full ? 'active' : ''}
        >
          {getString('mountain-completion-modal-toggle-btn-full-date')}
        </ToggleTypeButton>
        <ToggleTypeButton
          onClick={setDateToMonthYear}
          className={dateType === DateType.monthYear ? 'active' : ''}
        >
          {getString('mountain-completion-modal-toggle-btn-month-year')}
        </ToggleTypeButton>
        <ToggleTypeButton
          onClick={setDateToYearOnly}
          className={dateType === DateType.yearOnly ? 'active' : ''}
        >
          {getString('mountain-completion-modal-toggle-btn-year-only')}
        </ToggleTypeButton>
        <ToggleTypeButton
          onClick={setDateToNone}
          className={dateType === DateType.none ? 'active' : ''}
        >
          {getString('mountain-completion-modal-toggle-btn-no-date')}
        </ToggleTypeButton>
      </ToggleTypeButtonContainer>
    );
  } else if (props.variant === PeakListVariants.winter) {
    initialDate = new Date(today.getFullYear() - 1, 11);
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const season = getSeason(year, month, day);
      if (season === Seasons.winter) {
        return true;
      }
      return false;
    };
  } else if (props.variant === PeakListVariants.fourSeason) {
    if (props.season === Seasons.fall) {
      initialDate = new Date(today.getFullYear(), 8);
    } else if (props.season === Seasons.winter) {
      initialDate = new Date(today.getFullYear() - 1, 11);
    } else if (props.season === Seasons.spring) {
      initialDate = new Date(today.getFullYear(), 2);
    } else if (props.season === Seasons.summer) {
      initialDate = new Date(today.getFullYear(), 5);
    } else {
      initialDate = today;
    }
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const season = getSeason(year, month, day);
      if (season === props.season) {
        return true;
      }
      return false;
    };
  } else if (props.variant === PeakListVariants.grid) {
    const monthIndex = getMonthIndex(props.month);
    initialDate = new Date(today.getFullYear(), monthIndex - 1);
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      const month = date.getMonth() + 1;
      if (month === monthIndex) {
        return true;
      }
      return false;
    };
  } else {
    initialDate = today;
    filterDate = () => true;
  }
  if (dateType === DateType.full || dateType === DateType.monthYear) {
    const input = dateType === DateType.monthYear ? null : (
      <DatePicker
        selected={startDate}
        onChange={date => setDates(date)}
        filterDate={filterDate}
        popperContainer={HideCalendar}
        disabledKeyboardNavigation={true}
        isClearable={true}
        placeholderText={'MM/DD/YYYY'}
      />
    );
    datePickers = (
      <>
        {input}
        <DatePicker
          selected={startDate}
          onChange={date => setDates(date)}
          filterDate={filterDate}
          inline={true}
          todayButton={getString('global-text-value-today')}
          showMonthDropdown={true}
          showYearDropdown={true}
          dropdownMode={'select'}
          renderCustomHeader={dateType === DateType.monthYear ? undefined : renderCustomHeader}
          fixedHeight={true}
          calendarClassName={'mountain-completion-modal-datepicker'}
          openToDate={initialStartDate ? initialStartDate : initialDate}
          showMonthYearPicker={dateType === DateType.monthYear}
        />
      </>
    );
  } else if (dateType === DateType.yearOnly) {
    datePickers = (
      <SelectYearYearOnly
        value={completionYear}
        onChange={e => setYearOnly(e.target.value)}
      >
        {years.map(option => (
          <SelectDateOption key={option} value={option}>
            {option}
          </SelectDateOption>
        ))}
      </SelectYearYearOnly>
    );
  } else if (dateType === DateType.none) {
    datePickers = (
      <NoDateText>
        {getString('mountain-completion-modal-no-date')}
      </NoDateText>
    );
  } else {
    datePickers = null;
  }

  return (
    <Root>
      {toggleButtons}
      <DateInputContainer
        style={{borderTop: toggleButtons === null ? 'solid 1px ' + lightBorderColor : undefined}}
      >
        {datePickers}
      </DateInputContainer>
    </Root>
  );
};

export default DateWidget;
