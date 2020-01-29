import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, {useState} from 'react';
import styled from 'styled-components';
import {
  lightBaseColor,
  lightBlue,
  lightBorderColor,
  tertiaryColor,
  placeholderColor,
} from '../../../../styling/styleUtils';
import { Mountain } from '../../../../types/graphQLTypes';
import {getDistanceFromLatLonInMiles} from '../../../../Utils';
import StandardSearch from '../../../sharedComponents/StandardSearch';
import { CheckboxList } from './MountainCompletionModal';
import sortBy from 'lodash/sortBy';

const TwoColumnRoot = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 200px;
  grid-column-gap: 1rem;
`;

const EmptyContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  font-style: italic;
  color: ${placeholderColor};
`;

const CheckboxContainer = styled.div`
  background-color: ${tertiaryColor};
`;

const MountainItem = styled.div`
  display: block;
  position: relative;
  padding: 0.5rem;
  padding-right: 2rem;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  &:not(:last-child) {
    border-bottom: 1px solid ${lightBorderColor};
  }

  &:hover {
    cursor: pointer;
    background-color: ${lightBlue};
  }

  &:after {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0.4rem;
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    color: ${lightBaseColor};
  }
`;

const MountainItemAdd = styled(MountainItem)`
  &:after {
    content: '+';
  }
`;
const MountainItemRemove = styled(MountainItem)`
  &:after {
    content: '×';
  }
`;

const Subtitle = styled.small`
  color: ${lightBaseColor};
`;

const SearchContainer = styled.div`
  margin-top: 1rem;
`;

const SEARCH_MOUNTAINS = gql`
  query SearchMountains(
    $targetMountainId: ID,
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
        name
        abbreviation
        regions {
          id
          name
          states {
            id
          }
        }
      }
      elevation
      latitude
      longitude
    }

    targetMountain: mountain(id: $targetMountainId) {
      id
      latitude
      longitude
    }
  }
`;

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: Mountain['state'];
  elevation: Mountain['elevation'];
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
}

interface SuccessResponse {
  mountains: MountainDatum[];
  targetMountain: null | {
    id: Mountain['id'];
    latitude: Mountain['latitude'];
    longitude: Mountain['longitude'];
  };
}

interface Variables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
  targetMountainId: Mountain['id'] | null;
}

interface Props {
  targetMountainId: Mountain['id'] | null;
  selectedMountains: MountainDatum[];
  setSelectedMountains: (mountains: MountainDatum[]) => void;
  expandedLayout?: boolean;
}

const AdditionalMountains = (props: Props) => {
  const {
    targetMountainId, selectedMountains, setSelectedMountains, expandedLayout,
  } = props;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchSelectedQuery, setSearchSelectedQuery] = useState<string>('');

  const pageNumber = 1;
  const nPerPage = 30;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_MOUNTAINS, {
    variables: { searchQuery, pageNumber, nPerPage, targetMountainId },
  });

  const addMountainToList = (newMtn: MountainDatum) => {
    if (!selectedMountains.find(mtn => mtn.id === newMtn.id)) {
      setSelectedMountains([...selectedMountains, newMtn]);
    }
  };

  const removeMountainFromList = (mtnToRemove: MountainDatum) => {
    const updatedMtnList = selectedMountains.filter(mtn => mtn.id !== mtnToRemove.id);
    setSelectedMountains([...updatedMtnList]);
  };

  const emptySearchResults = expandedLayout === true ? null : null;
  const listStyle: React.CSSProperties = expandedLayout === true ? {margin: 0} : {};

  let searchResults: React.ReactElement<any> | null;
  let selectedMountainList: Array<React.ReactElement<any> | null> | null;
  if (loading === true) {
    searchResults = emptySearchResults;
    selectedMountainList = null;
  } else if (error !== undefined) {
    console.error(error);
    searchResults = emptySearchResults;
    selectedMountainList = null;
  } else if (data !== undefined ) {
    const { targetMountain, mountains } = data;
    const sortedSelectedMountains = sortBy(selectedMountains, ['name']);
    selectedMountainList = sortedSelectedMountains.map(mtn => {
      if (searchSelectedQuery === '' || mtn.name.toLowerCase().includes(searchSelectedQuery.toLowerCase())) {
        const distance = targetMountain ? ' | ' + parseFloat(getDistanceFromLatLonInMiles({
          lat1: targetMountain.latitude,
          lon1: targetMountain.longitude,
          lat2: mtn.latitude,
          lon2: mtn.longitude,
        }).toFixed(2)) + ' mi away' : '';
        return (
          <MountainItemRemove
            onClick={() => removeMountainFromList(mtn)}
            key={mtn.id}
          >
            {mtn.name}
            <Subtitle>
              {mtn.state ? mtn.state.abbreviation + ' | ' : ''}
              {mtn.elevation + 'ft' }
              {distance}
            </Subtitle>
          </MountainItemRemove>
        );
      } else {
        return null;
      }
    });
    if (searchQuery) {
      const mountainList: Array<React.ReactElement<any>> = [];
      mountains.forEach(mtn => {
        if (!selectedMountains.find(m => m.id === mtn.id)
            && mtn.id !== targetMountainId) {
          const distance = targetMountain ? ' | ' + parseFloat(getDistanceFromLatLonInMiles({
            lat1: targetMountain.latitude,
            lon1: targetMountain.longitude,
            lat2: mtn.latitude,
            lon2: mtn.longitude,
          }).toFixed(2)) + ' mi away' : '';
          mountainList.push(
            <MountainItemAdd
              onClick={() => addMountainToList(mtn)}
              key={mtn.id}
            >
              {mtn.name}
              <Subtitle>
                {mtn.state ? mtn.state.abbreviation + ' | ' : ''}
                {mtn.elevation + 'ft' }
                {distance}
              </Subtitle>
            </MountainItemAdd>,
          );
        } else {
          return null;
        }
      });
      if (mountainList.length !== 0) {
        searchResults = (
          <CheckboxList style={listStyle}>{mountainList}</CheckboxList>
        );
      } else {
        searchResults = emptySearchResults;
      }
    } else {
      searchResults = emptySearchResults;
    }
  } else {
    searchResults = emptySearchResults;
    selectedMountainList = null;
  }

  const selectedMountainsContainer = selectedMountainList && selectedMountainList.length ? (
    <CheckboxList style={listStyle}>
      {selectedMountainList}
    </CheckboxList>
  ) : null;

  let output: React.ReactElement<any>
  if (expandedLayout === true) {
    const total = selectedMountainList && selectedMountainList.length ? selectedMountainList.length : 0;
    const searchResultsContent = searchResults !== null ? searchResults : (
      <EmptyContent>Use the search bar above to find and add mountains to this list</EmptyContent>
    );
    const selectedMountainsContent = selectedMountainsContainer !== null ? selectedMountainsContainer : (
      <EmptyContent>Selected mountains will show up here. You haven't selected any yet.</EmptyContent>
    );
    output = (
      <TwoColumnRoot>
        <div style={{gridRow: 1, gridColumn: 1}}>
          <StandardSearch
            placeholder='Search mountains to add'
            setSearchQuery={setSearchQuery}
            focusOnMount={false}
            initialQuery={searchQuery}
          />
        </div>
        <CheckboxContainer style={{gridRow: 2, gridColumn: 1}}>
          {searchResultsContent}
        </CheckboxContainer>
        <div style={{gridRow: 1, gridColumn: 2}}>
          <StandardSearch
            placeholder={`Selected mountains (${total} total)`}
            setSearchQuery={setSearchSelectedQuery}
            focusOnMount={false}
            initialQuery={searchSelectedQuery}
          />
        </div>
        <CheckboxContainer style={{gridRow: 2, gridColumn: 2}}>
          {selectedMountainsContent}
        </CheckboxContainer>
      </TwoColumnRoot>
    );
  } else {
    output = (
      <>
        {selectedMountainsContainer}
        <SearchContainer>
          <StandardSearch
            placeholder='Search mountains'
            setSearchQuery={setSearchQuery}
            focusOnMount={false}
            initialQuery={searchQuery}
          />
        </SearchContainer>
        {searchResults}
      </>
    );
  }
  return output;
};

export default AdditionalMountains;
