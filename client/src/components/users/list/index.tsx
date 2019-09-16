import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import { Types } from 'mongoose';
import queryString from 'query-string';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { friendsWithUserProfileLink } from '../../../routing/Utils';
import {
  ContentBody,
  ContentLeftSmall,
  ContentRightLarge,
  SearchContainer,
} from '../../../styling/Grid';
import {
  Next,
  PaginationContainer,
  PlaceholderText,
  Prev,
} from '../../../styling/styleUtils';
import { User } from '../../../types/graphQLTypes';
import StandardSearch from '../../sharedComponents/StandardSearch';
import UserProfile from '../detail/UserProfile';
import GhostUserCard from './GhostUserCard';
import { FriendDatum, UserDatum } from './ListUsers';
import ListUsers from './ListUsers';

const SEARCH_USERS = gql`
  query searchUsers(
    $id: ID!
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!
  ) {
    users: usersSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      profilePictureUrl
      peakLists {
        id
        shortName
        type
        mountains {
          id
        }
        parent {
          id
          mountains {
            id
          }
        }
      }
      mountains {
        mountain {
          id
          name
        }
        dates
      }
    }
    me: user(id: $id) {
      id
      friends {
        user {
          id
        }
        status
      }
    }
  }
`;

interface QuerySuccessResponse {
  users: UserDatum[];
  me: {
    id: User['id'];
    friends: FriendDatum[];
  };
}

interface QueryVariables {
  id: string;
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}

interface Props extends RouteComponentProps {
  userId: string;
}

const UserList = (props: Props) => {
  const { userId, match, history, location } = props;
  const { id }: any = match.params;
  const { query, page } = queryString.parse(location.search);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const incrementPageNumber = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    const url = friendsWithUserProfileLink(id) + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };
  const decrementPageNumber = () => {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    const url = friendsWithUserProfileLink(id) + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };
  const nPerPage = 15;

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

  const searchUsers = (value: string) => {
    setSearchQuery(value);
    setPageNumber(1);
    const url = friendsWithUserProfileLink(id) + '?query=' + value + '&page=' + 1;
    history.push(url);
  };

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(SEARCH_USERS, {
    variables: { id: userId, searchQuery, pageNumber, nPerPage },
  });

  const userListContainerElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = userListContainerElm.current;
    if (node) {
      node.scrollTop = 0;
    }
  }, [userListContainerElm, data]);

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < nPerPage; i++) {
      loadingCards.push(<GhostUserCard key={i} />);
    }
    list = <>{loadingCards}</>;
  } else if (error !== undefined) {
    console.error(error);
    list = null;
  } else if (data !== undefined) {
    const { users, me: {friends} } = data;
    const nextBtn = users.length === nPerPage ? (
      <Next onClick={incrementPageNumber}>
        {getFluentString('global-text-value-navigation-next')}
      </Next> ) : null;
    const prevBtn = pageNumber > 1 ? (
      <Prev onClick={decrementPageNumber}>
        {getFluentString('global-text-value-navigation-prev')}
      </Prev> ) : null;
    const noResultsText = getFluentString('global-text-value-no-users-found-for-term', {
      term: searchQuery,
    });
    list = (
      <>
        <ListUsers
          userData={users}
          showCurrentUser={false}
          currentUserId={userId}
          friendsList={friends}
          noResultsText={noResultsText}
        />
        <PaginationContainer>
          {prevBtn}
          {nextBtn}
        </PaginationContainer>
      </>
    );
  } else {
    list = null;
  }
  const userProfile = !Types.ObjectId.isValid(id)
  ? (
      <PlaceholderText>
        {getFluentString('user-list-no-user-selected-text')}
      </PlaceholderText>
    )
  : (
    <UserProfile userId={userId} id={id} history={history} />
    );
  return (
    <>
      <ContentLeftSmall>
        <SearchContainer>
          <StandardSearch
            placeholder='Search users'
            setSearchQuery={searchUsers}
            focusOnMount={true}
            initialQuery={initialSearchQuery}
          />
        </SearchContainer>
        <ContentBody ref={userListContainerElm}>
          {list}
        </ContentBody>
      </ContentLeftSmall>
      <ContentRightLarge>
        <ContentBody>
          {userProfile}
        </ContentBody>
      </ContentRightLarge>
    </>
  );
};

export default withRouter(UserList);
