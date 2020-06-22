import { useMutation, useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import { Types } from 'mongoose';
import queryString from 'query-string';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { Routes } from '../../../routing/routes';
import { searchListDetailLink } from '../../../routing/Utils';
import {
  ContentBody,
  ContentLeftLarge,
  ContentLeftSmall,
  ContentRightLarge,
  ContentRightSmall,
  SearchContainer,
} from '../../../styling/Grid';
import {
  ButtonTertiary,
  FloatingButton,
  FloatingButtonContainer,
  GhostButton,
  lightBlue,
  Next,
  PaginationContainer,
  PlaceholderText,
  PlusIcon,
  Prev,
} from '../../../styling/styleUtils';
import { PeakList, User } from '../../../types/graphQLTypes';
import GhostMountainCard from '../../mountains/list/GhostMountainCard';
import StandardSearch from '../../sharedComponents/StandardSearch';
import PeakListDetail from '../detail/PeakListDetail';
import GhostPeakListCard from './GhostPeakListCard';
import ListPeakLists, { CardPeakListDatum, CompactPeakListDatum } from './ListPeakLists';

export const SearchAndFilterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

export const SelectButton = styled(ButtonTertiary)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  padding-right: 0;
`;

export const LocationText = styled.div`
  margin-left: 0.4rem;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MapIcon = styled(FontAwesomeIcon)`
  font-size: 1rem;
  opacity: 0.5;
`;

const ViewModeContainer = styled.div`
  display: flex;
`;

const ViewModeButton = styled(GhostButton)`
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:first-child {
    margin-left: 0.5rem;
  }
`;

const ListIcon = styled(FontAwesomeIcon)`
  font-size: 1.1rem;
`;

export const SEARCH_PEAK_LISTS = gql`
  query SearchPeakLists(
    $userId: ID,
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
  ) {
    peakLists: peakListsSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      shortName
      type
      parent {
        id
      }
      numMountains
      numCompletedAscents(userId: $userId)
      latestAscent(userId: $userId)
      isActive(userId: $userId)
      states {
        id
        name
        regions {
          id
          name
          states {
            id
          }
        }
      }
    }
  }
`;
const SEARCH_PEAK_LISTS_COMPACT = gql`
  query SearchPeakLists(
    $userId: ID,
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
  ) {
    peakLists: peakListsSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      shortName
      type
      numMountains
      numCompletedAscents(userId: $userId)
      latestAscent(userId: $userId)
      isActive(userId: $userId)
      states {
        id
        name
        regions {
          id
          name
          states {
            id
          }
        }
      }
    }
  }
`;

export const getRefetchSearchQueries = (userId: string) => [
  {query: SEARCH_PEAK_LISTS, variables: {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: cardViewNPerPage,
    userId,
  }},
  {query: SEARCH_PEAK_LISTS_COMPACT, variables: {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: compactViewNPerPage,
    userId,
  }},
];

export interface CardSuccessResponse {
  peakLists: CardPeakListDatum[];
  user: null | {
    id: User['id'];
    peakLists: Array<{
      id: PeakList['id'];
    }>
  };
}

interface CompactSuccessResponse {
  peakLists: CompactPeakListDatum[];
  user: null | {
    id: User['id'];
    peakLists: Array<{
      id: PeakList['id'];
    }>
  };
}

type SuccessResponse = CardSuccessResponse | CompactSuccessResponse;

export interface Variables {
  userId: string | null;
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}

export const ADD_PEAK_LIST_TO_USER = gql`
  mutation addPeakListToUser($userId: ID!, $peakListId: ID!) {
    addPeakListToUser(userId: $userId, peakListId: $peakListId) {
      id
      peakLists {
        id
        name
        shortName
        type
        parent {
          id
        }
        numMountains
        numCompletedAscents(userId: $userId)
        latestAscent(userId: $userId)
        isActive(userId: $userId)
      }
    }
  }
`;

export type AddRemovePeakListSuccessResponse = null | {
  id: User['id'];
  peakLists: {
    id: PeakList['id'];
  };
};

export interface AddRemovePeakListVariables {
  userId: string | null;
  peakListId: string;
}

export enum ViewMode {
  Card = 'Card',
  Compact = 'Compact',
}

const localStorageViewModeVariable = 'listPeakListLocalStorageViewModeVariable';
const cardViewNPerPage = 15;
const compactViewNPerPage = 50;

interface Props extends RouteComponentProps {
  userId: string | null;
  peakListPermissions: number | null;
}

const PeakListPage = (props: Props) => {
  const { userId, peakListPermissions, match, location, history } = props;
  const { id }: any = match.params;
  const { query, page, origin } = queryString.parse(location.search);

  const initialViewMode = ( (origin && origin === 'dashboard')
    || localStorage.getItem(localStorageViewModeVariable) === ViewMode.Card)
    ? ViewMode.Card : ViewMode.Compact;
  const initialNPerPage = ( (origin && origin === 'dashboard')
    || localStorage.getItem(localStorageViewModeVariable) === ViewMode.Card)
    ? cardViewNPerPage : compactViewNPerPage;

  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [nPerPage, setNPerPage] = useState<number>(initialNPerPage);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);

  const incrementPageNumber = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    const url = searchListDetailLink(id) + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };
  const decrementPageNumber = () => {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    const url = searchListDetailLink(id) + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };

  const setViewToCard = () => {
    if (viewMode === ViewMode.Compact) {
      localStorage.setItem(localStorageViewModeVariable, ViewMode.Card);
      setViewMode(ViewMode.Card);
      setNPerPage(cardViewNPerPage);
    }
  };
  const setViewToCompact = () => {
    if (viewMode === ViewMode.Card) {
      localStorage.setItem(localStorageViewModeVariable, ViewMode.Compact);
      setViewMode(ViewMode.Compact);
      setNPerPage(compactViewNPerPage);
    }
  };

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
  const searchPeakLists = (value: string) => {
    setSearchQuery(value);
    setPageNumber(1);
    const url = searchListDetailLink(id) + '?query=' + value + '&page=' + 1;
    history.push(url);
  };

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const graphQLQuery = viewMode === ViewMode.Card ? SEARCH_PEAK_LISTS : SEARCH_PEAK_LISTS_COMPACT;

  const graphQLVariables = {
    searchQuery,
    pageNumber,
    nPerPage,
    userId,
  };

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(graphQLQuery, {
    variables: {...graphQLVariables},
  });

  const listContainerElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listContainerElm.current;
    if (node) {
      node.scrollTop = 0;
    }
  }, [listContainerElm, pageNumber]);

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER, {
      refetchQueries: () => [{query: graphQLQuery, variables: {...graphQLVariables}}],
    });
  const beginList = userId ? (peakListId: string) => addPeakListToUser({variables: {userId,  peakListId}}) : null;

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    const GhostCard = viewMode === ViewMode.Card ? GhostPeakListCard : GhostMountainCard;
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostCard key={i} />);
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
    const { peakLists, user } = data;
    if (!peakLists) {
      list = (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const usersLists = user ? user.peakLists.map(peakList => peakList.id) : null;
      const nextBtn = peakLists.length === nPerPage ? (
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
      let listElm: React.ReactElement<any> | null;
      if (viewMode === ViewMode.Card) {
        const {peakLists: peakListData} = data as CardSuccessResponse;
        listElm = (
          <ListPeakLists
            viewMode={ViewMode.Card}
            peakListData={peakListData}
            userListData={usersLists}
            listAction={beginList}
            actionText={'Begin List'}
            profileId={undefined}
            noResultsText={noResultsText}
            showTrophies={false}
          />
        );
      } else if (viewMode === ViewMode.Compact) {
        const {peakLists: peakListData} = data as CompactSuccessResponse;
        listElm = (
          <ListPeakLists
            viewMode={ViewMode.Compact}
            peakListData={peakListData}
            userListData={usersLists}
            listAction={beginList}
            actionText={'Begin List'}
            profileId={undefined}
            noResultsText={noResultsText}
            showTrophies={false}
          />
        );
      } else {
        listElm = null;
      }
      list = (
        <>
          {listElm}
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

  const listDetail = !Types.ObjectId.isValid(id)
    ? (
        <PlaceholderText>{getFluentString('list-search-list-detail-placeholder')}</PlaceholderText>
      )
    : (
        <PeakListDetail
          userId={userId}
          id={id}
          mountainId={undefined}
          queryRefetchArray={[{query: graphQLQuery, variables: {...graphQLVariables}}]}
          setOwnMetaData={true}
        />
      );

  const ListContainer = viewMode === ViewMode.Card ? ContentLeftLarge : ContentLeftSmall;
  const DetailContainer = viewMode === ViewMode.Card ? ContentRightSmall : ContentRightLarge;

  const addMountainButton = userId && peakListPermissions !== -1 ? (
    <FloatingButtonContainer>
      <FloatingButton to={Routes.CreateList}>
        <PlusIcon>+</PlusIcon> {getFluentString('create-peak-list-title-create')}
      </FloatingButton>
    </FloatingButtonContainer>
  ) : null;

  const metaDescription = getFluentString('meta-data-peak-list-search-description');

  return (
    <>
      <Helmet>
        <title>{getFluentString('meta-data-list-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getFluentString('meta-data-list-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + searchListDetailLink('search')} />
      </Helmet>
      <ListContainer>
        <SearchContainer>
          <SearchAndFilterContainer>
            <StandardSearch
              placeholder={getFluentString('global-text-value-search-hiking-lists')}
              setSearchQuery={searchPeakLists}
              focusOnMount={true}
              initialQuery={initialSearchQuery}
            />
            <ViewModeContainer>
              <ViewModeButton
                onClick={setViewToCard}
                style={{
                  backgroundColor: viewMode === ViewMode.Card ? lightBlue : undefined,
                }}
              >
                {getFluentString('global-text-value-detail-view')}
                <ListIcon icon='th-list' />
              </ViewModeButton>
              <ViewModeButton
                onClick={setViewToCompact}
                style={{
                  backgroundColor: viewMode === ViewMode.Compact ? lightBlue : undefined,
                }}
              >
                {getFluentString('global-text-value-list-view')}
                <ListIcon icon='list' />
              </ViewModeButton>
            </ViewModeContainer>
          </SearchAndFilterContainer>
        </SearchContainer>
        <ContentBody ref={listContainerElm}>
          {list}
          {addMountainButton}
        </ContentBody>
      </ListContainer>
      <DetailContainer>
        <ContentBody>
          {listDetail}
        </ContentBody>
      </DetailContainer>
    </>
  );
};

export default withRouter(PeakListPage);
