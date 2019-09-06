import React from 'react';
import { PeakListVariants } from '../../types/graphQLTypes';
import {
  MountainDatum,
  UserDatum,
} from '../peakListDetail';
import {
  MountainColumnTitleName,
  Root,
  TitleCell,
} from '../peakListDetail/MountainTable';
import ComparisonRow from './ComparisonRow';

const gridColumns = {
  friendColumn: 2,
  meColumn: 3,
};

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
