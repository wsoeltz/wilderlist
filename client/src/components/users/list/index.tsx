import { gql, useQuery } from '@apollo/client';
import { GetString } from 'fluent-react/compat';
import { Types } from 'mongoose';
import queryString from 'query-string';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
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
      hideProfilePicture
    }
    me: user(id: $id) {
      id
      friends {
        user {
          id
          name
          profilePictureUrl
          hideProfilePicture
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
  }, [userListContainerElm, pageNumber]);

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 5; i++) {
      loadingCards.push(<GhostUserCard key={i} />);
    }
    list = <>{loadingCards}</>;
  } else if (error !== undefined) {
    console.error(error);
    list = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { users, me: {friends} } = data;
    let userData: UserDatum[] | null;
    if (searchQuery === '') {
      const friendsData = friends.map(({user}) => user);
      if (friendsData && friendsData.length) {
        userData = friendsData;
      } else {
        userData = null;
      }
    } else {
      userData = users;
    }
    const nextBtn = searchQuery !== '' && userData && userData.length === nPerPage ? (
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
    const noFriendsText = getFluentString('dashboard-empty-state-no-friends-text');
    list = (
      <>
        <ListUsers
          userData={userData}
          showCurrentUser={false}
          currentUserId={userId}
          friendsList={friends}
          noResultsText={noResultsText}
          noFriendsText={noFriendsText}
          openInSidebar={true}
          sortByStatus={false}
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
      <Helmet>
        <title>{getFluentString('meta-data-friend-search-default-title')}</title>
      </Helmet>
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
