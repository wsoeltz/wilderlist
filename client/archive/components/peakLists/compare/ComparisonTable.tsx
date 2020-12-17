import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {
  FilterBar,
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

  const [searchQuery, setSearchQuery] = useState<string>('');

  const userMountains = user.mountains !== null ? user.mountains : [];
  const myMountains = me.mountains !== null ? me.mountains : [];

  const myAscentGoals = getAscentGoals(me.peakLists, myMountains);
  const userAscentGoals = getAscentGoals(user.peakLists, userMountains);

  const filteredMountains = mountains.filter(
    ({name}) => name.toLowerCase().includes(searchQuery.toLowerCase()));
  const comparisonRows = filteredMountains.map((mountain, index) => (
    <ComparisonRow
      key={`comparison-row-${mountain.id}`}
      userMountains={userAscentGoals}
      myMountains={myAscentGoals}
      mountain={mountain}
      peakListId={peakListId}
      friendId={user.id}
      index={index}
    />
  ));

  const filterMountains = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <FilterBar>
        <StandardSearch
          placeholder='Filter mountains'
          setSearchQuery={filterMountains}
          focusOnMount={false}
          initialQuery={searchQuery}
        />
      </FilterBar>
      <div style={{minHeight: mountains.length * 32}}>
        <Root>
          <MountainColumnTitleName>
            {getFluentString('global-text-value-mountain')}
          </MountainColumnTitleName>
          <TitleCell style={{gridColumn: gridColumns.friendColumn}}>{user.name}</TitleCell>
          <TitleCell style={{gridColumn: gridColumns.meColumn}}>{me.name}</TitleCell>
          {comparisonRows}
        </Root>
      </div>
    </>
  );

};

export default ComparisonTable;