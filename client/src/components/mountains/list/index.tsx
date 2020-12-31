import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {
  useGeoNearMountains,
} from '../../../queries/mountains/useGeoNearMountains';
import { mountainDetailLink } from '../../../routing/Utils';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import GhostMountainCard from './GhostMountainCard';
import ListMountains from './ListMountains';

const MountainSearchPage = () => {
  const getString = useFluent();

  const {loading, error, data} = useGeoNearMountains();

  let list: React.ReactElement<any> | null;
  if (loading === true && data === undefined) {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostMountainCard key={i} />);
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
    if (!data.mountains) {
      const loadingCards: Array<React.ReactElement<any>> = [];
      for (let i = 0; i < 3; i++) {
        loadingCards.push(<GhostMountainCard key={i} />);
      }
      list = <>{loadingCards}</>;
    } else {
      list = (
        <>
          <ListMountains
            mountainData={data.mountains}
            noResultsText={getString('global-text-value-no-results-found')}
          />
        </>
      );
    }
  } else {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostMountainCard key={i} />);
    }
    list = <>{loadingCards}</>;
  }

  const metaDescription = getString('meta-data-mountain-search-description');

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-mtn-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getString('meta-data-mtn-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + mountainDetailLink('search')} />
      </Helmet>
      {list}
    </>
  );
};

export default MountainSearchPage;
