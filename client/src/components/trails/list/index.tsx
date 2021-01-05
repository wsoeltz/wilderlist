import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {
  useGeoNearTrails,
} from '../../../queries/trails/useGeoNearTrails';
import { trailDetailLink } from '../../../routing/Utils';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import GhostCard from '../../sharedComponents/GhostDetailCard';
import ListTrails from './ListTrails';

const TrailSearchPage = () => {
  const getString = useFluent();

  const {loading, error, data} = useGeoNearTrails();

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
    if (!data.trails) {
      const loadingCards: Array<React.ReactElement<any>> = [];
      for (let i = 0; i < 3; i++) {
        loadingCards.push(<GhostCard key={i} />);
      }
      list = <>{loadingCards}</>;
    } else {
      list = (
        <>
          <ListTrails
            trailData={data.trails}
            noResultsText={getString('global-text-value-no-results-found')}
          />
        </>
      );
    }
  } else {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostCard key={i} />);
    }
    list = <>{loadingCards}</>;
  }

  const metaDescription = getString('meta-data-trail-search-description');

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-trail-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getString('meta-data-trail-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + trailDetailLink('search')} />
      </Helmet>
      {list}
    </>
  );
};

export default TrailSearchPage;
