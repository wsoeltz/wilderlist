import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import {
  ContentBody,
  ContentLeftSmall,
  ContentRightLarge,
  SearchContainer,
} from '../../styling/Grid';
import {
  ButtonSecondary,
} from '../../styling/styleUtils';
import { User } from '../../types/graphQLTypes';
import StandardSearch from '../sharedComponents/StandardSearch';
import { FriendDatum, UserDatum } from './ListUsers';
import ListUsers from './ListUsers';

const Next = styled(ButtonSecondary)`
`;
const Prev = styled(ButtonSecondary)`
`;

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
  const { userId } = props;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const incrementPageNumber = () => setPageNumber(pageNumber + 1);
  const decrementPageNumber = () => setPageNumber(pageNumber - 1);
  const nPerPage = 15;

  const searchUsers = (value: string) => {
    setSearchQuery(value);
    setPageNumber(1);
  };

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(SEARCH_USERS, {
    variables: { id: userId, searchQuery, pageNumber, nPerPage },
  });

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    list = null;
  } else if (error !== undefined) {
    console.error(error);
    list = null;
  } else if (data !== undefined) {
    const { users, me: {friends} } = data;
    const nextBtn = users.length === nPerPage ? (
      <Next onClick={incrementPageNumber}>
        Next {'>'}
      </Next> ) : null;
    const prevBtn = pageNumber > 1 ? (
      <Prev onClick={decrementPageNumber}>
        {'<'} Previous
      </Prev> ) : null;
    list = (
      <>
        <ListUsers
          userData={users}
          showCurrentUser={false}
          currentUserId={userId}
          friendsList={friends}
        />
        {prevBtn}
        {nextBtn}
      </>
    );
  } else {
    list = null;
  }
  return (
    <>
      <ContentLeftSmall>
        <SearchContainer>
          <StandardSearch
            placeholder='Search users'
            setSearchQuery={searchUsers}
          />
        </SearchContainer>
        <ContentBody>
          {list}
        </ContentBody>
      </ContentLeftSmall>
      <ContentRightLarge>
        <ContentBody>
          <p>selected user profile goes here</p>
        </ContentBody>
      </ContentRightLarge>
    </>
  );
};

export default withRouter(UserList);
