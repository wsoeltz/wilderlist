import Excel from 'exceljs';
import sortBy from 'lodash/sortBy';
import {User} from '../../graphql/graphQLTypes';
import {gridElements, months} from './gridElements';

interface RawCompletedMountain {
  mountain: string;
  dates: string[];
}

const getDates = (dates: RawCompletedMountain['dates']) => {
    const parsedDates = dates.map(date => {
      const dateParts = date.split('-');
      const dateAsNumber = parseInt(date.replace(/X/g, '0').split('-').join(''), 10);
      return {
        dateAsNumber,
        year: parseInt(dateParts[0], 10),
        month: parseInt(dateParts[1], 10),
        day: parseInt(dateParts[2], 10),
        hour: parseInt(dateParts[3], 10),
        minute: parseInt(dateParts[4], 10),
      };
    });
    return sortBy(parsedDates, ({dateAsNumber}) => dateAsNumber);
};

const isDateInMonth = (day: number, month: number, year: number, selectedMonth: number) => {
  if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month === selectedMonth  ) {
    return true;
  }
  return false;
};

const getGridCompletion = ({dates}: RawCompletedMountain) => {
  if (dates.length === 0) {
    return {
      jan: undefined,
      feb: undefined,
      mar: undefined,
      apr: undefined,
      may: undefined,
      jun: undefined,
      jul: undefined,
      aug: undefined,
      sep: undefined,
      oct: undefined,
      nov: undefined,
      dec: undefined,
    };
  }
  const sortedDates = getDates(dates);
  return {
    jan: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 1)),
    feb: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 2)),
    mar: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 3)),
    apr: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 4)),
    may: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 5)),
    jun: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 6)),
    jul: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 7)),
    aug: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 8)),
    sep: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 9)),
    oct: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 10)),
    nov: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 11)),
    dec: sortedDates.find(({day, month, year}) => isDateInMonth(day, month, year, 12)),
  };
};

interface DateObject {
  dateAsNumber: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const formatGridDate = (date: DateObject | undefined) => {
  if (date === undefined) {
    return null;
  }
  const { day, month, year } = date;
  if (isNaN(year) && isNaN(month) && isNaN(day)) {
    return null;
  }
  return day + `, '` + year.toString().slice(-2);
};

interface GridData {
  row: number;
  jan: string | null;
  feb: string | null;
  mar: string | null;
  apr: string | null;
  may: string | null;
  jun: string | null;
  jul: string | null;
  aug: string | null;
  sep: string | null;
  oct: string | null;
  nov: string | null;
  dec: string | null;
}

const getCompletionData = (mountains: RawCompletedMountain[], mountain: string, row: number) => {
  const completedDates = mountains.find(
    (mtn) => mtn.mountain && mtn.mountain.toString() === mountain);

  if (completedDates !== undefined) {
    const completedDate = getGridCompletion(completedDates);
    if (completedDate !== null) {
      const {
        jan, feb, mar, apr,
        may, jun, jul, aug, sep,
        oct, nov, dec,
      } = completedDate;
      return {
        row,
        jan: formatGridDate(jan),
        feb: formatGridDate(feb),
        mar: formatGridDate(mar),
        apr: formatGridDate(apr),
        may: formatGridDate(may),
        jun: formatGridDate(jun),
        jul: formatGridDate(jul),
        aug: formatGridDate(aug),
        sep: formatGridDate(sep),
        oct: formatGridDate(oct),
        nov: formatGridDate(nov),
        dec: formatGridDate(dec),
      };
    }
  }
};

const getGridApplication = async (user: User) => {
  try {
    const userMountains = user.mountains as RawCompletedMountain[] | null;
    const completionData: GridData[] = [];
    if (userMountains) {
      gridElements.forEach(mtn => {
        const data = getCompletionData(userMountains, mtn.id.toString(), mtn.row);
        if (data !== undefined) {
          completionData.push(data);
        }
      });
    }
    const path = require('path');
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(
      path.join(__dirname, '../../../../src/server/utilities/getGridApplication/grid-application-new.xlsx'));

    const worksheet = workbook.getWorksheet(2);
    completionData.forEach(d => {
      const row = worksheet.getRow(d.row);
      Object.keys(d).forEach(function(key: keyof GridData) {
        if (key !== 'row' && d[key] !== null) {
          row.getCell(months[key]).value = d[key]; // A5's value set to 5
          row.commit();
        }
      });
    });
    return workbook;
  } catch (err) {
    console.error(err);
  }
};

export default getGridApplication;
