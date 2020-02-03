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
  CompletedMountain,
  Mountain,
  PeakList,
  PeakListVariants,
 } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import { completedPeaks } from '../Utils';
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

interface MountainDatum {
  id: Mountain['id'];
}

export interface CardPeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  parent: null | {id: PeakList['id']}
  mountains: MountainDatum[] | null;
}

export interface CompactPeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
}

interface BaseProps {
  userListData: Array<PeakList['id']> | null;
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  completedAscents: CompletedMountain[];
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
    userListData, listAction, actionText,
    completedAscents, noResultsText, showTrophies,
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
      const { type } = peakList;
      const mountains: Array<{id: Mountain['id']}> = peakList.mountains ? peakList.mountains : [];

      const numCompletedAscents = completedPeaks(mountains, completedAscents, type);
      let totalRequiredAscents: number;
      if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
        totalRequiredAscents = mountains.length;
      } else if (type === PeakListVariants.fourSeason) {
        totalRequiredAscents = mountains.length * 4;
      } else if (type === PeakListVariants.grid) {
        totalRequiredAscents = mountains.length * 12;
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
      const active = userListData ? userListData.includes(peakList.id) : null;
      return (
        <PeakListCard
          peakList={peakList}
          active={active}
          listAction={listAction}
          actionText={actionText}
          completedAscents={completedAscents}
          profileId={profileId}
          key={peakList.id}
          mountains={mountains}
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
    const active = userListData ? userListData.includes(list.id) : null;
    return (
        <PeakListCompactCard
          key={list.id}
          peakList={list}
          active={active}
          listAction={listAction}
          actionText={actionText}
          completedAscents={completedAscents}
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
