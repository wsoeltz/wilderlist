import { GetString } from 'fluent-react';
import sortBy from 'lodash/sortBy';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { NoResults } from '../../../styling/styleUtils';
import { lightBaseColor } from '../../../styling/styleUtils';
import {
  PeakList,
  PeakListVariants,
  Region,
  State,
 } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import { ViewMode } from './index';
import PeakListCard from './PeakListCard';
import PeakListCompactCard from './PeakListCompactCard';
import PeakListTrophy from './PeakListTrophy';

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  text-transform: uppercase;
  color: ${lightBaseColor};
  margin-bottom: 1.2rem;
`;

const TrophyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

`;

export interface RegionDatum {
  id: Region['id'];
  name: Region['name'];
  states: Array<{
    id: State['id'],
  } | null>;
}

export interface StateDatum {
  id: State['id'];
  name: State['name'];
  regions: Array<RegionDatum | null>;
}

export interface CardPeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  numMountains: PeakList['numMountains'];
  numCompletedAscents: PeakList['numCompletedAscents'];
  latestAscent: PeakList['latestAscent'];
  isActive: PeakList['isActive'];
  parent: null | {id: PeakList['id']};
  states: null | StateDatum[];
}

export interface CompactPeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  numMountains: PeakList['numMountains'];
  numCompletedAscents: PeakList['numCompletedAscents'];
  latestAscent: PeakList['latestAscent'];
  isActive: PeakList['isActive'];
  states: null | StateDatum[];
}

interface BaseProps {
  userListData: Array<PeakList['id']> | null;
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  noResultsText: string;
  showTrophies: boolean;
  viewMode: ViewMode;
  dashboardView?: boolean;
}

type Props = BaseProps & (
  {
    viewMode: ViewMode.Card;
    peakListData: CardPeakListDatum[];
  } | {
    viewMode: ViewMode.Compact;
    peakListData: CompactPeakListDatum[];
  }
) & ({ profileId: string | undefined });

const ListPeakLists = (props: Props) => {
  const {
    listAction, actionText,
    noResultsText, showTrophies,
    profileId, dashboardView,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  if (props.peakListData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const trophies: Array<React.ReactElement<any> | null> = [];
  if (props.viewMode === ViewMode.Card) {
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
        failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
        totalRequiredAscents = 0;
      }

      if (showTrophies === true && totalRequiredAscents > 0 && numCompletedAscents === totalRequiredAscents) {
        trophies.push(
          <PeakListTrophy
            peakList={peakList}
            profileId={profileId}
            dashboardView={dashboardView === true ? true : false}
            key={peakList.id}
          />,
        );
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
          dashboardView={dashboardView === true ? true : false}
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

    const trophyContent = showTrophies === true && trophies.length > 0 ? (
      <>
        <SectionTitle>
          {getFluentString('user-profile-lists-completed')}
        </SectionTitle>
        <TrophyContainer>
          {trophies}
        </TrophyContainer>
      </>
    ) : null;

    const inProgressTitle = showTrophies === true ? (
      <>
        <SectionTitle>
          {getFluentString('user-profile-lists-in-progress')}
        </SectionTitle>
      </>
    ) : null;
    return (
      <>
        {trophyContent}
        {inProgressTitle}
        {sortedPeakLists}
      </>
    );
  } else if (props.viewMode === ViewMode.Compact) {
    const peakListCards = props.peakListData.map(list => {
      const {
        type, numCompletedAscents, numMountains, isActive,
      } = list;

      let totalRequiredAscents: number;
      if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
        totalRequiredAscents = numMountains;
      } else if (type === PeakListVariants.fourSeason) {
        totalRequiredAscents = numMountains * 4;
      } else if (type === PeakListVariants.grid) {
        totalRequiredAscents = numMountains * 12;
      } else {
        failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
        totalRequiredAscents = 0;
      }
      return (
          <PeakListCompactCard
            key={list.id}
            peakList={list}
            active={isActive}
            listAction={listAction}
            actionText={actionText}
            totalRequiredAscents={totalRequiredAscents}
            numCompletedAscents={numCompletedAscents}
          />
        );
    });
    return (
      <>
        {peakListCards}
      </>
    );
  } else {
    return null;
  }
};

export default ListPeakLists;
