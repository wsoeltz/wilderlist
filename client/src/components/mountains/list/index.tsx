import { gql, useQuery } from '@apollo/client';
import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import useMapCenter from '../../../hooks/useMapCenter';
import usePrevious from '../../../hooks/usePrevious';
import { mountainDetailLink } from '../../../routing/Utils';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import GhostMountainCard from './GhostMountainCard';
import ListMountains, {
  MountainDatum,
} from './ListMountains';

const GEO_NEAR_MOUNTAINS = gql`
  query GeoNearMountains(
    $latitude: Float!,
    $longitude: Float!,
    $limit: Int!,
  ) {
    mountains: geoNearMountains(
      latitude: $latitude,
      longitude: $longitude,
      limit: $limit,
    ) {
      id
      name
      state {
        id
        name
      }
      elevation
      location
    }
  }
`;

interface SuccessResponse {
  mountains: MountainDatum[];
}

interface Variables {
  latitude: number;
  longitude: number;
  limit: number;
}

const MountainSearchPage = () => {
  const getString = useFluent();

  const [longitude, latitude] = useMapCenter();

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GEO_NEAR_MOUNTAINS, {
    variables: {
      latitude,
      longitude,
      limit: 15,
    },
  });

  const prevData = usePrevious(data);
  let dataToUse: SuccessResponse | undefined;
  if (data !== undefined) {
    dataToUse = data;
  } else if (prevData !== undefined) {
    dataToUse = prevData;
  } else {
    dataToUse = undefined;
  }

  let list: React.ReactElement<any> | null;
  if (loading === true && dataToUse === undefined) {
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
  } else if (dataToUse !== undefined) {
    if (!dataToUse.mountains) {
      const loadingCards: Array<React.ReactElement<any>> = [];
      for (let i = 0; i < 3; i++) {
        loadingCards.push(<GhostMountainCard key={i} />);
      }
      list = <>{loadingCards}</>;
    } else {
      list = (
        <>
          <ListMountains
            mountainData={dataToUse.mountains}
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
