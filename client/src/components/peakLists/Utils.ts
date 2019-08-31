import { sortBy } from 'lodash';
import { CompletedMountain } from '../../types/graphQLTypes';

interface DateObject {
  dateAsNumber: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export const getStandardCompletion = ({dates}: CompletedMountain) => {
  if (dates.length === 0) {
    return null;
  }
  const parsedDates: DateObject[] = dates.map(date => {
    const dateParts = date.split('-');
    return {
      dateAsNumber: parseInt(date.replace(/-/g, ''), 10),
      year: parseInt(dateParts[0], 10),
      month: parseInt(dateParts[1], 10),
      day: parseInt(dateParts[2], 10),
      hour: parseInt(dateParts[3], 10),
      minute: parseInt(dateParts[4], 10),
    };
  });
  const sortedDates = sortBy(parsedDates, ({dateAsNumber}) => dateAsNumber);
  return sortedDates[0];
};

// export const getWinterCompletion = () => {

// };

// export const getFourSeasonCompletion = () => {

// };

// export const getGridCompletion = () => {

// };

export const formatDate = (date: DateObject) => {
  const { day, month, year } = date;
  let formattedDate = '';
  if (!isNaN(month)) {
    formattedDate = formattedDate + month + '/';
  }
  if (!isNaN(day)) {
    formattedDate = formattedDate + day + '/';
  }
  if (!isNaN(year)) {
    formattedDate = formattedDate + year;
  }
  return formattedDate;
};
