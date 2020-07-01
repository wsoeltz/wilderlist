/* tslint:disable:await-promise */
import sortBy from 'lodash/sortBy';
import mongoose from 'mongoose';
import { PeakListVariants, Region, State } from './graphQLTypes';

export async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index++) {
    try {
      await callback(array[index], index, array);
    } catch (err) {
      console.error(err);
    }
  }
}

type Models = typeof mongoose.Model;

export const removeConnections = (
  PrimaryModel: Models, id: string, connectedField: string, SecondaryModel: Models, othersConnectField: string,
  ) => {
  return new Promise((resolve, reject) => {
    PrimaryModel.findById(id)
      .select({[connectedField]: true})
      .exec(async function(err: any, doc: any) {
        if (err) {
          console.error(err);
        } else if (doc) {
          try {
            await asyncForEach(doc[connectedField], async (itemId: string) => {
              await SecondaryModel.findByIdAndUpdate(itemId, {
                $pull: { [othersConnectField]: id},
              });
            });
            resolve(true);
          } catch (err) {
            reject(err);
          }
        }
    });
  });
};

// Errors out at compile time if a discriminating `switch` doesn't catch all cases
// of an enum and at run time if for some reason an invalid enum value is passed.
// See https://basarat.gitbooks.io/typescript/content/docs/types/discriminated-unions.html
export function failIfValidOrNonExhaustive(_variable: never, message: string): never {
  throw new Error(message);
}

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
    return '';
  }
};

interface DateObject {
  dateAsNumber: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const formatDate = ({ day, month, year }: { day: number, month: number, year: number }) => {
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
  const dateAsNumber = parseInt(
        dateParts[0]
        + dateParts[1].replace(/X/g, '0')
        + dateParts[2].replace(/X/g, '0')
        + dateParts[3].replace(/X/g, '0'),
        10);
  const dateObject: DateObject = {
    dateAsNumber,
    year: parseInt(dateParts[0], 10),
    month: parseInt(dateParts[1], 10),
    day: parseInt(dateParts[2], 10),
    hour: parseInt(dateParts[3], 10),
    minute: parseInt(dateParts[4], 10),
  };
  return formatDate(dateObject);
};

export interface RawStateDatum {
  _id: State['id'];
  name: State['name'];
  regions: Array<Region['id']>;
}

export interface RawRegionDatum {
  _id: State['id'];
  name: State['name'];
  states: Array<State['id']>;
}

export const getStatesOrRegion = async (statesArray: RawStateDatum[], regionLoader: any, id: string) => {
  const nonNullStates = statesArray.filter(state => state !== null && state !== undefined);
  const sortedStates = sortBy(nonNullStates, ['name']);
  // If there are 3 or less states, just show the states
  if (sortedStates.length === 1) {
    return sortedStates[0].name;
  } else if (sortedStates.length === 2) {
    return sortedStates[0].name + ' & ' + sortedStates[1].name;
  } else if (sortedStates.length === 3) {
    return sortedStates[0].name + ', ' + sortedStates[1].name + ' & ' + sortedStates[2].name;
  } else if (sortedStates.length > 2) {
    const regionsArray: Array<Region['id']> = [];
    sortedStates.forEach(({regions}) =>
      regions.forEach(
        r1 => {
          if (!regionsArray.find(r2 => r1.toString() === r2.toString())) {
            regionsArray.push(r1);
          }
      }),
    );
    if (regionsArray.length) {
      try {
        const regionsData: Array<RawRegionDatum | null | undefined> | undefined
          = await regionLoader.loadMany(regionsArray);
        if (regionsData) {
          const nonNullRegions
            = regionsData.filter(region => region !== null && region !== undefined) as RawRegionDatum[];
                // Else if they all belong to the same region, show that region
          if (nonNullRegions.length === 0) {
            return null;
          } else if (nonNullRegions.length === 1) {
            return nonNullRegions[0].name;
          } else {
            const inclusiveRegions = nonNullRegions.filter(
              (region) => sortedStates.every(
                ({regions}) => regions.find(_region => _region && region._id.toString() === _region.toString())));
            if (inclusiveRegions.length === 1) {
              return inclusiveRegions[0].name;
            } else if (nonNullRegions.length > 1) {
              // If they all belong to more than one region, show the more exclusive one
              const exclusiveRegions = sortBy(inclusiveRegions, ({states}) => states.length );
              if (exclusiveRegions && exclusiveRegions[0]) {
                return exclusiveRegions[0].name;
              }
            } else if (inclusiveRegions.length === 0) {
              // if there are no inclusive regions
              if (nonNullRegions.length === 2) {
                // if only 2 regions, show them both
                return nonNullRegions[0].name + ' & ' + nonNullRegions[1].name;
              } else if (nonNullRegions.length === 3) {
                // if only 3 regions, show them all
                return nonNullRegions[0].name + ', ' + nonNullRegions[1].name + ' & ' + nonNullRegions[2].name;
              } else {
                // otherwise just say Across the US
                return 'Across the US';
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }
  // Else list all the regions
  return null;
};
