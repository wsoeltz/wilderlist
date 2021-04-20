import sortBy from 'lodash/sortBy';
import { PeakListVariants } from '../graphql/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../graphql/Utils';
import { getSeasonUtility } from './getSeason';

interface DateObject {
  dateAsNumber: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  original: string;
}

enum Months {
  january = 'january',
  february = 'february',
  march = 'march',
  april = 'april',
  may = 'may',
  june = 'june',
  july = 'july',
  august = 'august',
  september = 'september',
  october = 'october',
  november = 'november',
  december = 'december',
}

enum Seasons {
  summer = 'summer',
  spring = 'spring',
  winter = 'winter',
  fall = 'fall',
}

export interface RawCompletedMountain {
  mountain: string;
  dates: string[];
}
export interface RawCompletedTrail {
  trail: string;
  dates: string[];
}
export interface RawCompletedCampsite {
  campsite: string;
  dates: string[];
}

const numberAs2DigitString = (num: number) => {
  if (num < 10) {
    return '0' + num;
  }
  return num.toString();
};

const getMonth = (month: string) => {
  if (month === '') {
    return 'XX';
  }
  const monthInt = parseInt(month, 10);
  if (isNaN(monthInt)) {
    return null;
  }
  if (monthInt > 0 && monthInt < 13) {
    return numberAs2DigitString(monthInt);
  }
  return null;
};

const getYear = (year: string) => {
  if (year === '') {
    return 'XXXX';
  }
  if (year.length !== 4) {
    return null;
  }
  const yearInt = parseInt(year, 10);
  if (isNaN(yearInt)) {
    return null;
  }
  const currentYear = new Date().getFullYear();
  if (yearInt <= currentYear) {
    return yearInt.toString();
  }
  return null;
};

const isLeapYear = (year: number) => {
  // is leapyear, return true
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      if (year % 400 === 0) {
        return true;
      }
    } else {
      return true;
    }
  }
  // is not leapyear return false
  return false;
};

const monthsWith30Days = [9, 4, 6, 11];

const getDay = (day: string, month: number, year: number) => {
  if (day === '') {
    return {error: undefined, day: 'XX'};
  }
  let error: string;
  const dayInt = parseInt(day, 10);
  if (isNaN(dayInt)) {
    return {error: 'Day must be a number', day: undefined};
  }
  if (monthsWith30Days.includes(month)) {
    if (dayInt > 0 && dayInt < 31) {
      return {error: undefined, day: numberAs2DigitString(dayInt)};
    }
    error = 'Day must be a number between 1 and 30';
  } else if (month === 2) {
    if (isLeapYear(year)) {
      if (dayInt > 0 && dayInt < 30) {
        return {error: undefined, day: numberAs2DigitString(dayInt)};
      }
      error = 'Day must be a number between 1 and 29';
    } else if (dayInt > 0 && dayInt < 29) {
      return {error: undefined, day: numberAs2DigitString(dayInt)};
    } else {
      error = 'Day must be a number between 1 and 28';
    }
  } else {
    if (dayInt > 0 && dayInt < 32) {
      return {error: undefined, day: numberAs2DigitString(dayInt)};
    }
    error = 'Day must be a number between 1 and 31';
  }
  return {error, day: undefined};
};

const convertFieldsToDate = (day: string, month: string, year: string) => {
  // Check if valid year
  const validYear = getYear(year);
  if (validYear === null) {
    return {error: 'Please enter a valid year', date: undefined};
  }
  // Check if valid month
  const validMonth = getMonth(month);
  if (validMonth === null) {
    return {error: 'Please enter a valid month', date: undefined};
  }
  // Check if valid day for the month and year
  const {error, day: validDay} = getDay(day, parseInt(validMonth, 10), parseInt(validYear, 10));
  if (error !== undefined) {
    return {error, date: undefined};
  }
  // Ignore time for now, keeping it in in case of need for it later
  // If all valid, return YYYY-MM-DD-HH-MM string. Use X for any part of the date that is empty
  return {error: undefined, date: `${validYear}-${validMonth}-${validDay}-XX-XX`};
};

const getSeason = (year: number, month: number, day: number): Seasons | undefined => {
  const season = getSeasonUtility(year, month, day);
  if (season === 'summer') {
    return Seasons.summer;
  }
  if (season === 'spring') {
    return Seasons.spring;
  }
  if (season === 'winter') {
    return Seasons.winter;
  }
  if (season === 'fall') {
    return Seasons.fall;
  }
  return undefined;
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

const getDates = (dates: RawCompletedMountain['dates']) => {
    const parsedDates: DateObject[] = dates.map(date => {
      const dateParts = date.split('-');
      const dateAsNumber = parseInt(date.replace(/X/g, '0').split('-').join(''), 10);
      return {
        dateAsNumber,
        year: parseInt(dateParts[0], 10),
        month: parseInt(dateParts[1], 10),
        day: parseInt(dateParts[2], 10),
        hour: parseInt(dateParts[3], 10),
        minute: parseInt(dateParts[4], 10),
        original: date,
      };
    });
    return sortBy(parsedDates, ({dateAsNumber}) => dateAsNumber);
};

const getStandardCompletion = ({dates}: RawCompletedMountain) => {
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

const getWinterCompletion = ({dates}: RawCompletedMountain) => {
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

const getFourSeasonCompletion = ({dates}: RawCompletedMountain) => {
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

const getGridCompletion = ({dates}: RawCompletedMountain) => {
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

export const completedPeaks = (
  items: string[],
  completedTrips: any[],
  variant: PeakListVariants,
  field: 'mountain' | 'trail' | 'campsite',
) => {
  if (variant === PeakListVariants.standard) {
    const ascents = items.filter(item => {
      const dates = completedTrips.find(
        (trip) => trip[field] && trip[field] === item);
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
    const ascents = items.filter(item => {
      const dates = completedTrips.find(
        (trip) => trip[field] && trip[field] === item);
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
    items.forEach(item => {
      const dates = completedTrips.find(
        (trip) => trip[field] && trip[field] === item);
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
    items.forEach(item => {
      const dates = completedTrips.find(
        (trip) => trip[field] && trip[field] === item);
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
  items: string[],
  completedTrips: any[],
  variant: PeakListVariants,
  field: 'mountain' | 'trail' | 'campsite' | 'any',
) => {
  const ascents: DateObject[] = [];
  if (variant === PeakListVariants.standard) {
      items.forEach(item => {
      const dates = completedTrips.find(
        (trip) => trip[field] && trip[field] === item);
      if (dates !== undefined) {
        const dateCompleted = getStandardCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          ascents.push(dateCompleted);
        }
      }
    });
  } else if (variant === PeakListVariants.winter) {
      items.forEach(item => {
      const dates = completedTrips.find(
        (trip) => trip[field] && trip[field] === item);
      if (dates !== undefined) {
        const dateCompleted = getWinterCompletion(dates);
        if (dateCompleted !== null && dateCompleted !== undefined) {
          ascents.push(dateCompleted);
        }
      }
    });
  } else if (variant === PeakListVariants.fourSeason) {
    items.forEach(item => {
      const dates = completedTrips.find(
        (trip) => trip[field] && trip[field] === item);
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
    items.forEach(item => {
      const dates = completedTrips.find(
        (trip) => trip[field] && trip[field] === item);
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

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
type DateWithMountainId = DateObject & { mountain: string };

export const getLatestOverallAscent = (mountains: RawCompletedMountain[]) => {
  if (mountains.length === 0) {
    return null;
  }
  const mountainList = mountains.map(({mountain}) => {
    if (mountain) {
      return mountain;
    } else {
      return null;
    }
  });
  const filteredMountainList = mountainList.filter(notEmpty);
  const ascents: DateWithMountainId[] = [];
  filteredMountainList.forEach(id => {
    const dates = mountains.find(
      ({mountain}) => mountain && mountain === id);
    if (dates !== undefined) {
      const datesCompleted = getDates(dates.dates);
      const dateCompleted = datesCompleted[datesCompleted.length - 1];
      if (dateCompleted !== null && dateCompleted !== undefined && dates.mountain) {
        ascents.push({mountain: dates.mountain, ...dateCompleted});
      }
    }
  });
  if (ascents.length) {
    const sortedAscents = sortBy(ascents, ['dateAsNumber']).reverse();
    const {mountain, ...dateObj} = sortedAscents[0];
    const day = isNaN(dateObj.day) ? '' : dateObj.day.toString();
    const month = isNaN(dateObj.month) ? '' : dateObj.month.toString();
    const year = isNaN(dateObj.year) ? '' : dateObj.year.toString();
    const { date } = convertFieldsToDate(day, month, year);
    if (date !== undefined) {
      const latestMountain: RawCompletedMountain = {mountain, dates: [date]};
      return latestMountain;
    }
  }
  return null;
};
