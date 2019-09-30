import { GetString } from 'fluent-react';
import React, {useContext} from 'react';
import styled from 'styled-components';
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
  Region,
  State,
 } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import { completedPeaks } from '../Utils';
import PeakListCard, {MountainList} from './PeakListCard';
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
  state: {
    id: State['id'];
    name: State['name'];
    regions: Array<{
      id: Region['id'];
      name: Region['name'];
      states: Array<{
        id: State['id'],
      }>
    }>
  };
}

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  mountains: MountainDatum[] | null;
  parent: {
    id: PeakList['id'];
    mountains: MountainDatum[] | null;
  } | null;
}

interface BaseProps {
  peakListData: PeakListDatum[];
  userListData: Array<PeakList['id']>;
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  completedAscents: CompletedMountain[];
  noResultsText: string;
  showTrophies: boolean;
}

type Props = BaseProps & ({ profileView: false } | {
  profileView: true;
  isMe: boolean;
});

const ListPeakLists = (props: Props) => {
  const {
    peakListData, userListData, listAction, actionText,
    completedAscents, noResultsText, showTrophies,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  if (peakListData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const trophies: Array<React.ReactElement<any> | null> = [];
  const peakLists = peakListData.map(peakList => {
    const { parent, type } = peakList;
    let mountains: MountainList[];
    if (parent !== null && parent.mountains !== null) {
      mountains = parent.mountains;
    } else if (peakList.mountains !== null) {
      mountains = peakList.mountains;
    } else {
      mountains = [];
    }

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

    if (showTrophies === true && numCompletedAscents === totalRequiredAscents) {
      trophies.push(
        <PeakListTrophy
          peakList={peakList}
          key={peakList.id}
        />,
      );
      return null;
    }
    const isMe = props.profileView === true ? props.isMe : false;
    const active = userListData.includes(peakList.id);
    return (
      <PeakListCard
        peakList={peakList}
        active={active}
        listAction={listAction}
        actionText={actionText}
        completedAscents={completedAscents}
        profileView={props.profileView}
        key={peakList.id}
        mountains={mountains}
        numCompletedAscents={numCompletedAscents}
        totalRequiredAscents={totalRequiredAscents}
        isMe={isMe}
      />
    );
  });

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
      {peakLists}
    </>
  );
};

export default ListPeakLists;
