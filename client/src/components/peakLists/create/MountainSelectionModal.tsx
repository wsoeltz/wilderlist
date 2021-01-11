import sortBy from 'lodash/sortBy';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  MountainDatum,
  useBasicSearchMountains,
} from '../../../queries/mountains/useBasicSearchMountains';
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
import Modal from '../../sharedComponents/Modal';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {ModalButtonWrapper} from '../../tripReports/add/Utils';

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

  const getString = useFluent();

  const pageNumber = 1;
  const nPerPage = 30;

  const {loading, error, data} = useBasicSearchMountains({
    searchQuery, pageNumber, nPerPage, state,
    minElevation: parseFloat(minElevation), maxElevation: parseFloat(maxElevation),
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

  const emptySearchResults = null;
  const listStyle: React.CSSProperties = {margin: 0};

  let searchResults: React.ReactElement<any> | null;
  if (data !== undefined ) {
    const { mountains } = data;
    if (mountains) {
      const mountainList: Array<React.ReactElement<any>> = [];
      mountains.forEach(mtn => {
        if (!selectedMountains.find(m => m.id === mtn.id)) {
          const onClick = () => addMountainToList(mtn);
          mountainList.push(
            <MountainItemAdd
              onClick={onClick}
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
      const onClick = () => removeMountainFromList(mtn);
      return (
        <MountainItemRemove
          onClick={onClick}
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
          <h3>{getString('create-peak-list-search-mountain-to-add')}</h3>
          <StandardSearch
            placeholder={getString('global-text-value-search-mountains')}
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
              placeholder={getString('global-text-value-tier')}
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
            {getString('create-peak-list-selected-mountain-count', {total: selectedMountains.length})}
          </h3>
          <StandardSearch
            placeholder={
              getString('global-text-value-search-mountains', {total: selectedMountains.length})
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
