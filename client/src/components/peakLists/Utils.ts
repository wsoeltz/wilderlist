import { sortBy } from 'lodash';
import { CompletedMountain, PeakListVariants} from '../../types/graphQLTypes';
import { getSeason, Months, Seasons } from '../../Utils';
import { failIfValidOrNonExhaustive } from '../../Utils';
import { MountainList } from './list/PeakListCard';

export interface DateObject {
  dateAsNumber: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export const getDates = (dates: CompletedMountain['dates']) => {
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

const isDateInSeason = (day: number, month: number, year: number, season: Seasons) => {
  if (!isNaN(day) && !isNaN(month) && !isNaN(year) ) {
    if (getSeason(year, month, day) !== season) {
      return false;
    }
    return true;
  }
  return false;
};

const isDateInMonth = (day: number, month: number, year: number, selectedMonth: number) => {
  if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month === selectedMonth  ) {
    return true;
  }
  return false;
};

export const getStandardCompletion = ({dates}: CompletedMountain) => {
  if (dates.length === 0) {
    return null;
  }
  // first check for earliest date that is !NaN
  // if doesn't exist, return first date
  const sortedDates = getDates(dates);
  const firstNaNDate = sortedDates.find(({day, month, year}) => !isNaN(day) && !isNaN(month) && !isNaN(year));
  if (firstNaNDate) {
    return firstNaNDate;
  }
  return sortedDates[0];
};

export const getWinterCompletion = ({dates}: CompletedMountain) => {
  if (dates.length === 0) {
    return null;
  }
  // get fist date that is in the winter
  const sortedDates = getDates(dates);
  const firstWinterDate = sortedDates.find(({day, month, year}) => isDateInSeason(day, month, year, Seasons.winter));
  if (firstWinterDate !== undefined) {
    return firstWinterDate;
  }
  // else return null
  return null;
};

export const getFourSeasonCompletion = ({dates}: CompletedMountain) => {
  if (dates.length === 0) {
    return null;
  }
  const sortedDates = getDates(dates);
  return {
    [Seasons.winter]: sortedDates.find(({day, month, year}) => isDateInSeason(day, month, year, Seasons.winter)),
    [Seasons.summer]: sortedDates.find(({day, month, year}) => isDateInSeason(day, month, year, Seasons.summer)),
    [Seasons.fall]: sortedDates.find(({day, month, year}) => isDateInSeason(day, month, year, Seasons.fall)),
    [Seasons.spring]: sortedDates.find(({day, month, year}) => isDateInSeason(day, month, year, Seasons.spring)),
  };
};

export const getGridCompletion = ({dates}: CompletedMountain) => {
    if (dates.length === 0) {
    return null;
  }
    const sortedDates = getDates(dates);
    return {
    [Months.january]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 1)),
    [Months.february]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 2)),
    [Months.march]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 3)),
    [Months.april]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 4)),
    [Months.may]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 5)),
    [Months.june]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 6)),
    [Months.july]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 7)),
    [Months.august]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 8)),
    [Months.september]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 9)),
    [Months.october]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 10)),
    [Months.november]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 11)),
    [Months.december]: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 12)),
  };
};

export const formatDate = (date: DateObject) => {
  const { day, month, year } = date;
  // if year isn't known
    // return 'unknown date'
  // else if just year (or year and day, but no month) is known
    // return just year '2018'
  // else if year && month is known
    // return month and year '3/2018'
  // else if everything is known
    // return full date 3/16/2018
  if (isNaN(year)) {
    return 'unknown date';
  }
  if (isNaN(month)) {
    return year.toString();
  }
  if (isNaN(day)) {
    return month + '/' + year;
  }
  return month + '/' + day + '/' + year;
};

export const completedPeaks = (
  mountains: MountainList[],
  completedAscents: CompletedMountain[],
  variant: PeakListVariants,
) => {
  if (variant === PeakListVariants.standard) {
    const ascents = mountains.filter(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain.id === mountain.id);
      if (dates !== undefined) {
        const dateCompleted = getStandardCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          return true;
        }
      }
      return false;
    });
    return ascents.length;
  } else if (variant === PeakListVariants.winter) {
    const ascents = mountains.filter(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain.id === mountain.id);
      if (dates !== undefined) {
        const dateCompleted = getWinterCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          return true;
        }
      }
      return false;
    });
    return ascents.length;
  } else if (variant === PeakListVariants.fourSeason) {
    let numAscents: number = 0;
    mountains.forEach(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain.id === mountain.id);
      if (dates !== undefined) {
        const dateCompleted = getFourSeasonCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          if (dateCompleted[Seasons.fall] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Seasons.summer] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Seasons.spring] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Seasons.winter] !== undefined) {
            numAscents += 1;
          }
        }
      }
    });
    return numAscents;
  } else if (variant === PeakListVariants.grid) {

    let numAscents: number = 0;
    mountains.forEach(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain.id === mountain.id);
      if (dates !== undefined) {
        const dateCompleted = getGridCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          if (dateCompleted[Months.january] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.february] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.march] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.april] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.may] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.june] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.july] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.august] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.september] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.october] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.november] !== undefined) {
            numAscents += 1;
          }
          if (dateCompleted[Months.december] !== undefined) {
            numAscents += 1;
          }
        }
      }
    });
    return numAscents;
  } else {
    failIfValidOrNonExhaustive(variant, 'Invalid list type ' + variant);
  }
};
