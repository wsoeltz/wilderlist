import { gql, useQuery } from '@apollo/client';
import queryString from 'query-string';
import React from 'react';
import Helmet from 'react-helmet';
import {useHistory} from 'react-router-dom';
import useFluent from '../../../hooks/useFluent';
import usePrevious from '../../../hooks/usePrevious';
import { mountainDetailLink } from '../../../routing/Utils';
import {
  ContentBody,
  ContentContainer,
} from '../../../styling/Grid';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import GhostMountainCard from './GhostMountainCard';
import ListMountains, {
  MountainDatum,
  MountainDatumWithDistance,
} from './ListMountains';

const SEARCH_MOUNTAINS = gql`
  query SearchMountains(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
  ) {
    mountains: mountainSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      state {
        id
        name
      }
      elevation
      latitude
      longitude
    }
  }
`;

interface SuccessResponse {
  mountains: MountainDatum[];
}

interface Variables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}

const MountainSearchPage = () => {
  const history = useHistory();
  const { query } = queryString.parse(history.location.search);
  const searchQuery = query && typeof query === 'string' && query.length ? query : '';

  const nPerPage = 10;

  const getString = useFluent();

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_MOUNTAINS, {
    variables: {
      searchQuery,
      pageNumber: 1,
      nPerPage,
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
  if (loading === true) {
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
      const rawMountains = dataToUse.mountains;
      const extendedMountains: MountainDatumWithDistance[] = rawMountains.map(mtn => {
        const distanceToUser = null;
        const distanceToMapCenter = null;
        return {...mtn, distanceToUser, distanceToMapCenter};
      });
      list = (
        <>
          <ListMountains
            mountainData={extendedMountains}
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
      <ContentContainer>
        <ContentBody>
          {list}
        </ContentBody>
      </ContentContainer>
    </>
  );
};

export default MountainSearchPage;
