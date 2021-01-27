import { sortBy } from 'lodash';
import { CompletedMountain, PeakListVariants} from '../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
  getSeason,
  Months,
  Seasons,
  states,
} from '../Utils';

export interface DateObject {
  dateAsNumber: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  original: string;
}

export enum DateType {
  full = 'full',
  monthYear = 'monthYear',
  yearOnly = 'yearOnly',
  none = 'none',
}

export const parseDate = (rawDate: string): DateObject => {
  const dateParts = rawDate.split('-');
  const dateAsNumber = parseInt(rawDate.replace(/X/g, '0').split('-').join(''), 10);
  return {
    dateAsNumber,
    year: parseInt(dateParts[0], 10),
    month: parseInt(dateParts[1], 10),
    day: parseInt(dateParts[2], 10),
    hour: parseInt(dateParts[3], 10),
    minute: parseInt(dateParts[4], 10),
    original: rawDate,
  };
};

export const getDates = (dates: CompletedMountain['dates']) => {
    const parsedDates: DateObject[] = dates.map(date => parseDate(date));
    return sortBy(parsedDates, ({dateAsNumber}) => dateAsNumber);
};

export const getDateType = ({day, month, year}: DateObject) => {
  if (day && month && year) {
    return DateType.full;
  } else if (month && year) {
    return DateType.monthYear;
  } else if (year) {
    return DateType.yearOnly;
  } else {
    return DateType.none;
  }
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
  const firstNotNaNDate = sortedDates.find(({day, month, year}) => !isNaN(day) && !isNaN(month) && !isNaN(year));
  if (firstNotNaNDate) {
    return firstNotNaNDate;
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
    return {
      [Seasons.winter]: undefined,
      [Seasons.summer]: undefined,
      [Seasons.fall]: undefined,
      [Seasons.spring]: undefined,
    };
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
    return {
      [Months.january]: undefined,
      [Months.february]: undefined,
      [Months.march]: undefined,
      [Months.april]: undefined,
      [Months.may]: undefined,
      [Months.june]: undefined,
      [Months.july]: undefined,
      [Months.august]: undefined,
      [Months.september]: undefined,
      [Months.october]: undefined,
      [Months.november]: undefined,
      [Months.december]: undefined,
    };
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

export const formatDate = ({ day, month, year }: { day: number, month: number, year: number }) => {
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

export const formatStringDate = (date: string) => {
  const dateParts = date.split('-');
  const dateAsNumber = parseInt(date.replace(/X/g, '0').split('-').join(''), 10);
  const dateObject: DateObject = {
    dateAsNumber,
    year: parseInt(dateParts[0], 10),
    month: parseInt(dateParts[1], 10),
    day: parseInt(dateParts[2], 10),
    hour: parseInt(dateParts[3], 10),
    minute: parseInt(dateParts[4], 10),
    original: date,
  };
  return formatDate(dateObject);
};

export const formatGridDate = (date: DateObject) => {
    const { day, month, year } = date;
  // if year isn't known
    // return 'unknown date'
  // else if just year (or year and day, but no month) is known
    // return just year '2018'
  // else if year && month is known
    // return month and year '3/2018'
  // else if everything is known
    // return full date 3/16/2018
    if (isNaN(year) && isNaN(month) && isNaN(day)) {
    return 'unknown date';
  }
    return day + ', \'' + year.toString().slice(-2);
};

export const completedPeaks = (
  mountains: Array<{id: string}>,
  completedAscents: CompletedMountain[],
  variant: PeakListVariants,
) => {
  if (variant === PeakListVariants.standard) {
    const ascents = mountains.filter(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
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
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
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
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
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
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
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

export const getLatestAscent =  (
  mountains: Array<{id: string}>,
  completedAscents: CompletedMountain[],
  variant: PeakListVariants,
) => {
  const ascents: DateObject[] = [];
  if (variant === PeakListVariants.standard) {
      mountains.forEach(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
      if (dates !== undefined) {
        const dateCompleted = getStandardCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          ascents.push(dateCompleted);
        }
      }
    });
  } else if (variant === PeakListVariants.winter) {
      mountains.forEach(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
      if (dates !== undefined) {
        const dateCompleted = getWinterCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          ascents.push(dateCompleted);
        }
      }
    });
  } else if (variant === PeakListVariants.fourSeason) {
    mountains.forEach(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
      if (dates !== undefined) {
        const dateCompleted = getFourSeasonCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          if (dateCompleted.fall !== undefined) {
            ascents.push(dateCompleted.fall);
          }
          if (dateCompleted.summer !== undefined) {
            ascents.push(dateCompleted.summer);
          }
          if (dateCompleted.spring !== undefined) {
            ascents.push(dateCompleted.spring);
          }
          if (dateCompleted.winter !== undefined) {
            ascents.push(dateCompleted.winter);
          }
        }
      }
    });
  } else if (variant === PeakListVariants.grid) {
    mountains.forEach(mountain => {
      const dates = completedAscents.find(
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
      if (dates !== undefined) {
        const dateCompleted = getGridCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          if (dateCompleted.january !== undefined) {
            ascents.push(dateCompleted.january);
          }
          if (dateCompleted.february !== undefined) {
            ascents.push(dateCompleted.february);
          }
          if (dateCompleted.march !== undefined) {
            ascents.push(dateCompleted.march);
          }
          if (dateCompleted.april !== undefined) {
            ascents.push(dateCompleted.april);
          }
          if (dateCompleted.may !== undefined) {
            ascents.push(dateCompleted.may);
          }
          if (dateCompleted.june !== undefined) {
            ascents.push(dateCompleted.june);
          }
          if (dateCompleted.july !== undefined) {
            ascents.push(dateCompleted.july);
          }
          if (dateCompleted.august !== undefined) {
            ascents.push(dateCompleted.august);
          }
          if (dateCompleted.september !== undefined) {
            ascents.push(dateCompleted.september);
          }
          if (dateCompleted.october !== undefined) {
            ascents.push(dateCompleted.october);
          }
          if (dateCompleted.november !== undefined) {
            ascents.push(dateCompleted.november);
          }
          if (dateCompleted.december !== undefined) {
            ascents.push(dateCompleted.december);
          }
        }
      }
    });
  }

  const sortedAscents = sortBy(ascents, ['dateAsNumber']);
  return sortedAscents[sortedAscents.length - 1];
};

export const isState = (value: any) => {
  if (typeof value !== 'string') {
    return false;
  } else {
    return states.includes(value.toLowerCase());
  }
};

export const getType = (type: PeakListVariants) => {
  if (type === PeakListVariants.standard) {
    return '';
  } else if (type === PeakListVariants.winter) {
    return ' - Winter';
  } else if (type === PeakListVariants.fourSeason) {
    return ' - 4-Season';
  } else if (type === PeakListVariants.grid) {
    return ' - Grid';
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid PeakListVariants ' + type);
  }
};
