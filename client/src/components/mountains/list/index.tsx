import { useQuery } from '@apollo/react-hooks';
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
import { Routes } from '../../../routing/routes';
import { searchMountainsDetailLink } from '../../../routing/Utils';
import {
  ContentBody,
  ContentHeader,
  ContentLeftSmall,
  ContentRightLarge,
  SearchContainer,
} from '../../../styling/Grid';
import {
  FloatingButton,
  FloatingButtonContainer,
  Next,
  NoResults,
  PaginationContainer,
  PlaceholderText,
  PlusIcon,
  Prev,
} from '../../../styling/styleUtils';
import {getDistanceFromLatLonInMiles} from '../../../Utils';
import {AppContext} from '../../App';
import BackButton from '../../sharedComponents/BackButton';
import StandardSearch from '../../sharedComponents/StandardSearch';
import MountainDetail from '../detail/MountainDetail';
import GeneralMap from './GeneralMap';
import GhostMountainCard from './GhostMountainCard';
import ListMountains, { MountainDatum } from './ListMountains';

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
    $latitude: Float!, $longitude: Float!, $latDistance: Float!, $longDistance: Float!) {
  mountains: nearbyMountains(
    latitude: $latitude,
    longitude: $longitude,
    latDistance: $latDistance,
    longDistance: $longDistance,
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
}
type Variables = SearchVariables | LocationVariables;

interface MountainDatumWithDistance extends MountainDatum {
  distanceToUser: number | null;
  distanceToMapCenter: number | null;
}

interface Props extends RouteComponentProps {
  userId: string | null;
  mountainPermissions: number | null;
}

const MountainSearchPage = (props: Props) => {
  const { userId, mountainPermissions, match, location, history } = props;
  const { id }: any = match.params;
  const { query, page } = queryString.parse(location.search);

  const {usersLocation} = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);

  const initialMapCenter = usersLocation && usersLocation.data && usersLocation.data.coordinates
    ? {latitude: usersLocation.data.coordinates.lat, longitude: usersLocation.data.coordinates.lng}
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
    if (mapCenter === undefined && usersLocation && usersLocation.data && usersLocation.data.coordinates) {
      const {lat, lng} = usersLocation.data.coordinates;
      setMapCenter({latitude: lat, longitude: lng});
    }
  }, [usersLocation, mapCenter]);

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
  if (!query && mapCenter) {
    variables = {
      latitude: mapCenter.latitude,
      longitude: mapCenter.longitude,
      latDistance: 0.4,
      longDistance: 0.5,
    };
    GQL_QUERY = GET_NEARBY_MOUNTAINS;
    queryText = (
      <NoResults>Showing mountains within <strong>70 miles</strong> of the map center</NoResults>
    );
    noResultsText = 'No mountains found here. Try moving the map or using the search above.';
  } else {
    variables = { searchQuery, pageNumber, nPerPage };
    GQL_QUERY = SEARCH_MOUNTAINS;
    queryText = (
      <NoResults>Showing mountains for query <strong>{searchQuery}</strong>.</NoResults>
    );
    noResultsText = getFluentString('global-text-value-no-results-found');
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
  if ((loading === true || (!searchQuery && !mapCenter)) && (dataToUse === undefined && !searchQuery)) {
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
  } else if (dataToUse !== undefined && (searchQuery || mapCenter)) {
    if (!dataToUse.mountains) {
      list = null;
    } else {
      const rawMountains = dataToUse.mountains;
      const usersCoords = usersLocation && usersLocation.data ? usersLocation.data.coordinates : undefined;
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
      if (!query) {
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
          />
          <PaginationContainer>
            {prevBtn}
            {nextBtn}
          </PaginationContainer>
        </>
      );
    }
  } else {
    list = null;
  }

  const backButton = !Types.ObjectId.isValid(id)
    ? null
    : (
      <ContentHeader>
        <BackButton
          onClick={() => {
            history.push(searchMountainsDetailLink('search') + '?query=' + searchQuery + '&page=' + pageNumber);
          }}
          text={'Back to Map'}
        />
      </ContentHeader>
    );

  const mountainId = !Types.ObjectId.isValid(id)
    ? null
    : id;

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
      <ContentLeftSmall>
        <SearchContainer>
          <StandardSearch
            placeholder={getFluentString('global-text-value-search-mountains')}
            setSearchQuery={searchMountains}
            focusOnMount={true}
            initialQuery={initialSearchQuery}
          />
        </SearchContainer>
        <ContentBody ref={listContainerElm}>
          {list}
          {addMountainButton}
        </ContentBody>
      </ContentLeftSmall>
      <ContentRightLarge>
        {backButton}
        <ContentBody>
          <MountainDetail userId={userId} id={mountainId} peakListId={null} setOwnMetaData={true} />
          <div style={generalMountainStyles}>
            <GeneralMap
              getMapCenter={setMapCenter}
              visible={!Types.ObjectId.isValid(id)}
            />
          </div>
        </ContentBody>
      </ContentRightLarge>
    </>
  );
};

export default withRouter(MountainSearchPage);
