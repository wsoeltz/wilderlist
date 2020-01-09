import { CompletedMountain, PeakListVariants } from '../../../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
} from '../../../Utils';
import {
  DateObject,
  getFourSeasonCompletion,
  getGridCompletion,
  getStandardCompletion,
  getWinterCompletion,
} from '../Utils';
import { MountainDatum } from './PeakListDetail';

export type VariableDate = {
  type: PeakListVariants.standard;
  standard: DateObject | undefined;
} | {
  type: PeakListVariants.winter;
  winter: DateObject | undefined;
} | {
  type: PeakListVariants.fourSeason;
  summer: DateObject | undefined;
  fall: DateObject | undefined;
  winter: DateObject | undefined;
  spring: DateObject | undefined;
} | {
  type: PeakListVariants.grid;
  january: DateObject | undefined;
  february: DateObject | undefined;
  march: DateObject | undefined;
  april: DateObject | undefined;
  may: DateObject | undefined;
  june: DateObject | undefined;
  july: DateObject | undefined;
  august: DateObject | undefined;
  september: DateObject | undefined;
  october: DateObject | undefined;
  november: DateObject | undefined;
  december: DateObject | undefined;
};

interface Input {
  type: PeakListVariants;
  mountain: MountainDatum;
  userMountains: CompletedMountain[];
}

export default (input: Input) => {
  const {
    userMountains, mountain, type,
  } = input;

  let allDates: VariableDate | null;
  const completedDates = userMountains.find(
    (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
  if (completedDates !== undefined) {
    if (type === PeakListVariants.standard) {
      const completedDate = getStandardCompletion(completedDates);
      if (completedDate !== null && completedDate !== undefined) {
        allDates = {type: PeakListVariants.standard, standard: completedDate};
      } else {
        allDates = null;
      }
    } else if (type === PeakListVariants.winter) {
      const completedDate = getWinterCompletion(completedDates);
      if (completedDate !== null && completedDate !== undefined) {
        allDates = {type: PeakListVariants.winter, winter: completedDate};
      } else {
        allDates = null;
      }
    } else if (type === PeakListVariants.fourSeason) {
      const completedDate = getFourSeasonCompletion(completedDates);
      if (completedDate !== null) {
        const {summer, fall, spring, winter} = completedDate;
        allDates = {
          type: PeakListVariants.fourSeason,
          summer, fall, winter, spring,
        };
      } else {
        allDates = null;
      }
    } else if (type === PeakListVariants.grid) {
      const completedDate = getGridCompletion(completedDates);
      if (completedDate !== null) {
        const {
          january, february, march, april,
          may, june, july, august, september,
          october, november, december,
        } = completedDate;
        allDates = {
          type: PeakListVariants.grid,
          january,
          february,
          march,
          april,
          may,
          june,
          july,
          august,
          september,
          october,
          november,
          december,
        };
      } else {
        allDates = null;
      }
    } else {
      failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
      allDates = null;
    }
  } else {
    allDates = null;
  }

  return allDates;
};
