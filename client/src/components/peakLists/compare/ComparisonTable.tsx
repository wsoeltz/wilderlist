import { GetString } from 'fluent-react';
import React, {useContext} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  MountainColumnTitleName,
  Root,
  TitleCell,
} from '../detail/MountainTable';
import ComparisonRow, {MountainDatumLite} from './ComparisonRow';
import { UserDatum } from './PeakListComparison';
import { getAscentGoals } from './Utils';

const gridColumns = {
  friendColumn: 2,
  meColumn: 3,
};

interface Props {
  user: UserDatum;
  me: UserDatum;
  mountains: MountainDatumLite[];
  peakListId: string;
}

const ComparisonTable = (props: Props) => {
  const { user, me, mountains, peakListId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

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
      profileId={user.id}
      peakListId={peakListId}
    />
  ));

  return (
    <Root>
      <MountainColumnTitleName>
        {getFluentString('global-text-value-mountain')}
      </MountainColumnTitleName>
      <TitleCell style={{gridColumn: gridColumns.friendColumn}}>{user.name}</TitleCell>
      <TitleCell style={{gridColumn: gridColumns.meColumn}}>{me.name}</TitleCell>
      {comparisonRows}
    </Root>
  );

};

export default ComparisonTable;
