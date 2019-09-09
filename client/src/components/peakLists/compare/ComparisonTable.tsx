import React from 'react';
import {
  MountainColumnTitleName,
  Root,
  TitleCell,
} from '../detail/MountainTable';
import ComparisonRow, {MountainDatumLite} from './ComparisonRow';
import { UserDatum } from './index';
import { getAscentGoals } from './Utils';

const gridColumns = {
  friendColumn: 2,
  meColumn: 3,
};

interface Props {
  user: UserDatum;
  me: UserDatum;
  mountains: MountainDatumLite[];
}

const ComparisonTable = (props: Props) => {
  const { user, me, mountains } = props;

  const userMountains = user.mountains !== null ? user.mountains : [];
  const myMountains = me.mountains !== null ? me.mountains : [];

  const myAscentGoals = getAscentGoals(me.peakLists, myMountains);
  const userAscentGoals = getAscentGoals(user.peakLists, userMountains);

  const comparisonRows = mountains.map((mountain, index) => (
    <ComparisonRow
      key={`comparison-row-${mountain.id}`}
      userMountains={userAscentGoals}
      myMountains={myAscentGoals}
      mountain={mountain}
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
