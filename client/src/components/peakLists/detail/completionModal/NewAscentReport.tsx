import React from 'react';
import MountainCompletionModal, {
  DateType,
  Props,
} from './MountainCompletionModal';

const NewAscentReport = (props: Props) => {
  return (
    <MountainCompletionModal
      {...props}
      tripReportId={undefined}
      initialCompletionDay={null}
      initialCompletionMonth={null}
      initialCompletionYear={null}
      initialStartDate={null}
      initialDateType={DateType.full}
      initialUserList={[]}
      initialMountainList={[]}
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
