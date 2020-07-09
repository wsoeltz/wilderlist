import { useQuery } from '@apollo/react-hooks';
import {
  faList,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import { Types } from 'mongoose';
import queryString from 'query-string';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import usePrevious from '../../../hooks/usePrevious';
import {UsersLocation} from '../../../hooks/useUsersLocation';
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
import {getDistanceFromLatLonInMiles, mobileSize} from '../../../Utils';
import {AppContext} from '../../App';
import BackButton from '../../sharedComponents/BackButton';
import {CoordinateWithDates} from '../../sharedComponents/map/types';
import StandardSearch from '../../sharedComponents/StandardSearch';
import MountainDetail from '../detail/MountainDetail';
import GeneralMap from './GeneralMap';
import GhostMountainCard from './GhostMountainCard';
import ListMountains, {
  MountainDatum,
  MountainDatumWithDistance,
} from './ListMountains';

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
  ) {
    mountains: mountainSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      ${baseQuery}
    }
  }
`;

const GET_NEARBY_MOUNTAINS = gql`
  query getNearbyMountains(
    $latitude: Float!, $longitude: Float!, $latDistance: Float!, $longDistance: Float!, $limit: Int!) {
  mountains: nearbyMountains(
    latitude: $latitude,
    longitude: $longitude,
    latDistance: $latDistance,
    longDistance: $longDistance,
    limit: $limit,
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

  const [mobileView, setMobileView] = useState<View>(View.List);

  const [highlighted, setHighlighted] = useState<CoordinateWithDates[] | undefined>(undefined);
  const returnToMap = () => {
    history.push(searchMountainsDetailLink('search') + '?query=' + searchQuery + '&page=' + pageNumber);
  };
  const updateHiglighted = (coordinate: CoordinateWithDates[] | undefined) => {
    if (Types.ObjectId.isValid(id)) {
      returnToMap();
    }
    setHighlighted(coordinate);
    if (windowWidth < mobileSize) {
      setMobileView(View.Map);
    }
  };

  const initialMapCenter = usersLocation && usersLocation.data && usersLocation.data.localCoordinates
    ? {latitude: usersLocation.data.localCoordinates.lat, longitude: usersLocation.data.localCoordinates.lng}
    : undefined;

  const [mapCenter, setMapCenter] = useState<{latitude: number, longitude: number} | undefined>(initialMapCenter);

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

  useEffect(() => {
    if (mapCenter === undefined && usersLocation && usersLocation.data && usersLocation.data.localCoordinates) {
      const {lat, lng} = usersLocation.data.localCoordinates;
      setMapCenter({latitude: lat, longitude: lng});
    }
  }, [usersLocation, mapCenter]);

  useEffect(() => {
    if (highlighted !== undefined) {
      setHighlighted(undefined);
    }
  }, [highlighted, mapCenter]);

  const searchMountains = (value: string) => {
    setSearchQuery(value);
    setPageNumber(1);
    const url = searchMountainsDetailLink(id) + '?query=' + value + '&page=' + 1;
    history.push(url);
  };

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  let variables: Variables;
  let GQL_QUERY: any;
  let queryText: React.ReactElement<any> | null;
  let noResultsText: string;
  if (!searchQuery && (
      (usersLocation && usersLocation.loading === false && usersLocation.data && usersLocation.data.localCoordinates)
      || mapCenter)
    ) {
    let center: {latitude: number, longitude: number};
    if (mapCenter) {
      center = mapCenter;
    } else {
      // we know the data is not undefined,
      // as otherwise the if statement would
      // have failed
      const verifiedUsersLocation = usersLocation as UsersLocation;
      const verifiedUsersData = verifiedUsersLocation.data as {localCoordinates: {lat: number, lng: number}};
      center = {
        latitude: verifiedUsersData.localCoordinates.lat,
        longitude: verifiedUsersData.localCoordinates.lng,
      };
    }
    variables = {
      latitude: center.latitude,
      longitude: center.longitude,
      latDistance: 0.3,
      longDistance: 0.4,
      limit: 500,
    };
    GQL_QUERY = GET_NEARBY_MOUNTAINS;
    let coordinates: {lat: number, lng: number} | undefined;
    if (usersLocation.data) {
      coordinates = usersLocation.data.preciseCoordinates
        ? usersLocation.data.preciseCoordinates
        : usersLocation.data.localCoordinates;
    } else {
      coordinates = undefined;
    }
    const centerToYou = coordinates
      ? getDistanceFromLatLonInMiles({
        lat1: coordinates.lat,
        lon1: coordinates.lng,
        lat2: center.latitude,
        lon2: center.longitude,
      }) : null;
    const mapCenterText = centerToYou !== null && centerToYou < 5 && usersLocation.data
      ? usersLocation.data.text : 'the map center';
    queryText = (
      <NoResults
        dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-search-map-text', {
            'map-center-text': mapCenterText,
          }),
        }}
      />
    );
    noResultsText = windowWidth < mobileSize
      ? getFluentString('mountain-search-no-results-mobile', {
        'map-center-text': mapCenterText,
      })
      : getFluentString('mountain-search-no-results-map');
  } else if (searchQuery) {
    variables = { searchQuery, pageNumber, nPerPage };
    GQL_QUERY = SEARCH_MOUNTAINS;
    queryText = (
      <NoResults
        dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-search-query-desc', {
            'search-query': searchQuery,
          }),
        }}
      />
    );
    noResultsText = getFluentString('global-text-value-no-results-found');
  } else if (usersLocation.data && usersLocation.data.preciseCoordinates && !usersLocation.data.localCoordinates) {
    variables = {
      latitude: usersLocation.data.preciseCoordinates.lat,
      longitude: usersLocation.data.preciseCoordinates.lng,
      latDistance: 0.3,
      longDistance: 0.4,
      limit: 500,
    };
    GQL_QUERY = GET_NEARBY_MOUNTAINS;
    noResultsText = windowWidth < mobileSize
      ? getFluentString('mountain-search-no-results-mobile', {
        'map-center-text': usersLocation.data.text,
      })
      : getFluentString('mountain-search-no-results-map');
    queryText = (
      <NoResults
        dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-search-map-text', {
            'map-center-text': usersLocation.data.text,
          }),
        }}
      />
    );
  } else if (usersLocation.error) {
    GQL_QUERY = SEARCH_MOUNTAINS;
    variables = { searchQuery, pageNumber, nPerPage };
    queryText = (
      <NoResults
        dangerouslySetInnerHTML={{
          __html: getFluentString('mountain-search-query-desc', {
            'search-query': searchQuery,
          }),
        }}
      />
    );
    noResultsText = getFluentString('global-text-value-no-results-found');
  } else {
    GQL_QUERY = SEARCH_MOUNTAINS;
    variables = { searchQuery: 'search-should-return-no-results-', pageNumber, nPerPage: 1 };
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
  if (loading === true && ((!mapCenter && !dataToUse) || searchQuery)) {
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
  } else if (dataToUse !== undefined && (searchQuery || mapCenter
      || (usersLocation.error ||
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
      const usersCoords = usersLocation && usersLocation.data ? usersLocation.data.localCoordinates : undefined;
      const extendedMountains: MountainDatumWithDistance[] = rawMountains.map(mtn => {
        const distanceToUser = usersCoords ? getDistanceFromLatLonInMiles({
          lat1: usersCoords.lat, lon1: usersCoords.lng,
          lat2: mtn.latitude, lon2: mtn.longitude,
        }) : null;
        const distanceToMapCenter = mapCenter ? getDistanceFromLatLonInMiles({
          lat1: mapCenter.latitude, lon1: mapCenter.longitude,
          lat2: mtn.latitude, lon2: mtn.longitude,
        }) : null;
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
          {getFluentString('global-text-value-navigation-next')}
        </Next> ) : null;
      const prevBtn = pageNumber > 1 ? (
        <Prev onClick={decrementPageNumber}>
          {getFluentString('global-text-value-navigation-prev')}
        </Prev> ) : null;
      list = (
        <>
          {queryText}
          <ListMountains
            mountainData={mountains}
            noResultsText={noResultsText}
            setHighlighted={updateHiglighted}
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
          onClick={returnToMap}
          text={getFluentString('map-search-back-to-map')}
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
            {getFluentString('mountain-search-mobile-nav-list')}
          </SecondaryNavigationButton>
          <SecondaryNavigationButton
            onClick={() => setMobileView(View.Map)}
            style={{
              color: mobileView === View.Map ? '#fff' : undefined,
              backgroundColor: mobileView === View.Map ? secondaryColor : undefined,
            }}
          >
            <BasicIconInText icon={faMapMarkedAlt} />
            {getFluentString('mountain-search-mobile-nav-map')}
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

  const generalMountainStyles: React.CSSProperties | undefined = !Types.ObjectId.isValid(id)
    ? {height: '100%'}
    : {visibility: 'hidden', position: 'absolute', pointerEvents: 'none', bottom: 0};

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
      {mapSearchToggleBar}
      <ContentLeftSmall style={mobileSearchStyles}>
        <SearchContainer>
          <StandardSearch
            placeholder={getFluentString('global-text-value-search-mountains')}
            setSearchQuery={searchMountains}
            focusOnMount={true}
            initialQuery={initialSearchQuery}
          />
        </SearchContainer>
        <ContentBody ref={listContainerElm} style={{paddingTop: 0}}>
          {list}
          {addMountainButton}
        </ContentBody>
      </ContentLeftSmall>
      <ContentRightLarge style={mobileMapStyles}>
        {backButton}
        <ContentBody>
          <MountainDetail userId={userId} id={mountainId} peakListId={null} setOwnMetaData={true} />
          <div style={generalMountainStyles}>
            <GeneralMap
              getMapCenter={setMapCenter}
              visible={(!Types.ObjectId.isValid(id)).toString() + windowWidth + mobileView}
              highlighted={highlighted}
            />
          </div>
        </ContentBody>
      </ContentRightLarge>
    </>
  );
};

export default withRouter(MountainSearchPage);
