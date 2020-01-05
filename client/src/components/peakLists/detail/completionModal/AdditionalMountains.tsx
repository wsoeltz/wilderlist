import React, {useState} from 'react';
import { Mountain } from '../../../../types/graphQLTypes';
import { CheckboxList } from './MountainCompletionModal'
import { useQuery } from '@apollo/react-hooks';
import StandardSearch from '../../../sharedComponents/StandardSearch';
import gql from 'graphql-tag';

const SEARCH_MOUNTAINS = gql`
  query SearchMountains(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!
  ) {
    mountains: mountainSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      state {
        id
        abbreviation
      }
      elevation
    }
  }
`;

interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: Mountain['state'];
  elevation: Mountain['elevation'];
}

interface SuccessResponse {
  mountains: MountainDatum[];
}

interface Variables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}



interface Props {
  selectedMountains: Mountain[];
  setSelectedMountains: (mountains: Mountain[]) => void;
}

const AdditionalMountains = ({selectedMountains}: Props) => {

  const [searchQuery, setSearchQuery] = useState<string>('');

  const pageNumber = 1;
  const nPerPage = 30;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_MOUNTAINS, {
    variables: { searchQuery, pageNumber, nPerPage },
  });

  let searchResults: React.ReactElement<any> | null;
  if (loading === true) {
    searchResults = null;
  } else if (error !== undefined) {
    console.error(error);
    searchResults = null;
  } else if (data !== undefined && searchQuery) {
    const mountainList = data.mountains.map(mtn => <div>{mtn.name}</div>);
    searchResults = (
      <CheckboxList>{mountainList}</CheckboxList>
    );
  } else {
    searchResults = null;
  }

  const selectedMountainList = selectedMountains.map(mtn => mtn.name);
  return (
    <>
      {selectedMountainList}
      <StandardSearch
        placeholder='Search mountains'
        setSearchQuery={setSearchQuery}
        focusOnMount={false}
        initialQuery={searchQuery}
      />
      {searchResults}
    </>
  );
}

export default AdditionalMountains;