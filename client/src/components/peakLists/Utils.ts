import { sortBy } from 'lodash';
import { CompletedMountain } from '../../types/graphQLTypes';
import { getSeason, Seasons } from '../../Utils';

interface DateObject {
  dateAsNumber: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const getDates = (dates: CompletedMountain['dates']) => {
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
    return sortBy(parsedDates, ({dateAsNumber}) => dateAsNumber);
};

export const getStandardCompletion = ({dates}: CompletedMountain) => {
  if (dates.length === 0) {
    return null;
  }
  return getDates(dates)[0];
};

export const getWinterCompletion = ({dates}: CompletedMountain) => {
  if (dates.length === 0) {
    return null;
  }
  // get fist date that is in the winter
  const sortedDates = getDates(dates);
  const firstWinterDate = sortedDates.find(({day, month, year}) => {
    if (!isNaN(day) && !isNaN(month) && !isNaN(year) ) {
      const season: Seasons | undefined = getSeason(year, month, day);
      if (season !== Seasons.winter) {
        return false;
      }
      return true;
    }
    return false;
  });
  if (firstWinterDate !== undefined) {
    return firstWinterDate;
  }
  // else return null
  return null;
};

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
