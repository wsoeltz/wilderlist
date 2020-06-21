import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import usePrevious from '../../../hooks/usePrevious';
import {
  ButtonPrimary,
  CheckboxList as CheckboxListBase,
  Label,
  LabelContainer,
  lightBaseColor,
  lightBlue,
  lightBorderColor,
  placeholderColor,
  SelectBox,
  tertiaryColor,
} from '../../../styling/styleUtils';
import { Mountain, State } from '../../../types/graphQLTypes';
import Modal from '../../sharedComponents/Modal';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {ModalButtonWrapper} from '../detail/completionModal/Utils';

export const MountainItem = styled.div`
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

const CheckboxList = styled(CheckboxListBase)`
  max-height: 100%;
`;

const SearchResultsContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
`;

const AdvancedFilterContainer = styled.div`
  background-color: ${tertiaryColor};
  padding: 0.5rem;
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto auto auto;
  grid-column-gap: 0.5rem;
  grid-auto-flow: column;
`;

export const CheckboxContainer = styled.div`
  background-color: ${tertiaryColor};
  overflow: hidden;
`;

export const Subtitle = styled.small`
  color: ${lightBaseColor};
`;

const TwoColumnRoot = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;
  grid-column-gap: 1rem;
  width: 700px;
  max-width: 100%;
`;

const EmptyContent = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 1rem;
  display: flex;
  text-align: center;
  padding: 1rem;
  box-sizing: border-box;
  font-style: italic;
  color: ${placeholderColor};
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

const SEARCH_MOUNTAINS = gql`
  query SearchMountains(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!
    $state: ID,
    $minElevation: Float,
    $maxElevation: Float,
  ) {
    mountains: mountainSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
      state: $state,
      minElevation: $minElevation,
      maxElevation: $maxElevation,
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
  state: string;
  minElevation: number;
  maxElevation: number;
}

interface Props {
  closeAndSetMountains: (mountains: MountainDatum[]) => void;
  initialSelectedMountains: MountainDatum[];
  states: Array<{id: string, abbreviation: string}>;
}

const MountainSelectionModal = (props: Props) => {
  const {
    closeAndSetMountains, initialSelectedMountains, states,
  } = props;

  const [selectedMountains, setSelectedMountains] = useState<MountainDatum[]>(initialSelectedMountains);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [minElevation, setMinElevation] = useState<string>('');
  const [maxElevation, setMaxElevation] = useState<string>('');
  const [searchSelectedQuery, setSearchSelectedQuery] = useState<string>('');

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const pageNumber = 1;
  const nPerPage = 30;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_MOUNTAINS, {
    variables: {
      searchQuery, pageNumber, nPerPage, state,
      minElevation: parseFloat(minElevation), maxElevation: parseFloat(maxElevation),
    },
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

  const emptySearchResults = null;
  const listStyle: React.CSSProperties = {margin: 0};

  let searchResults: React.ReactElement<any> | null;
  if (dataToUse !== undefined ) {
    const { mountains } = dataToUse;
    if (mountains) {
      const mountainList: Array<React.ReactElement<any>> = [];
      mountains.forEach(mtn => {
        if (!selectedMountains.find(m => m.id === mtn.id)) {
          mountainList.push(
            <MountainItemAdd
              onClick={() => addMountainToList(mtn)}
              key={mtn.id}
            >
              {mtn.name}
              <Subtitle>
                {mtn.state ? mtn.state.abbreviation + ' | ' : ''}
                {mtn.elevation + 'ft' }
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
  } else if (loading === true) {
    searchResults = emptySearchResults;
  } else if (error !== undefined) {
    console.error(error);
    searchResults = emptySearchResults;
  } else {
    searchResults = emptySearchResults;
  }

  const sortedSelectedMountains = sortBy(selectedMountains, ['name']);
  const selectedMountainList = sortedSelectedMountains.map(mtn => {
    if (searchSelectedQuery === '' || mtn.name.toLowerCase().includes(searchSelectedQuery.toLowerCase())) {
      return (
        <MountainItemRemove
          onClick={() => removeMountainFromList(mtn)}
          key={mtn.id}
        >
          {mtn.name}
          <Subtitle>
            {mtn.state ? mtn.state.abbreviation + ' | ' : ''}
            {mtn.elevation + 'ft' }
          </Subtitle>
        </MountainItemRemove>
      );
    } else {
      return null;
    }
  });

  const selectedMountainsContainer = selectedMountainList && selectedMountainList.length ? (
    <CheckboxList style={listStyle}>
      {selectedMountainList}
    </CheckboxList>
  ) : null;

  const searchResultsContent = searchResults !== null ? searchResults : (
    <EmptyContent>Use the search bar above to find and add mountains to this list</EmptyContent>
  );
  const selectedMountainsContent = selectedMountainsContainer !== null ? selectedMountainsContainer : (
    <EmptyContent>Selected mountains will show up here. You haven't selected any yet.</EmptyContent>
  );

  const stateFilterOptions = sortBy(states, ['abbreviation']).map(s => (
    <option value={s.id} key={s.id}>
      {s.abbreviation}
    </option>
  ));

  const onClose = () => closeAndSetMountains(selectedMountains);

  const actions = (
    <ModalButtonWrapper>
      <ButtonPrimary onClick={onClose} mobileExtend={true}>
        Done Updating Mountains
      </ButtonPrimary>
    </ModalButtonWrapper>
  );

  return (
    <Modal
      width={'750px'}
      height={'750px'}
      actions={actions}
      onClose={onClose}
    >
      <TwoColumnRoot>
        <div style={{gridRow: 1, gridColumn: 1}}>
          <h3>{getFluentString('create-peak-list-search-mountain-to-add')}</h3>
          <StandardSearch
            placeholder={getFluentString('global-text-value-search-mountains')}
            setSearchQuery={setSearchQuery}
            focusOnMount={false}
            initialQuery={searchQuery}
          />
        </div>
        <SearchResultsContainer style={{gridRow: 2, gridColumn: 1}}>
          <AdvancedFilterContainer>
            <LabelContainer htmlFor={'create-peak-list-mountain-filter-by-state'}>
              <Label>
                <small>{'State'}</small>
              </Label>
            </LabelContainer>
            <SelectBox
              id={'create-peak-list-mountain-filter-by-state'}
              value={state || ''}
              onChange={e => setState(e.target.value)}
              placeholder={getFluentString('global-text-value-tier')}
            >
              <option value=''>All</option>
              {stateFilterOptions}
            </SelectBox>
            <LabelContainer>
              <Label>
                <small>{'Min Elevation'}</small>
              </Label>
            </LabelContainer>
            <StandardSearch
              placeholder={''}
              setSearchQuery={setMinElevation}
              focusOnMount={false}
              initialQuery={minElevation}
              noSearchIcon={true}
            />
            <LabelContainer>
              <Label>
                <small>{'Max Elevation'}</small>
              </Label>
            </LabelContainer>
            <StandardSearch
              placeholder={''}
              setSearchQuery={setMaxElevation}
              focusOnMount={false}
              initialQuery={maxElevation}
              noSearchIcon={true}
            />
          </AdvancedFilterContainer>
          <CheckboxContainer>
            {searchResultsContent}
          </CheckboxContainer>
        </SearchResultsContainer>
        <div style={{gridRow: 1, gridColumn: 2}}>
          <h3>
            {getFluentString('create-peak-list-selected-mountain-count', {total: selectedMountains.length})}
          </h3>
          <StandardSearch
            placeholder={
              getFluentString('global-text-value-search-mountains', {total: selectedMountains.length})
            }
            setSearchQuery={setSearchSelectedQuery}
            focusOnMount={false}
            initialQuery={searchSelectedQuery}
          />
        </div>
        <CheckboxContainer style={{gridRow: 2, gridColumn: 2}}>
          {selectedMountainsContent}
        </CheckboxContainer>
      </TwoColumnRoot>
    </Modal>
  );
};

export default MountainSelectionModal;
