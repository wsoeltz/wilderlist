import React from 'react';
import {TripReportPrivacy} from '../../../types/graphQLTypes';
import { DateType, getDates } from '../../../utilities/dateUtils';
import TripReportForm, {
  Origin,
  preferredDateFormatLocalStorageVariable,
  Props as BaseProps,
} from './TripReportForm';

type Props = BaseProps & {
  queryRefetchArray?: Array<{query: any, variables: any}>,
  date?: string;
  initialUserList: string[];
};

const NewAscentReport = (props: Props) => {
  const {queryRefetchArray, ...rest} = props;

  const localStorageDateType = localStorage.getItem(preferredDateFormatLocalStorageVariable);
  let initialDateType: DateType;
  if (localStorageDateType === DateType.full) {
    initialDateType = DateType.full;
  } else if (localStorageDateType === DateType.monthYear) {
    initialDateType = DateType.monthYear;
  } else if (localStorageDateType === DateType.yearOnly) {
    initialDateType = DateType.yearOnly;
  } else if (localStorageDateType === DateType.none) {
    initialDateType = DateType.none;
  } else {
    initialDateType = DateType.full;
  }

  const date = props.date ? getDates([props.date]).pop() : undefined;

  const initialCompletionDay = date && !isNaN(date.day) ? date.day.toString() : null;
  const initialCompletionMonth = date && !isNaN(date.month) ? date.month.toString() : null;
  const initialCompletionYear = date && !isNaN(date.year) ? date.year.toString() : null;

  const initialStartDate = date && date.year && date.month && date.month && date.day
    ? new Date(date.year, date.month - 1, date.day) : null;

  const refetchQuery = queryRefetchArray
    ? [...queryRefetchArray] : undefined;
  return (
    <TripReportForm
      {...rest}
      key={initialStartDate as any}
      origin={Origin.add}
      tripReportId={undefined}
      refetchQuery={refetchQuery}
      initialCompletionDay={initialCompletionDay}
      initialCompletionMonth={initialCompletionMonth}
      initialCompletionYear={initialCompletionYear}
      initialStartDate={initialStartDate}
      initialDateType={initialDateType}
      initialConditions={{
        mudMinor: false,
        mudMajor: false,
        waterSlipperyRocks: false,
        waterOnTrail: false,
        leavesSlippery: false,
        iceBlack: false,
        iceBlue: false,
        iceCrust: false,
        snowIceFrozenGranular: false,
        snowIceMonorailStable: false,
        snowIceMonorailUnstable: false,
        snowIcePostholes: false,
        snowMinor: false,
        snowPackedPowder: false,
        snowUnpackedPowder: false,
        snowDrifts: false,
        snowSticky: false,
        snowSlush: false,
        obstaclesBlowdown: false,
        obstaclesOther: false,
      }}
      initialTripNotes={''}
      initialLink={''}
      initialPrivacy={TripReportPrivacy.Public}
    />
  );
};

export default NewAscentReport;
