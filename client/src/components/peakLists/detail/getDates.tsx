import React from 'react';
import styled from 'styled-components/macro';
import {
  addTripReportLink,
} from '../../../routing/Utils';
import {successColor} from '../../../styling/styleUtils';
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
  formatDate,
  formatGridDate,
} from '../../../utilities/dateUtils';
import {
  failIfValidOrNonExhaustive,
} from '../../../Utils';
import {
  Months,
  Seasons,
} from '../../../Utils';
import {KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import LogTripButton from './LogTripButton';

const Completed = styled.strong`
  color: ${successColor};
`;

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

interface BaseInput {
  type: PeakListVariants;
  item: {id: string};
  field: CoreItem;
  userItems: any[];
}

const getCompletionDates = (input: BaseInput) => {
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

interface Input extends BaseInput {
  completionFieldKeys: KeySortPair[];
  stringDateFields: KeySortPair[];
}

interface Output {
  dates: {[key: string]: string | number | React.ReactElement<any>};
  completedCount: number;
}

const getDates = (input: Input): Output => {
  const {completionFieldKeys, stringDateFields} = input;
  const dateObjects = getCompletionDates(input);
  const dates: {[key: string]: string | number | React.ReactElement<any>} = {};
  let completedCount = 0;
  if (dateObjects !== null) {
    const format = dateObjects.type === PeakListVariants.grid ? formatGridDate : formatDate;
    if (dateObjects.type === PeakListVariants.standard || dateObjects.type === PeakListVariants.winter) {
      // @ts-expect-error: value can be used to index object
      if (dateObjects[dateObjects.type]) {
        // @ts-expect-error: value can be used to index object
        const stringDate = format(dateObjects[dateObjects.type]);
        dates.hikedDisplayValue = <Completed>{stringDate}</Completed>;
        dates.hikedStringValue = stringDate;
        // @ts-expect-error: value can be used to index object
        dates.hikedSortValue = dateObjects[dateObjects.type].dateAsNumber;
        completedCount = 1;
      } else {
        dates.hikedDisplayValue = (
          <LogTripButton
            to={addTripReportLink({
              refpath: window.location.pathname,
              [input.field + 's']: [input.item.id],
              listtype: input.type,
            })}
          />
        );
        dates.hikedSortValue = 0;
        dates.hikedStringValue = '';
      }
    } else {
      for (const key in dateObjects) {
        if (dateObjects.hasOwnProperty(key)) {
          // @ts-expect-error: value can be used to index object
          if (dateObjects[key] && typeof dateObjects[key] !== 'string') {
            // @ts-expect-error: value can be used to index object
            const stringDate = format(dateObjects[key]);
            dates[key + 'DisplayValue'] = <Completed>{stringDate}</Completed>;
            // @ts-expect-error: value can be used to index object
            dates[key + 'SortValue'] = dateObjects[key].dateAsNumber;
            dates[key + 'StringValue'] = stringDate;
            completedCount++;
          } else {
            dates[key + 'DisplayValue'] = (
              <LogTripButton
                to={addTripReportLink({
                  refpath: window.location.pathname,
                  [input.field + 's']: [input.item.id],
                  listtype: input.type,
                  month: key as Months,
                  season: key as Seasons,
                })}
              />
            );
            dates[key + 'SortValue'] = 0;
            dates[key + 'StringValue'] = '';
          }
        }
      }
    }
  } else {
    completionFieldKeys.forEach(({displayKey, sortKey}) => {
      dates[displayKey] = (
        <LogTripButton
          to={addTripReportLink({
            refpath: window.location.pathname,
            [input.field + 's']: [input.item.id],
            listtype: input.type,
            month: displayKey.replace('DisplayValue', '') as Months,
            season: displayKey.replace('DisplayValue', '') as Seasons,
          })}
        />
      );
      dates[sortKey as string] = 0;
    });
    stringDateFields.forEach(({displayKey}) => {
      dates[displayKey as string] = '';
    });
  }

  return {dates, completedCount};
};

export default getDates;
