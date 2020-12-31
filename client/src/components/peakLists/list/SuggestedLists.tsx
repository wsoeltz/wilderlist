const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import orderBy from 'lodash/orderBy';
import React from 'react';
import styled from 'styled-components';
import useFluent from '../../../hooks/useFluent';
import {
  useGeoNearPeakLists,
} from '../../../queries/lists/getGeoNearPeakLists';
import {
  SectionTitleH3,
} from '../../../styling/styleUtils';
import GeoSearchResults from './GeoSearchResults';
import {ViewMode} from './ListPeakLists';

const Background = styled.div`
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.04);
`;

const SuggestedLists = () => {
  const getString = useFluent();

  const {loading, error, data, latitude, longitude} = useGeoNearPeakLists();

  let list: React.ReactElement<any> | null;
  if (loading === true && data === undefined) {
    list = null;
  } else if (error !== undefined) {
    console.error(error);
    list = null;
  } else if (data !== undefined) {
    const { peakLists } = data;
    if (!peakLists) {
      list = null;
    } else {

      const mapCenter = point([longitude, latitude]);
      const sortedPeakLists = orderBy(peakLists.filter(p => !p.isActive).map(p => ({
        ...p,
        distance: Math.round(distance(mapCenter, point(p.center)) / 200) * 200,
        mountainCountRank: Math.ceil(p.numMountains / 75) * 75,
      })), ['mountainCountRank', 'numUsers', 'distance'], ['asc', 'desc', 'asc']).slice(0, 4);
      if (sortedPeakLists.length === 0) {
        list = null;
      } else {
        list = (
          <Background>
            <SectionTitleH3>{getString('dashboard-suggested-lists')}</SectionTitleH3>
            <GeoSearchResults
              viewMode={ViewMode.Card}
              peakListData={sortedPeakLists}
            />
          </Background>
        );
      }
    }
  } else {
    list = null;
  }

  return (
    <>
      {list}
    </>
  );
};

export default SuggestedLists;
