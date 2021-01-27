import { PeakListVariants } from '../../../types/graphQLTypes';
import { CoreItem } from '../../../types/itemTypes';
import {
  DateObject,
  getFourSeasonCompletion,
  getGridCompletion,
  getStandardCompletion,
  getWinterCompletion,
} from '../../../utilities/dateUtils';
import {
  failIfValidOrNonExhaustive,
} from '../../../Utils';

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
  item: {id: string};
  field: CoreItem;
  userItems: any[];
}

const getCompletionDates = (input: Input) => {
  const {
    userItems, field, item, type,
  } = input;

  let allDates: VariableDate | null;
  const completedDates = userItems.find(
    (completedMountain) => completedMountain[field] && completedMountain[field].id === item.id);
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
      allDates = null;
      failIfValidOrNonExhaustive(type, 'Invalid list type ' + type);
    }
  } else {
    allDates = null;
  }

  return allDates;
};

export default getCompletionDates;
