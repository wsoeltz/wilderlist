import React from 'react';
import {getRefetchSearchQueries} from '../../list';
import { DateType } from '../../Utils';
import MountainCompletionModal, {
  preferredDateFormatLocalStorageVariable,
  Props as BaseProps,
} from './MountainCompletionModal';

type Props = BaseProps & {
  queryRefetchArray?: Array<{query: any, variables: any}>,
};

const NewAscentReport = (props: Props) => {
  const {queryRefetchArray, ...rest} = props;

  const baseRefetchSearchQueries = getRefetchSearchQueries(props.userId);

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
    ? [...queryRefetchArray, ...baseRefetchSearchQueries] : [...baseRefetchSearchQueries];
  return (
    <MountainCompletionModal
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