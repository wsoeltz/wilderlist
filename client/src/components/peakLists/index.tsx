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
import { PeakList } from '../../types/graphQLTypes';
import StandardSearch from '../sharedComponents/StandardSearch';

const SearchContainer = styled(ContentHeader)`
  padding: ${standardContainerPadding};
`;

const SEARCH_PEAK_LISTS = gql`
  query SearchPeakLists($searchQuery: String!) {
    peakListsSearch(searchQuery: $searchQuery) {
      id
      name
    }
  }
`;

interface SuccessResponse {
  peakListsSearch: Array<{
    id: PeakList['id'];
    name: PeakList['name'];
  }>;
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
    list = null;
  } else if (error !== undefined) {
    console.error(error);
    list = (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { peakListsSearch } = data;
    const peaks = peakListsSearch.map(({name, id}) => <li key={id}>{name}</li>);
    list = (
      <ul>
        {peaks}
      </ul>
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
