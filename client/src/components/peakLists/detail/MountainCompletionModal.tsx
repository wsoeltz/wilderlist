import { useMutation } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, { useContext, useState } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  ButtonSecondary,
  warningColor,
} from '../../../styling/styleUtils';
import { Mountain, User, PeakListVariants } from '../../../types/graphQLTypes';
import {
  convertFieldsToDate,
  Seasons,
  Months,
  getSeason,
  getMonthIndex,
} from '../../../Utils';
import Modal from '../../sharedComponents/Modal';
import './react-datepicker.custom.css';

const DateInputContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 1rem;
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const Error = styled.p`
  color: ${warningColor};
  text-align: center;
`;

const HideCalendar = styled.div`
  display: none;

  /* This is necessary as datepicker wraps the datepicker
     in a blank div with no class name that can't be removed */
  + div {
    display: flex;
  }
`;

const CalendarHeaderRoot = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`;

const MonthNavBtn = styled.button`
  background-color: transparent;
`;

/* tslint:disable:max-line-length */
const SelectBoxBase = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  font-size: 1rem;
  padding: 7px;
  border-radius: 0;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;

  &:hover {
    cursor: pointer;
    background-color: #ddd;
  }
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
  padding-right: 20px;
`;
const SelectDateOption = styled.option`
  padding: 4px;
`;

const TitleText = styled.h3`
  text-transform: capitalize;
`;

export const ADD_MOUNTAIN_COMPLETION = gql`
  mutation addMountainCompletion(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    addMountainCompletion(
      userId: $userId,
      mountainId: $mountainId,
      date: $date
    ) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

export interface MountainCompletionSuccessResponse {
  id: User['id'];
  mountains: User['mountains'];
}

export interface MountainCompletionVariables {
  userId: string;
  mountainId: string;
  date: string;
}

interface BaseProps {
  editMountainId: string;
  mountainName: string;
  closeEditMountainModalModal: () => void;
  userId: string;
  textNote?: React.ReactElement<any> | null;
}

type Restrictions = {
  variant: PeakListVariants.standard;
} | {
  variant: PeakListVariants.winter;
} | {
  variant: PeakListVariants.fourSeason;
  season: Seasons;
} | {
  variant: PeakListVariants.grid;
  month: Months;
}

type Props = BaseProps & Restrictions;

const MountainCompletionModal = (props: Props) => {
  const {
    editMountainId, closeEditMountainModalModal, userId, textNote,
    mountainName,
  } = props;

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);
  const [completionDay, setCompletionDay] = useState<string>('');
  const [completionMonth, setCompletionMonth] = useState<string>('');
  const [completionYear, setCompletionYear] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const setDates = (date: Date | null) => {
    if (date !== null) {
      const newYear = date.getFullYear();
      const newMonth = date.getMonth() + 1;
      const newDay = date.getDate();
      setCompletionYear(newYear.toString());
      setCompletionMonth(newMonth.toString());
      setCompletionDay(newDay.toString());
    }
    setStartDate(date);
  };

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const validateAndAddMountainCompletion = (mountainId: Mountain['id']) => {
    const completedDate = convertFieldsToDate(completionDay, completionMonth, completionYear);
    if (completedDate.error !== undefined) {
      setErrorMessage(completedDate.error);
    } else {
      setErrorMessage(undefined);
      addMountainCompletion({ variables: {userId, mountainId, date: completedDate.date}});
      closeEditMountainModalModal();
    }
  };

  const error = errorMessage === undefined ? null : <Error>{errorMessage}</Error>;
  const today = new Date();
  const years: number[] = [];
  for (let i = 1900; i < today.getFullYear() + 1; i++) {
    years.push(i);
  }
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

  const yearOutOfBounds = (year: number) => year > today.getFullYear();

  let title: string;
  let filterDate: (date: Date) => boolean;
  if (props.variant === PeakListVariants.standard) {
    title = mountainName;
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      return true;
    }
  } else if (props.variant === PeakListVariants.winter) {
    title = mountainName + ' - ' + Seasons.winter;
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
    title = mountainName + ' - ' + props.season;
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
    title = mountainName + ' - ' + props.month;
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      const month = date.getMonth() + 1;
      const monthIndex = getMonthIndex(props.month)
      if (month === monthIndex) {
        return true;
      }
      return false;
    };
  } else {
    title = mountainName;
    filterDate = () => true;
  }


  return (
    <Modal
      onClose={closeEditMountainModalModal}
      width={'300px'}
      height={'auto'}
    >
      <TitleText>{title}</TitleText>
      <DateInputContainer>
        <DatePicker
          selected={startDate}
          onChange={date => setDates(date)}
          filterDate={filterDate}
          popperContainer={HideCalendar}
          disabledKeyboardNavigation={true}
          isClearable={true}
          placeholderText={'MM/DD/YYYY'}
        />
        <DatePicker
          selected={startDate}
          onChange={date => setDates(date)}
          filterDate={filterDate}
          inline={true}
          todayButton={'Today'}
          showMonthDropdown={true}
          showYearDropdown={true}
          dropdownMode={'select'}
          renderCustomHeader={renderCustomHeader}
          fixedHeight={true}
          calendarClassName={'mountain-completion-modal-datepicker'}
        />
      </DateInputContainer>
      {error}
      {textNote}
      <ButtonWrapper>
        <CancelButton onClick={closeEditMountainModalModal}>
          {getFluentString('global-text-value-modal-cancel')}
        </CancelButton>
        <ButtonPrimary onClick={() => validateAndAddMountainCompletion(editMountainId)}>
          {getFluentString('global-text-value-modal-mark-complete')}
        </ButtonPrimary>
      </ButtonWrapper>
    </Modal>
  );
};

export default MountainCompletionModal;
