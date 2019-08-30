// Errors out at compile time if a discriminating `switch` doesn't catch all cases
// of an enum and at run time if for some reason an invalid enum value is passed.
// See https://basarat.gitbooks.io/typescript/content/docs/types/discriminated-unions.html
export function failIfValidOrNonExhaustive(_variable: never, message: string): never {
  throw new Error(message);
}

export interface DOMMeasurement {
  width: number;
  height: number;
  topOffset: number;
  leftOffset: number;
}

export const overlayPortalContainerId = 'overlayPortalContainerId';

const numberAs2DigitString = (number: number) => {
  if (number < 10) {
    return '0' + number;
  }
  return number.toString();
}

const getMonth = (month: string) => {
  if (month === '') {
    return 'XX';
  }
  const monthInt = parseInt(month);
  if (isNaN(monthInt)) {
    return null;
  }
  if (monthInt > 0 && monthInt < 12) {
    return numberAs2DigitString(monthInt);
  }
  return null;
}

const getYear = (year: string) => {
  if (year === '') {
    return 'XXXX';
  }
  if (year.length !== 4) {
    return null;
  }
  const yearInt = parseInt(year);
  if (isNaN(yearInt)) {
    return null;
  }
  const currentYear = new Date().getFullYear();
  if (yearInt <= currentYear) {
    return yearInt.toString();
  }
  return null;
}

const monthsWith30Days = [9, 4, 6, 11];

const getDay = (day: string, month: number, year: number) => {
  if (day === '') {
    return 'XX';
  }
  const dayInt = parseInt(day);
  if (isNaN(dayInt)) {
    return null;
  }
  if (monthsWith30Days.includes(month)) {
    if (dayInt > 0 && dayInt < 31) {
      return numberAs2DigitString(dayInt);
    }
  } else if (month === 2) {
    if (year % 4 === 0) {
      if (year % 100) {
        if (year % 400) {
          return numberAs2DigitString(dayInt);
        } else {
          return null;
        }
      } else {
        return numberAs2DigitString(dayInt);
      }
    }
  } else {
    if (dayInt > 0 && dayInt < 32) {
      return numberAs2DigitString(dayInt);
    }
  }
  return null;
}

export const convertFieldsToDate = (day: string, month: string, year: string) => {
  // Check if valid month
  const validMonth = getMonth(month);
  // Check if valid year
  const validYear = getYear(year);
  if (validMonth === null || validYear === null) {
    return {error: 'Invalid month or year', date: undefined};
  }
  // Check if valid day for the month and year
  const validDay = getDay(day, parseInt(validMonth), parseInt(validYear));
  if (validDay === null) {
    return {error: 'Invalid day', date: undefined};
  }
  // Ignore time for now, keeping it in in case of need for it later
  // If all valid, return YYYY-MM-DD-HH-MM string. Use X for any part of the date that is empty
  return {error: undefined, date: `${validYear}-${validMonth}-${validDay}-XX-XX`};
}

