import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../../../contextProviders/getFluentLocalizationContext';
import usePrevious from '../../../../../hooks/usePrevious';
import {
  CheckboxList,
  lightBaseColor,
  lightBlue,
  lightBorderColor,
} from '../../../../../styling/styleUtils';
import { Mountain, State } from '../../../../../types/graphQLTypes';
import {getDistanceFromLatLonInMiles} from '../../../../../Utils';
import StandardSearch from '../../../../sharedComponents/StandardSearch';
import {
  SectionTitle,
} from '../Utils';

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

export const Subtitle = styled.small`
  color: ${lightBaseColor};
`;

const SearchContainer = styled.div`
  margin-top: 1rem;
`;

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
      latitude
      longitude
    }
  }
`;

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
  elevation: Mountain['elevation'];
  latitude: Mountain['latitude'];
  longitude: Mountain['longitude'];
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
  selectedMountains: MountainDatum[];
  setSelectedMountains: (mountains: MountainDatum[]) => void;
}

const AdditionalMountains = (props: Props) => {
  const {
    selectedMountains, setSelectedMountains,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const pageNumber = 1;
  const nPerPage = 30;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_MOUNTAINS, {
    variables: { searchQuery, pageNumber, nPerPage },
  });

  const prevData = usePrevious(data);

  let dataToUse: SuccessResponse | undefined;
  if (data !== undefined) {
    dataToUse = data;
  } else if (prevData !== undefined) {
    dataToUse = prevData;
  } else {
    dataToUse = undefined;
  }

  const addMountainToList = (newMtn: MountainDatum) => {
    if (!selectedMountains.find(mtn => mtn.id === newMtn.id)) {
      setSelectedMountains([...selectedMountains, newMtn]);
    }
  };

  const removeMountainFromList = (mtnToRemove: MountainDatum) => {
    const updatedMtnList = selectedMountains.filter(mtn => mtn.id !== mtnToRemove.id);
    setSelectedMountains([...updatedMtnList]);
  };

  let searchResults: React.ReactElement<any> | null;
  const targetMountain = selectedMountains.length && selectedMountains[0]
    ? selectedMountains[0] : null;
  const selectedMountainList = selectedMountains.map(mtn => {
    const distance = targetMountain && targetMountain.id !== mtn.id
      ? ' | ' + parseFloat(getDistanceFromLatLonInMiles({
        lat1: targetMountain.latitude,
        lon1: targetMountain.longitude,
        lat2: mtn.latitude,
        lon2: mtn.longitude,
      }).toFixed(2)) + ' mi from ' + targetMountain.name : '';
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
  });

  if (dataToUse !== undefined ) {
    const { mountains } = dataToUse;
    if (searchQuery) {
      const mountainList: Array<React.ReactElement<any>> = [];
      mountains.forEach(mtn => {
        if (!selectedMountains.find(m => m.id === mtn.id)) {
          const distance = targetMountain && targetMountain.id !== mtn.id
            ? ' | ' + parseFloat(getDistanceFromLatLonInMiles({
              lat1: targetMountain.latitude,
              lon1: targetMountain.longitude,
              lat2: mtn.latitude,
              lon2: mtn.longitude,
            }).toFixed(2)) + ' mi from ' + targetMountain.name : '';
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
          <CheckboxList>{mountainList}</CheckboxList>
        );
      } else {
        searchResults = null;
      }
    } else {
      searchResults = null;
    }
  } else if (loading === true) {
    searchResults = null;
  } else if (error !== undefined) {
    console.error(error);
    searchResults = null;
  } else {
    searchResults = null;
  }

  const selectedMountainsContainer = selectedMountainList && selectedMountainList.length ? (
    <CheckboxList>
      {selectedMountainList}
    </CheckboxList>
  ) : null;

  return (
    <>
      <SectionTitle>
        {getFluentString('trip-report-add-additional-mtns-title')}
      </SectionTitle>
      <small>
        {getFluentString('trip-report-add-additional-mtns-desc')}
      </small>
      {selectedMountainsContainer}
      <SearchContainer>
        <StandardSearch
          placeholder={getFluentString('global-text-value-search-mountains')}
          setSearchQuery={setSearchQuery}
          focusOnMount={false}
          initialQuery={searchQuery}
        />
      </SearchContainer>
      {searchResults}
    </>
  );
};

export default AdditionalMountains;
