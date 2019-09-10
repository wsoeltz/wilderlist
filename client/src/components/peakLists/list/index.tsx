import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
  SearchContainer,
} from '../../../styling/Grid';
import {
  ButtonSecondary,
} from '../../../styling/styleUtils';
import { PeakList, User } from '../../../types/graphQLTypes';
import StandardSearch from '../../sharedComponents/StandardSearch';
import PeakListDetail from '../detail/PeakListDetail';
import ListPeakLists, { PeakListDatum } from './ListPeakLists';

const Next = styled(ButtonSecondary)`
`;
const Prev = styled(ButtonSecondary)`
`;

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
  const { userId, match } = props;
  const { id }: any = match.params;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const incrementPageNumber = () => setPageNumber(pageNumber + 1);
  const decrementPageNumber = () => setPageNumber(pageNumber - 1);
  const nPerPage = 5;

  const searchPeakLists = (value: string) => {
    setSearchQuery(value);
    setPageNumber(1);
  };

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_PEAK_LISTS, {
    variables: { searchQuery, pageNumber, nPerPage, userId },
  });

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER);
  const beginList = (peakListId: string) => addPeakListToUser({variables: {userId,  peakListId}});

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    list = <>Loading</>;
  } else if (error !== undefined) {
    console.error(error);
    list = (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { peakLists, user } = data;
    const usersLists = user.peakLists.map(peakList => peakList.id);
    const completedAscents = user.mountains !== null ? user.mountains : [];
    const nextBtn = peakLists.length === nPerPage ? (
      <Next onClick={incrementPageNumber}>
        Next {'>'}
      </Next> ) : null;
    const prevBtn = pageNumber > 1 ? (
      <Prev onClick={decrementPageNumber}>
        {'<'} Previous
      </Prev> ) : null;
    list = (
      <>
        <ListPeakLists
          peakListData={peakLists}
          userListData={usersLists}
          listAction={beginList}
          actionText={'Begin List'}
          completedAscents={completedAscents}
          isCurrentUser={true}
        />
        {prevBtn}
        {nextBtn}
      </>
    );
  } else {
    list = null;
  }

  const listDetail = id === undefined
    ? (
        <h2>Click on a list to see more</h2>
      )
    : ( <PeakListDetail userId={userId} id={id} />);

  return (
    <>
      <ContentLeftLarge>
        <SearchContainer>
          <StandardSearch
            placeholder='Search lists'
            setSearchQuery={searchPeakLists}
          />
        </SearchContainer>
        <ContentBody>
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