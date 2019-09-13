import {
  getSeasonUtility,
  getSolsticeAndEquinoxUtility,
} from './utilities/getSeason';
// Errors out at compile time if a discriminating `switch` doesn't catch all cases
// of an enum and at run time if for some reason an invalid enum value is passed.
// See https://basarat.gitbooks.io/typescript/content/docs/types/discriminated-unions.html
export function failIfValidOrNonExhaustive(_variable: never, message: string): never {
  throw new Error(message);
}

export const mobileSize = 1150; // in px

export const overlayPortalContainerId = 'overlayPortalContainerId';

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

export const convertFieldsToDate = (day: string, month: string, year: string) => {
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

export const formatNumberWithCommas = (num: number) => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

export enum Months {
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

export enum Seasons {
  summer = 'summer',
  spring = 'spring',
  winter = 'winter',
  fall = 'fall',
}

export const getSeason = (year: number, month: number, day: number): Seasons | undefined => {
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

export const getSolsticeAndEquinox = (year: number) => {
  return getSolsticeAndEquinoxUtility(year);
};

function toDegreesMinutesAndSeconds(coordinate: number) {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return `${degrees}° ${minutes}' ${seconds}"`;
}

export const convertDMS = (lat: number, lng: number) => {
    const latitude = toDegreesMinutesAndSeconds(lat);
    const latitudeCardinal = lat >= 0 ? 'N' : 'S';

    const longitude = toDegreesMinutesAndSeconds(lng);
    const longitudeCardinal = lng >= 0 ? 'E' : 'W';

    return { lat: `${latitude} ${latitudeCardinal}`, long: `${longitude} ${longitudeCardinal}`};
};

export const getBrowser = () => {
  const { userAgent } = navigator;
  let tem;
  let M = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if ( /trident/i.test(M[1]) ) {
    tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
    return { browser: 'IE', version: parseFloat(`${(tem[1] || '')}`) };
  }
  if ( M[1] === 'Chrome' ) {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem !== null) {
        return { browser: tem[1], version: parseFloat(tem[2]) };
      }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  tem = userAgent.match(/version\/(\d+)/i);
  if ( tem !== null) { M.splice(1, 1, tem[1]); }
  return { browser: M[0], version: parseFloat(M[1]) };
};
