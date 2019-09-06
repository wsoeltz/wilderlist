import React from 'react';
import { PeakListVariants } from '../../types/graphQLTypes';
import {
  MountainDatum,
} from '../peakListDetail';
import {
  MountainColumnTitleName,
  Root,
  TitleCell,
} from '../peakListDetail/MountainTable';
import ComparisonRow from './ComparisonRow';
import { UserDatum } from './index';
import {
  getFourSeasonCompletion,
  getGridCompletion,
  getStandardCompletion,
  getWinterCompletion,
} from '../peakLists/Utils';

const gridColumns = {
  friendColumn: 2,
  meColumn: 3,
};

type BasicAscentGoal = {
  goal: false;
} | {
  goal: true;
  completed: string | undefined;
}

type FourSeasonAscentGoal = {
  goal: false;
} | {
  goal: true;
  summer: string | undefined;
  fall: string | undefined;
  winter: string | undefined;
  spring: string | undefined;
}

type GridAscentGoal = {
  goal: false;
} | {
  goal: true;
  january: string | undefined;
  february: string | undefined;
  march: string | undefined;
  april: string | undefined;
  may: string | undefined;
  june: string | undefined;
  july: string | undefined;
  august: string | undefined;
  september: string | undefined;
  october: string | undefined;
  november: string | undefined;
  december: string | undefined;
}

interface AscentGoals {
  mountain: {
    id: string;
  }
  standard: BasicAscentGoal;
  winter: BasicAscentGoal;
  fourSeason: FourSeasonAscentGoal;
  grid: GridAscentGoal;
}

interface Props {
  user: UserDatum;
  me: UserDatum;
  mountains: MountainDatum[];
  type: PeakListVariants;
}

const ComparisonTable = (props: Props) => {
  const { user, me, mountains, type } = props;

  const userMountains = user.mountains !== null ? user.mountains : [];
  const myMountains = me.mountains !== null ? me.mountains : [];

  const myAscentGoals: AscentGoals[] = [];
  me.peakLists.forEach(peakList => {
    const { parent, type } = peakList;
    let listMountains: {id: string}[];
    if (parent !== null && parent.mountains !== null) {
      listMountains = parent.mountains;
    } else if (peakList.mountains !== null) {
      listMountains = peakList.mountains;
    } else {
      listMountains = [];
    }
    listMountains.forEach(mountain => {
      const completedDates = userMountains.find(
        (completedMountain) => completedMountain.mountain.id === mountain.id);
      // If a peak has been completed, push to the array the information
      if (completedDates !== undefined) {
        if (type === PeakListVariants.standard) {
          const completedDate = getStandardCompletion(completedDates);
          console.log(completedDate);
        } else if (type === PeakListVariants.winter) {
          const completedDate = getWinterCompletion(completedDates);
          console.log(completedDate);
        } else if (type === PeakListVariants.fourSeason) {
          const completedDate = getFourSeasonCompletion(completedDates);
          console.log(completedDate);
        } else if (type === PeakListVariants.grid) {
          const completedDate = getGridCompletion(completedDates);
          console.log(completedDate);
        }
      } else {
        // if it hasn't, push the peak as a goal for the variant, but with no completion
      }
    });
  });

  console.log(myAscentGoals)

  const comparisonRows = mountains.map((mountain, index) => (
    <ComparisonRow
      key={`comparison-row-${mountain.id}`}
      userMountains={userMountains}
      myMountains={myMountains}
      mountain={mountain}
      type={type}
      index={index}
    />
  ));

  return (
    <Root>
      <MountainColumnTitleName>Mountain</MountainColumnTitleName>
      <TitleCell style={{gridColumn: gridColumns.friendColumn}}>{user.name}</TitleCell>
      <TitleCell style={{gridColumn: gridColumns.meColumn}}>{me.name}</TitleCell>
      {comparisonRows}
    </Root>
  );

};

export default ComparisonTable;
