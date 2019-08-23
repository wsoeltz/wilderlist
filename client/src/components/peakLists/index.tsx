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
import StandardSearch from '../sharedComponents/StandardSearch';
import ListPeakLists from './ListPeakLists';
import { PeakListDatum } from './ListPeakLists';

const SearchContainer = styled(ContentHeader)`
  padding: ${standardContainerPadding};
`;

const SEARCH_PEAK_LISTS = gql`
  query SearchPeakLists($searchQuery: String!) {
    peakLists: peakListsSearch(searchQuery: $searchQuery) {
      id
      name
      shortName
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
`;

interface SuccessResponse {
  peakLists: PeakListDatum[];
}

interface Variables {
  searchQuery: string;
}

const PeakListPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_PEAK_LISTS, {
    variables: { searchQuery },
  });

  let list: React.ReactElement<any> | null;
  if (loading === true) {
    list = <>Loading</>;
  } else if (error !== undefined) {
    console.error(error);
    list = (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { peakLists } = data;
    list = (
      <ListPeakLists peakListData={peakLists} />
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
            setSearchQuery={setSearchQuery}
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
