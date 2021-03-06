import {faCheckDouble, faTrophy} from '@fortawesome/free-solid-svg-icons';
import sortBy from 'lodash/sortBy';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {CardPeakListDatum} from '../../../queries/lists/getUsersPeakLists';
import {
  CenterdLightTitle,
  ScrollContainerDark,
  ScrollContainerDarkRoot,
  ScrollContainerDarkTitle,
} from '../../../styling/sharedContentStyles';
import { NoResults } from '../../../styling/styleUtils';
import {
  BasicIconInText,
} from '../../../styling/styleUtils';
import {
  PeakListVariants,
 } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import PeakListCard from './PeakListCard';
import PeakListTrophy from './PeakListTrophy';

const TrophyContainer = styled(ScrollContainerDark)`
  padding: 2rem 0 0;
  overflow-y: hidden;
`;

interface Props {
  noResultsText: string;
  peakListData: CardPeakListDatum[];
  profileId: string | undefined;
}

const ListPeakLists = (props: Props) => {
  const {
    noResultsText,
    profileId,
  } = props;

  const getString = useFluent();

  if (props.peakListData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const trophiesDatum: CardPeakListDatum[] = [];
  const peakLists = props.peakListData.map(peakList => {
    const {
      type, numCompletedTrips,
    } = peakList;

    const numMountains = peakList.numMountains ? peakList.numMountains : 0;
    const numTrails = peakList.numTrails ? peakList.numTrails : 0;
    const numCampsites = peakList.numCampsites ? peakList.numCampsites : 0;
    const numItems = numMountains + numTrails + numCampsites;

    let totalRequiredTrips: number;
    if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
      totalRequiredTrips = numItems;
    } else if (type === PeakListVariants.fourSeason) {
      totalRequiredTrips = numItems * 4;
    } else if (type === PeakListVariants.grid) {
      totalRequiredTrips = numItems * 12;
    } else {
      totalRequiredTrips = 0;
      failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
    }

    if (totalRequiredTrips > 0 && numCompletedTrips === totalRequiredTrips) {
      trophiesDatum.push(peakList);
      return null;
    }
    return (
      <PeakListCard
        key={peakList.id}
        peakList={peakList}
        profileId={profileId}
        numCompletedTrips={numCompletedTrips}
        totalRequiredTrips={totalRequiredTrips}
      />
    );
  });

  const sortedPeakLists = sortBy(peakLists, (list) => {
    if (list !== null) {
      const { numCompletedTrips, totalRequiredTrips } = list.props;
      return numCompletedTrips / totalRequiredTrips;
    }
  }).reverse();

  const sortedTrophies =
    sortBy(trophiesDatum, ({latestTrip}) => latestTrip ? new Date(latestTrip) : 0).reverse();

  const trophies = sortedTrophies.map((peakList) => (
    <PeakListTrophy
      peakList={peakList}
      profileId={profileId}
      key={peakList.id}
    />
  ));

  const trophyContent = trophies.length > 0 ? (
    <ScrollContainerDarkRoot>
      <TrophyContainer hideScrollbars={false} $noScroll={trophies.length < 4}>
        <ScrollContainerDarkTitle>
          <BasicIconInText icon={faTrophy} />
          {getString('user-profile-lists-completed')} ({trophies.length})
        </ScrollContainerDarkTitle>
        {trophies}
      </TrophyContainer>
    </ScrollContainerDarkRoot>
  ) : null;

  const inProgressTitle = (
    <CenterdLightTitle>
      <BasicIconInText icon={faCheckDouble} />
      {getString('user-profile-lists-in-progress')}
    </CenterdLightTitle>
  );
  return (
    <>
      {trophyContent}
      {inProgressTitle}
      <div>
        {sortedPeakLists}
      </div>
    </>
  );
};

export default ListPeakLists;
