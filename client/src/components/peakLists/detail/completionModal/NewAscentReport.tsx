import React from 'react';
import MountainCompletionModal, {
  Props,
  DateType,
} from './MountainCompletionModal';

const NewAscentReport = (props: Props) => {
  return (
    <MountainCompletionModal
      {...props}
      initialCompletionDay={''}
      initialCompletionMonth={''}
      initialCompletionYear={''}
      initialStartDate={null}
      initialDateType={DateType.full}
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
    />
  );
}

export default NewAscentReport;