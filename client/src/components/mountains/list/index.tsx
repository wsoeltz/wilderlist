import { gql, useQuery } from '@apollo/client';
import {
  faFilter,
  faList,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';
import sortBy from 'lodash/sortBy';
import { Types } from 'mongoose';
import queryString from 'query-string';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import usePrevious from '../../../hooks/usePrevious';
import { Routes } from '../../../routing/routes';
import { searchMountainsDetailLink } from '../../../routing/Utils';
import {
  ContentBody,
  ContentHeader,
  ContentLeftSmall,
  ContentRightLarge,
  gridLines,
  PreContentHeaderFull,
  SearchContainer,
} from '../../../styling/Grid';
import {
  BasicIconInText,
  ButtonTertiary,
  FloatingButton,
  FloatingButtonContainer,
  Next,
  NoResults,
  PaginationContainer,
  PlaceholderText,
  PlusIcon,
  Prev,
  secondaryColor,
  SecondaryNavigationButton,
  SecondaryNavigationContainer,
} from '../../../styling/styleUtils';
import {mobileSize} from '../../../Utils';
import {AppContext} from '../../App';
import BackButton from '../../sharedComponents/BackButton';
import StandardSearch from '../../sharedComponents/StandardSearch';
import MountainDetail from '../detail/MountainDetail';
import AdvancedFilter from './AdvancedFilter';
import GhostMountainCard from './GhostMountainCard';
import ListMountains, {
  MountainDatum,
  MountainDatumWithDistance,
} from './ListMountains';

const AdvancedSearchContainer = styled(SearchContainer)`
  display: grid;
  grid-template-columns: 1fr auto;
`;

const FilterButton = styled(ButtonTertiary)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;
`;

const baseQuery = `
  id
  name
  state {
    id
    name
  }
  elevation
  latitude
  longitude
`;

const SEARCH_MOUNTAINS = gql`
  query SearchMountains(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
    $state: ID,
    $minElevation: Float,
    $maxElevation: Float,
  ) {
    mountains: mountainSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
      state: $state,
      minElevation: $minElevation,
      maxElevation: $maxElevation,
    ) {
      ${baseQuery}
    }
  }
`;

interface SuccessResponse {
  mountains: MountainDatum[];
}

interface SearchVariables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
  state: string | null;
  minElevation: number | null;
  maxElevation: number | null;
}
interface LocationVariables {
  latitude: number;
  longitude: number;
  latDistance: number;
  longDistance: number;
  limit: number;
}
type Variables = SearchVariables | LocationVariables;

enum View {
  Map,
  List,
}

interface Props extends RouteComponentProps {
  userId: string | null;
  mountainPermissions: number | null;
}

const MountainSearchPage = (props: Props) => {
  const { userId, mountainPermissions, match, location, history } = props;
  const { id }: any = match.params;
  const { query, page } = queryString.parse(location.search);

  const {usersLocation, windowWidth} = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const [stateId, setStateId] = useState<string>('');
  const [minElevation, setMinElevation] = useState<string>('');
  const [maxElevation, setMaxElevation] = useState<string>('');

  const [mobileView, setMobileView] = useState<View>(View.List);

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

  const getString = useFluent();

  let variables: Variables;
  let GQL_QUERY: any;
  let queryText: React.ReactElement<any> | null;
  let noResultsText: string;
  if (searchQuery || stateId || minElevation || maxElevation ) {
    variables = {
      searchQuery,
      pageNumber,
      nPerPage,
      state: stateId && stateId.length ? stateId : null,
      minElevation: minElevation.length ? parseFloat(minElevation) : null,
      maxElevation: maxElevation.length ? parseFloat(maxElevation) : null,
    };
    GQL_QUERY = SEARCH_MOUNTAINS;
    queryText = (
      <NoResults
        dangerouslySetInnerHTML={{
          __html: searchQuery ? getString('mountain-search-query-desc', {
            'search-query': searchQuery,
          }) : getString('mountain-search-generic-desc'),
        }}
      />
    );
    noResultsText = getString('global-text-value-no-results-found');
  } else {
    GQL_QUERY = SEARCH_MOUNTAINS;
    variables = {
      searchQuery: 'search-should-return-no-results-',
      pageNumber,
      nPerPage: 1,
      state: null,
      minElevation: null,
      maxElevation: null,
    };
    queryText = null;
    noResultsText = '';
  }

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GQL_QUERY, {variables});

  const prevData = usePrevious(data);
  let dataToUse: SuccessResponse | undefined;
  if (data !== undefined) {
    dataToUse = data;
  } else if (prevData !== undefined) {
    dataToUse = prevData;
  } else {
    dataToUse = undefined;
  }

  const listContainerElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listContainerElm.current;
    if (node) {
      node.scrollTop = 0;
    }
  }, [listContainerElm, pageNumber]);

  let list: React.ReactElement<any> | null;
  if (loading === true && (!dataToUse || searchQuery)) {
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
  } else if (dataToUse !== undefined && (searchQuery || (usersLocation.error ||
      (usersLocation.data && usersLocation.data.preciseCoordinates && !usersLocation.data.localCoordinates))
    )) {
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
      let mountains: MountainDatumWithDistance[];
      if (!searchQuery) {
        const sortedMountains = sortBy(extendedMountains, ['distanceToMapCenter']);
        mountains = sortedMountains.slice(nPerPage * (pageNumber - 1), nPerPage * pageNumber);
      } else {
        mountains = extendedMountains;
      }
      const nextBtn = mountains.length === nPerPage ? (
        <Next onClick={incrementPageNumber}>
          {getString('global-text-value-navigation-next')}
        </Next> ) : null;
      const prevBtn = pageNumber > 1 ? (
        <Prev onClick={decrementPageNumber}>
          {getString('global-text-value-navigation-prev')}
        </Prev> ) : null;
      list = (
        <>
          {queryText}
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
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostMountainCard key={i} />);
    }
    list = <>{loadingCards}</>;
  }

  const backButton = !Types.ObjectId.isValid(id)
    ? null
    : (
      <ContentHeader>
        <BackButton
          text={getString('map-search-back-to-map')}
        />
      </ContentHeader>
    );

  const mountainId = !Types.ObjectId.isValid(id)
    ? null
    : id;

  const mapSearchToggleBar = windowWidth < mobileSize
    ? (
      <PreContentHeaderFull>
        <SecondaryNavigationContainer>
          <SecondaryNavigationButton
            style={{
              color: mobileView === View.List ? '#fff' : undefined,
              backgroundColor: mobileView === View.List ? secondaryColor : undefined,
            }}
            onClick={() => setMobileView(View.List)}
          >
            <BasicIconInText icon={faList} />
            {getString('mountain-search-mobile-nav-list')}
          </SecondaryNavigationButton>
          <SecondaryNavigationButton
            onClick={() => setMobileView(View.Map)}
            style={{
              color: mobileView === View.Map ? '#fff' : undefined,
              backgroundColor: mobileView === View.Map ? secondaryColor : undefined,
            }}
          >
            <BasicIconInText icon={faMapMarkedAlt} />
            {getString('mountain-search-mobile-nav-map')}
          </SecondaryNavigationButton>
        </SecondaryNavigationContainer>
      </PreContentHeaderFull>
      )
    : null;
  const mobileMapStyles = windowWidth < mobileSize && mobileView === View.Map
    ? {
        width: 'auto',
        height: '100%',
        gridColumn: `${gridLines.pageLeft} / ${gridLines.pageRight}`,
      }
    : undefined;

  const mobileSearchStyles = windowWidth < mobileSize && mobileView === View.Map
    ? {
        width: '0',
        height: '0',
        display: 'none',
      }
    : undefined;

  const addMountainButton = userId && mountainPermissions !== -1 ? (
    <FloatingButtonContainer>
      <FloatingButton to={Routes.CreateMountain}>
        <PlusIcon>+</PlusIcon> {getString('create-mountain-title-create')}
      </FloatingButton>
    </FloatingButtonContainer>
  ) : null;

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
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + searchMountainsDetailLink('search')} />
      </Helmet>
      {mapSearchToggleBar}
      <ContentLeftSmall style={mobileSearchStyles}>
        <AdvancedSearchContainer>
          <StandardSearch
            placeholder={getString('global-text-value-search-mountains')}
            setSearchQuery={searchMountains}
            focusOnMount={true}
            initialQuery={initialSearchQuery}
          />
          <FilterButton
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              borderBottomRightRadius: filterOpen ? 0 : undefined,
            }}
          >
            <BasicIconInText icon={faFilter} />
            Filter
          </FilterButton>
          <AdvancedFilter
            visible={filterOpen}
            minElevation={minElevation}
            setMinElevation={setMinElevation}
            maxElevation={maxElevation}
            setMaxElevation={setMaxElevation}
            stateId={stateId}
            setStateId={setStateId}
          />
        </AdvancedSearchContainer>
        <ContentBody ref={listContainerElm} style={{paddingTop: 0}}>
          {list}
          {addMountainButton}
        </ContentBody>
      </ContentLeftSmall>
      <ContentRightLarge style={mobileMapStyles}>
        {backButton}
        <ContentBody>
          <MountainDetail userId={userId} id={mountainId} peakListId={null} setOwnMetaData={true} />
        </ContentBody>
      </ContentRightLarge>
    </>
  );
};

export default withRouter(MountainSearchPage);
