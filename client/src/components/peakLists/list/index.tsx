import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import { Types } from 'mongoose';
import queryString from 'query-string';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { searchListDetailLink } from '../../../routing/Utils';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
  SearchContainer,
} from '../../../styling/Grid';
import {
  Next,
  PaginationContainer,
  PlaceholderText,
  Prev,
} from '../../../styling/styleUtils';
import { PeakList, User } from '../../../types/graphQLTypes';
import StandardSearch from '../../sharedComponents/StandardSearch';
import PeakListDetail from '../detail/PeakListDetail';
import GhostPeakListCard from './GhostPeakListCard';
import ListPeakLists, { PeakListDatum } from './ListPeakLists';

const SEARCH_PEAK_LISTS = gql`
  query SearchPeakLists(
    $userId: ID!,
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
      mountains {
        id
        state {
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
      parent {
        id
        mountains {
          id
          state {
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
    }
    user(id: $userId) {
      id
      peakLists {
        id
      }
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

interface SuccessResponse {
  peakLists: PeakListDatum[];
  user: {
    id: User['id'];
    peakLists: Array<{
      id: PeakList['id'];
    }>
    mountains: User['mountains'];
  };
}

interface Variables {
  userId: string;
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
      }
    }
  }
`;

export interface AddRemovePeakListSuccessResponse {
  id: User['id'];
  peakLists: {
    id: PeakList['id'];
  };
}

export interface AddRemovePeakListVariables {
  userId: string;
  peakListId: string;
}

interface Props extends RouteComponentProps {
  userId: string;
}

const PeakListPage = (props: Props) => {
  const { userId, match, location, history } = props;
  const { id }: any = match.params;
  const { query, page } = queryString.parse(location.search);

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
  const nPerPage = 5;

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

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_PEAK_LISTS, {
    variables: { searchQuery, pageNumber, nPerPage, userId },
  });

  const listContainerElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listContainerElm.current;
    if (node) {
      node.scrollTop = 0;
    }
  }, [listContainerElm, pageNumber]);

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER);
  const beginList = (peakListId: string) => addPeakListToUser({variables: {userId,  peakListId}});

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < nPerPage; i++) {
      loadingCards.push(<GhostPeakListCard key={i} />);
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
    if (!peakLists || !user) {
      list = (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const usersLists = user.peakLists.map(peakList => peakList.id);
      const completedAscents = user.mountains !== null ? user.mountains : [];
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
      list = (
        <>
          <ListPeakLists
            peakListData={peakLists}
            userListData={usersLists}
            listAction={beginList}
            actionText={'Begin List'}
            completedAscents={completedAscents}
            profileView={false}
            noResultsText={noResultsText}
            showTrophies={false}
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

  const listDetail = !Types.ObjectId.isValid(id)
    ? (
        <PlaceholderText>{getFluentString('list-search-list-detail-placeholder')}</PlaceholderText>
      )
    : ( <PeakListDetail userId={userId} id={id} />);

  return (
    <>
      <ContentLeftLarge>
        <SearchContainer>
          <StandardSearch
            placeholder='Search lists'
            setSearchQuery={searchPeakLists}
            focusOnMount={true}
            initialQuery={initialSearchQuery}
          />
        </SearchContainer>
        <ContentBody ref={listContainerElm}>
          {list}
        </ContentBody>
      </ContentLeftLarge>
      <ContentRightSmall>
        <ContentBody>
          {listDetail}
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(PeakListPage);
