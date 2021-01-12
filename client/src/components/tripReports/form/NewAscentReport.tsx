import React from 'react';
import { DateType } from '../../../utilities/dateUtils';
import TripReportForm, {
  preferredDateFormatLocalStorageVariable,
  Props as BaseProps,
} from './TripReportForm';

type Props = BaseProps & {
  queryRefetchArray?: Array<{query: any, variables: any}>,
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

  const refetchQuery = queryRefetchArray
    ? [...queryRefetchArray] : undefined;
  return (
    <TripReportForm
      {...rest}
      tripReportId={undefined}
      refetchQuery={refetchQuery}
      initialCompletionDay={null}
      initialCompletionMonth={null}
      initialCompletionYear={null}
      initialStartDate={null}
      initialDateType={initialDateType}
      initialUserList={[]}
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
    />
  );
};

export default NewAscentReport;
