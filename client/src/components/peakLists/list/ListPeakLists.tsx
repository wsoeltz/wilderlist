import {faTrophy} from '@fortawesome/free-solid-svg-icons';
import sortBy from 'lodash/sortBy';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {CardPeakListDatum} from '../../../queries/lists/getUsersPeakLists';
import { NoResults } from '../../../styling/styleUtils';
import {
  BasicIconInText,
  DetailBox,
  lightBorderColor,
  SectionTitleH3,
  tertiaryColor,
} from '../../../styling/styleUtils';
import {
  PeakListVariants,
 } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import PeakListCard from './PeakListCard';
import PeakListTrophy from './PeakListTrophy';

const TrophyTitle = styled(SectionTitleH3)`
  border: 1px solid ${lightBorderColor};
  border-bottom: none;
  background-color: ${tertiaryColor};
  padding: 1rem 1rem 0;
  margin-bottom: 0;
  display: flex;
  align-items: center;
`;

const TrophyContainer = styled(DetailBox)`
  display: flex;
  overflow: auto;
  padding: 0 0 0.5rem;
  margin-bottom: 2rem;
  border-top: none;
`;

interface BaseProps {
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  noResultsText: string;
  showTrophies: boolean;
  setActionDisabled?: (peakListId: string) => boolean;
}

type Props = BaseProps & (
  {
    peakListData: CardPeakListDatum[];
  }
) & ({ profileId: string | undefined });

const ListPeakLists = (props: Props) => {
  const {
    listAction, actionText,
    noResultsText, showTrophies,
    profileId, setActionDisabled,
  } = props;

  const getString = useFluent();

  if (props.peakListData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const trophiesDatum: CardPeakListDatum[] = [];
  const peakLists = props.peakListData.map(peakList => {
    const {
      type, numCompletedAscents, numMountains, latestAscent,
      isActive,
    } = peakList;

    let totalRequiredAscents: number;
    if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
      totalRequiredAscents = numMountains;
    } else if (type === PeakListVariants.fourSeason) {
      totalRequiredAscents = numMountains * 4;
    } else if (type === PeakListVariants.grid) {
      totalRequiredAscents = numMountains * 12;
    } else {
      totalRequiredAscents = 0;
      failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
    }

    if (showTrophies === true && totalRequiredAscents > 0 && numCompletedAscents === totalRequiredAscents) {
      trophiesDatum.push(peakList);
      return null;
    }
    return (
      <PeakListCard
        peakList={peakList}
        active={isActive}
        listAction={listAction}
        actionText={actionText}
        profileId={profileId}
        key={peakList.id}
        latestDate={latestAscent}
        numCompletedAscents={numCompletedAscents}
        totalRequiredAscents={totalRequiredAscents}
        setActionDisabled={setActionDisabled}
      />
    );
  });

  const sortedPeakLists = showTrophies === true
    ? sortBy(peakLists, (list) => {
      if (list !== null) {
        const { numCompletedAscents, totalRequiredAscents } = list.props;
        return numCompletedAscents / totalRequiredAscents;
      }
    }).reverse()
    : peakLists;

  const sortedTrophies =
    sortBy(trophiesDatum, ({latestAscent}) => latestAscent ? new Date(latestAscent) : 0).reverse();

  const trophies = sortedTrophies.map((peakList) => (
    <PeakListTrophy
      peakList={peakList}
      profileId={profileId}
      key={peakList.id}
    />
  ));

  const trophyContent = showTrophies === true && trophies.length > 0 ? (
    <>
      <TrophyTitle>
        <BasicIconInText icon={faTrophy} />
        {getString('user-profile-lists-completed')} ({trophies.length})
      </TrophyTitle>
      <TrophyContainer>
        {trophies}
      </TrophyContainer>
    </>
  ) : null;

  const inProgressTitle = showTrophies === true ? (
    <>
      <SectionTitleH3>
        {getString('user-profile-lists-in-progress')}
      </SectionTitleH3>
    </>
  ) : null;
  return (
    <>
      {trophyContent}
      {inProgressTitle}
      {sortedPeakLists}
    </>
  );
};

export default ListPeakLists;
