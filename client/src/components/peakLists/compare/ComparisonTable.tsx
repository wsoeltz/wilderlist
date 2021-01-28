import React, {useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { UserDatum } from '../../../queries/lists/useComparePeakList';
import StandardSearch from '../../sharedComponents/StandardSearch';
import ComparisonRow, {MountainDatumLite} from './ComparisonRow';
import { getAscentGoals } from './Utils';

const Root = styled.div`
  display: grid;
`;

const TitleBase = styled.h4`
  text-transform: uppercase;
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.6rem;
  border-bottom: solid 2px #dfdfdf;
  position: sticky;
  background-color: #fff;
  z-index: 50;
  margin: 0;

  &:hover {
    cursor: pointer;
    background-color: #efefef;
  }
`;

const MountainColumnTitleName = styled(TitleBase)`
  align-items: center;
  font-size: 1.1rem;
`;

const TitleCell = styled(TitleBase)`
  padding: 0.6rem 0.1rem;
  justify-content: center;
`;

const FilterBar = styled.div`
  margin-bottom: 1rem;
  font-size: 75%;
`;

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

  const getString = useFluent();

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
            {getString('global-text-value-mountain')}
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
