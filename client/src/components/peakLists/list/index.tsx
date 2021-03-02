const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import {
  faList,
} from '@fortawesome/free-solid-svg-icons';
import orderBy from 'lodash/orderBy';
import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {
  useGeoNearPeakLists,
} from '../../../queries/lists/getGeoNearPeakLists';
import { listDetailLink } from '../../../routing/Utils';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import { AggregateItem } from '../../../types/itemTypes';
import GhostCard from '../../sharedComponents/GhostDetailCard';
import Results from '../../sharedComponents/listComponents/Results';

const PeakListPage = () => {
  const getString = useFluent();
  const {loading, error, data, latitude, longitude} = useGeoNearPeakLists();

  let list: React.ReactElement<any> | null;
  if (loading === true && data === undefined) {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostCard key={i} />);
    }
    list = <>{loadingCards}</>;
  } else if (error !== undefined) {
    console.error(error);
    list =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { peakLists } = data;
    if (!peakLists) {
      list = (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const mapCenter = point([longitude, latitude]);
      const sortedPeakLists = orderBy(peakLists.map(p => {
        const totalItems = p.numMountains + p.numTrails + p.numCampsites;
        return {
          id: p.id,
          title: p.name,
          locationText: p.locationText,
          type: AggregateItem.list,
          url: listDetailLink(p.id),
          icon: faList,
          customIcon: false,
          distance: Math.round(distance(mapCenter, point(p.center)) / 100) * 100,
          percent: Math.round(p.numCompletedTrips / totalItems * 100),
          numUsers: p.numUsers,
          numMountains: p.numMountains,
          numTrails: p.numTrails,
          numCampsites: p.numCampsites,
          bbox: p.bbox,
        };
      }), ['distance', 'percent', 'numUsers'], ['asc', 'desc', 'desc']);
      list = (
        <Results
          data={sortedPeakLists}
          type={AggregateItem.list}
        />
      );
    }
  } else {
    list =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }

  const metaDescription = getString('meta-data-peak-list-search-description');

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-list-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getString('meta-data-list-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + listDetailLink('search')} />
      </Helmet>
      <div>
        {list}
      </div>
    </>
  );
};

export default PeakListPage;
