import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import { Types } from 'mongoose';
import queryString from 'query-string';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { Routes } from '../../../routing/routes';
import { searchMountainsDetailLink } from '../../../routing/Utils';
import {
  ContentBody,
  ContentLeftSmall,
  ContentRightLarge,
  SearchContainer,
} from '../../../styling/Grid';
import {
  FloatingButton,
  FloatingButtonContainer,
  Next,
  PaginationContainer,
  PlaceholderText,
  PlusIcon,
  Prev,
} from '../../../styling/styleUtils';
import { State } from '../../../types/graphQLTypes';
import {
  LocationText,
  MapIcon,
  SearchAndFilterContainer,
  SelectButton,
} from '../../peakLists/list';
import StandardSearch from '../../sharedComponents/StandardSearch';
import MountainDetail from '../detail/MountainDetail';
import GhostMountainCard from './GhostMountainCard';
import ListMountains, { MountainDatum } from './ListMountains';
import LocationFilter from './LocationFilter';

const SEARCH_MOUNTAINS = gql`
  query SearchMountains(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
    $state: ID,
  ) {
    mountains: mountainSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
      state: $state,
    ) {
      id
      name
      state {
        id
        name
      }
      elevation
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
  state: string | null;
}

interface Props extends RouteComponentProps {
  userId: string | null;
  mountainPermissions: number | null;
}

const MountainSearchPage = (props: Props) => {
  const { userId, mountainPermissions, match, location, history } = props;
  const { id }: any = match.params;
  const { query, page } = queryString.parse(location.search);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [locationSearchValue, setLocationSearchValue] = useState<string>('Everywhere');
  const [selectedState, setSelectedState] = useState<State['id'] | null>(null);

  const incrementPageNumber = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    const url = searchMountainsDetailLink(id) + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };
  const decrementPageNumber = () => {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    const url = searchMountainsDetailLink(id) + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };
  const nPerPage = 50;

  useEffect(() => {
    if (typeof query === 'string') {
      setInitialSearchQuery(query);
      setSearchQuery(query);
    }
    if (typeof page === 'string') {
      const pageAsNumber = parseInt(page, 10);
      if (!isNaN(pageAsNumber)) {
        setPageNumber(pageAsNumber);
      }
    }
  }, [query, page]);

  const searchMountains = (value: string) => {
    setSearchQuery(value);
    setPageNumber(1);
    const url = searchMountainsDetailLink(id) + '?query=' + value + '&page=' + 1;
    history.push(url);
  };

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_MOUNTAINS, {
    variables: { searchQuery, pageNumber, nPerPage, state: selectedState },
  });

  const listContainerElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listContainerElm.current;
    if (node) {
      node.scrollTop = 0;
    }
  }, [listContainerElm, pageNumber]);

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
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { mountains } = data;
    if (!mountains) {
      list = (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const nextBtn = mountains.length === nPerPage ? (
        <Next onClick={incrementPageNumber}>
          {getFluentString('global-text-value-navigation-next')}
        </Next> ) : null;
      const prevBtn = pageNumber > 1 ? (
        <Prev onClick={decrementPageNumber}>
          {getFluentString('global-text-value-navigation-prev')}
        </Prev> ) : null;
      const noResultsText = getFluentString('global-text-value-no-results-found-for-term', {
        term: searchQuery,
      });
      list = (
        <>
          <ListMountains
            mountainData={mountains}
            noResultsText={noResultsText}
          />
          <PaginationContainer>
            {prevBtn}
            {nextBtn}
          </PaginationContainer>
        </>
      );
    }
  } else {
    list =  (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }

  const mountainDetail = !Types.ObjectId.isValid(id)
    ? (
        <PlaceholderText>{getFluentString('mountain-search-mountains-detail-placeholder')}</PlaceholderText>
      )
    : ( <MountainDetail userId={userId} id={id} peakListId={null} setOwnMetaData={true} />);

  const addMountainButton = userId && mountainPermissions !== -1 ? (
    <FloatingButtonContainer>
      <FloatingButton to={Routes.CreateMountain}>
        <PlusIcon>+</PlusIcon> {getFluentString('create-mountain-title-create')}
      </FloatingButton>
    </FloatingButtonContainer>
  ) : null;

  const metaDescription = getFluentString('meta-data-mountain-search-description');

  return (
    <>
      <Helmet>
        <title>{getFluentString('meta-data-mtn-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getFluentString('meta-data-mtn-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + searchMountainsDetailLink('search')} />
      </Helmet>
      <ContentLeftSmall>
        <SearchContainer>
          <SearchAndFilterContainer>
            <LocationFilter
              changeLocation={setLocationSearchValue}
              setSelectedState={setSelectedState}
            >
              <SelectButton>
                <MapIcon icon='map-marker-alt' />
                <LocationText>{locationSearchValue}</LocationText>
              </SelectButton>
            </LocationFilter>
            <StandardSearch
              placeholder={getFluentString('global-text-value-search-mountains')}
              setSearchQuery={searchMountains}
              focusOnMount={true}
              initialQuery={initialSearchQuery}
            />
          </SearchAndFilterContainer>
        </SearchContainer>
        <ContentBody ref={listContainerElm}>
          {list}
          {addMountainButton}
        </ContentBody>
      </ContentLeftSmall>
      <ContentRightLarge>
        <ContentBody>
          {mountainDetail}
        </ContentBody>
      </ContentRightLarge>
    </>
  );
};

export default withRouter(MountainSearchPage);
