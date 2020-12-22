import { gql, useMutation, useQuery } from '@apollo/client';
import queryString from 'query-string';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import { listDetailLink } from '../../../routing/Utils';
import {
  ContentBody,
  ContentContainer,
} from '../../../styling/Grid';
import {
  LinkButton,
  Next,
  NoResults,
  PaginationContainer,
  PlaceholderText,
  Prev,
} from '../../../styling/styleUtils';
import { PeakList, PeakListVariants, User } from '../../../types/graphQLTypes';
import {mobileSize} from '../../../Utils';
import {AppContext} from '../../App';
import GhostMountainCard from '../../mountains/list/GhostMountainCard';
import ListPeakLists, { CardPeakListDatum, CompactPeakListDatum } from './ListPeakLists';
import MapSelect from './mapSelect';

export const SearchAndFilterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;
const ClearButton = styled(LinkButton)`
  margin-left: 0.5rem;
  font-style: italic;
`;

export const SEARCH_PEAK_LISTS = gql`
  query SearchPeakLists(
    $userId: ID,
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
    $variant: String,
    $selectionArray: [ID],
    $state: ID,
  ) {
    peakLists: peakListsSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
      variant: $variant,
      selectionArray: $selectionArray,
      state: $state,
    ) {
      id
      name
      shortName
      type
      stateOrRegionString
      parent {
        id
      }
      numMountains
      numCompletedAscents(userId: $userId)
      latestAscent(userId: $userId)
      isActive(userId: $userId)
    }
  }
`;
const SEARCH_PEAK_LISTS_COMPACT = gql`
  query SearchPeakLists(
    $userId: ID,
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
    $variant: String,
    $state: ID,
  ) {
    peakLists: peakListsSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
      variant: $variant,
      state: $state,
    ) {
      id
      name
      shortName
      type
      numMountains
      numCompletedAscents(userId: $userId)
      latestAscent(userId: $userId)
      isActive(userId: $userId)
      stateOrRegionString
      parent {
        id
        type
      }
      children {
        id
        type
      }
      siblings {
        id
        type
      }
    }
  }
`;

const compactViewNPerPage = 50;

export const getRefetchSearchQueries = (userId: string) => [
  {query: SEARCH_PEAK_LISTS, variables: {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: 15,
    userId,
    state: null,
  }},
  {query: SEARCH_PEAK_LISTS_COMPACT, variables: {
    searchQuery: '',
    pageNumber: 1,
    nPerPage: compactViewNPerPage,
    userId,
    state: null,
  }},
];

export interface CardSuccessResponse {
  peakLists: CardPeakListDatum[];
}

interface CompactSuccessResponse {
  peakLists: CompactPeakListDatum[];
}

type SuccessResponse = CardSuccessResponse | CompactSuccessResponse;

export interface Variables {
  userId: string | null;
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
  variant: PeakListVariants | null;
  state: string| null;
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

enum View {
  Map,
  List,
}

const PeakListPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const history = useHistory();

  const { query, page } = queryString.parse(history.location.search);
  const {windowWidth} = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedState, setSelectedState] = useState<{id: string, name: string} | null>(null);
  const [mobileView, setMobileView] = useState<View>(View.List);

  const updateSelectedState = useCallback((value: {id: string, name: string} | null) => {
    setSelectedState(value);
    if (windowWidth < mobileSize) {
      setMobileView(View.List);
    }
  }, [windowWidth]);

  const clearSelectedState = useCallback(() => updateSelectedState(null), [updateSelectedState]);

  const incrementPageNumber = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    const url = listDetailLink('search') + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };
  const decrementPageNumber = () => {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    const url = listDetailLink('search') + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };

  useEffect(() => {
    if (typeof query === 'string') {
      setSearchQuery(query);
    }
    if (typeof page === 'string') {
      const pageAsNumber = parseInt(page, 10);
      if (!isNaN(pageAsNumber)) {
        setPageNumber(pageAsNumber);
      }
    }
  }, [query, page]);

  const getString = useFluent();

  const variables = {
    searchQuery,
    pageNumber,
    nPerPage: compactViewNPerPage,
    userId,
    variant: PeakListVariants.standard,
    state: selectedState ? selectedState.id : null,
  };
  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_PEAK_LISTS_COMPACT, {
    variables,
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
      refetchQueries: () => [{query: SEARCH_PEAK_LISTS_COMPACT, variables}],
    });
  const beginList = userId ? (peakListId: string) => addPeakListToUser({variables: {userId,  peakListId}}) : null;

  const queryText = selectedState ? (
    <NoResults>
      <span dangerouslySetInnerHTML={{
          __html: getString('peak-list-search-state', {
            'state-name': selectedState.name,
          }),
        }}
      />
      <ClearButton onClick={clearSelectedState}>
        {getString('global-text-value-clear')}
      </ClearButton>
    </NoResults>
  ) : null;

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
  } else if (data !== undefined) {
    if (mobileView === View.Map && windowWidth < mobileSize) {
      list = (
        <MapSelect
          selectedState={selectedState}
          setSelectedState={updateSelectedState}
        />
      );
    } else {
      const { peakLists } = data;
      if (!peakLists) {
        list = (
          <PlaceholderText>
            {getString('global-error-retrieving-data')}
          </PlaceholderText>
        );
      } else {
        const nextBtn = peakLists.length === compactViewNPerPage ? (
          <Next onClick={incrementPageNumber}>
            {getString('global-text-value-navigation-next')}
          </Next> ) : null;
        const prevBtn = pageNumber > 1 ? (
          <Prev onClick={decrementPageNumber}>
            {getString('global-text-value-navigation-prev')}
          </Prev> ) : null;
        const noResultsText = searchQuery ? getString('global-text-value-no-results-found-for-term', {
          term: searchQuery,
        }) : getString('global-text-value-no-results-found');
        const {peakLists: peakListData} = data as CompactSuccessResponse;
        const listElm = (
          <ListPeakLists
            viewMode={ViewMode.Compact}
            peakListData={peakListData}
            listAction={beginList}
            actionText={getString('peak-list-detail-text-begin-list')}
            profileId={undefined}
            noResultsText={noResultsText}
            showTrophies={false}
            queryRefetchArray={[{query: SEARCH_PEAK_LISTS_COMPACT, variables}]}
          />
        );
        list = (
          <>
            {queryText}
            {listElm}
            <PaginationContainer>
              {prevBtn}
              {nextBtn}
            </PaginationContainer>
          </>
        );
      }
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
      <ContentContainer>
        <ContentBody ref={listContainerElm} style={{paddingTop: queryText ? 0 : undefined}}>
          {list}
        </ContentBody>
      </ContentContainer>
    </>
  );
};

export default PeakListPage;
