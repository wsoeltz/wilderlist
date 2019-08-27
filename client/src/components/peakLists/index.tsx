import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../styling/Grid';
import { standardContainerPadding } from '../../styling/styleUtils';
import {
  ButtonSecondary,
} from '../../styling/styleUtils';
import StandardSearch from '../sharedComponents/StandardSearch';
import ListPeakLists from './ListPeakLists';
import { PeakListDatum } from './ListPeakLists';

const SearchContainer = styled(ContentHeader)`
  padding: ${standardContainerPadding};
`;

const Next = styled(ButtonSecondary)`
`;
const Prev = styled(ButtonSecondary)`
`;

const SEARCH_PEAK_LISTS = gql`
  query SearchPeakLists(
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
  }
`;

interface SuccessResponse {
  peakLists: PeakListDatum[];
}

interface Variables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}

const PeakListPage = () => {
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
    variables: { searchQuery, pageNumber, nPerPage },
  });

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    list = <>Loading</>;
  } else if (error !== undefined) {
    console.error(error);
    list = (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { peakLists } = data;
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
          selected peak list content
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default PeakListPage;
