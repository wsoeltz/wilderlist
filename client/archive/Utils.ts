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

// https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index++) {
    try {
      await callback(array[index], index, array);
    } catch (err) {
      console.error(err);
    }
  }
}

export const mediumSize = 1150; // in px
export const mobileSize = 810; // in px

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
  fall = 'fall',
  winter = 'winter',
  spring = 'spring',
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

export const getMonthIndex = (month: Months) => {
  if (month === Months.january) {
    return 1;
  } else if (month === Months.february) {
    return 2;
  } else if (month === Months.march) {
    return 3;
  } else if (month === Months.april) {
    return 4;
  } else if (month === Months.may) {
    return 5;
  } else if (month === Months.june) {
    return 6;
  } else if (month === Months.july) {
    return 7;
  } else if (month === Months.august) {
    return 8;
  } else if (month === Months.september) {
    return 9;
  } else if (month === Months.october) {
    return 10;
     } else if (month === Months.november) {
    return 11;
     } else if (month === Months.december) {
    return 12;
     } else {
    return 0;
  }
};

interface SeasonStartDates {
  firstDayOfSummer: string;
  firstDayOfFall: string;
  firstDayOfWinter: string;
  firstDayOfSpring: string;
}

export const getSolsticeAndEquinox = (year: number) => {
  return getSolsticeAndEquinoxUtility(year) as SeasonStartDates;
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

export const states = [
  'alabama',
  'alaska',
  'arizona',
  'arkansas',
  'california',
  'colorado',
  'connecticut',
  'delaware',
  'florida',
  'georgia',
  'hawaii',
  'idaho',
  'illinois',
  'indiana',
  'iowa',
  'kansas',
  'kentucky',
  'louisiana',
  'maine',
  'maryland',
  'massachusetts',
  'michigan',
  'minnesota',
  'mississippi',
  'missouri',
  'montana',
  'nebraska',
  'nevada',
  'new hampshire',
  'new jersey',
  'new mexico',
  'new york',
  'north carolina',
  'north dakota',
  'ohio',
  'oklahoma',
  'oregon',
  'pennsylvania',
  'rhode island',
  'south carolina',
  'south dakota',
  'tennessee',
  'texas',
  'utah',
  'vermont',
  'virginia',
  'washington',
  'west virginia',
  'wisconsin',
  'wyoming',
];

export const roundPercentToSingleDecimal = (numerator: number, denominator: number) => {
  return Math.round((100 * (numerator / denominator)) * 10) / 10;
};

/* distance formula from
https://stackoverflow.com/
questions/18883601/function-to-calculate-distance-between-two-coordinates
*/
interface DistanceInput {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}

const deg2rad = (deg: number) => deg * (Math.PI / 180);

const getDistanceFromLatLonInKm = ({lat1, lon1, lat2, lon2}: DistanceInput) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const getDistanceFromLatLonInMiles = (input: DistanceInput) =>
  getDistanceFromLatLonInKm(input) * 0.62137;

export const isValidURL = (link: string) => {
  const urlRegex = new RegExp(/^(http|https)(:\/\/)?[\w.-]+(?:.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/, 'i');
  return urlRegex.test(link);
};

export const latLonKey = ({lat, lon}: {lat: number, lon: number}) => lat.toString() + lon.toString();

// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
export function isTouchDevice() {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = function(q: string) {
    return window.matchMedia(q).matches;
  };
  if (('ontouchstart' in window) ||
      ((window as any).DocumentTouch && document instanceof (window as any).DocumentTouch)) {
    return true;
  }
  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}
