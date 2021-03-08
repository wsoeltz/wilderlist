import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import {useHistory, useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import { UserDatum, useUserSearch } from '../../../queries/users/useUserSearch';
import { userProfileLink } from '../../../routing/Utils';
import {
  Next,
  PaginationContainer,
  PlaceholderText,
  Prev,
} from '../../../styling/styleUtils';
import StandardSearch from '../../sharedComponents/StandardSearch';
import GhostUserCard from './GhostUserCard';
import ListUsers from './ListUsers';

const UserList = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const history = useHistory();
  const { id }: any = useParams();
  const { query, page } = queryString.parse(history.location.search);

  const getString = useFluent();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const incrementPageNumber = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    const url = userProfileLink(id) + '?query=' + searchQuery + '&page=' + newPageNumber;
    history.push(url);
  };
  const decrementPageNumber = () => {
    const newPageNumber = pageNumber - 1;
    setPageNumber(newPageNumber);
    const url = userProfileLink(id) + '?query=' + searchQuery + '&page=' + newPageNumber;
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
    const url = userProfileLink(id) + '?query=' + value + '&page=' + 1;
    history.push(url);
  };

  const {loading, error, data} = useUserSearch(userId, searchQuery, pageNumber, nPerPage);

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
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined && userId !== null) {
    const { users, me: {friends} } = data;
    let userData: UserDatum[] | null;
    if (searchQuery === '') {
      const friendsData = friends.map(f => f.user);
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
        {getString('global-text-value-navigation-next')}
      </Next> ) : null;
    const prevBtn = pageNumber > 1 ? (
      <Prev onClick={decrementPageNumber}>
        {getString('global-text-value-navigation-prev')}
      </Prev> ) : null;
    const noResultsText = getString('global-text-value-no-users-found-for-term', {
      term: searchQuery,
    });
    const noFriendsText = getString('dashboard-empty-state-no-friends-text');
    list = (
      <>
        <ListUsers
          userData={userData}
          showCurrentUser={false}
          currentUserId={userId}
          friendsList={friends}
          noResultsText={noResultsText}
          noFriendsText={noFriendsText}
          sortByStatus={true}
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
  return (
    <>
      <Helmet>
        <title>{getString('meta-data-friend-search-default-title')}</title>
      </Helmet>
      <div ref={userListContainerElm}>
        <StandardSearch
          placeholder='Search users'
          setSearchQuery={searchUsers}
          focusOnMount={true}
          initialQuery={initialSearchQuery}
        />
        {list}
      </div>
    </>
  );
};

export default UserList;
