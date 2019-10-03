import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import { Region } from '../../../types/graphQLTypes';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  CheckboxRoot,
  CreateButton,
  EditPanel,
  NameActive,
  NameInput,
  SelectedItemsContainer,
  SelectionPanel,
} from '../sharedStyles';

const GET_REGIONS = gql`
  query ListRegions{
    regions {
      id
      name
    }
  }
`;

interface SuccessResponse {
  regions: Array<{
    id: Region['id'];
    name: Region['name'];
  }>;
}

interface CheckboxProps {
  name: string;
  id: string;
  toggleItem: (id: string, regionName: string, checked: boolean) => void;
}

const Checkbox = ({name, id, toggleItem}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(false);

  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    toggleItem(id, name, checkedWillBe);
  };

  return (
    <CheckboxRoot>
      <CheckboxInput
        type='checkbox'
        value={id}
        id={`state-checkbox-${id}`}
        checked={checked}
        onChange={onChange}
      />
      <CheckboxLabel htmlFor={`state-checkbox-${id}`}>{name}</CheckboxLabel>
    </CheckboxRoot>
  );

};

interface RegionDatum {
  name: Region['name'];
  id: Region['id'];
}

interface Props {
  addState: (name: string, abbreviation: string, states: Array<Region['id']>) => void;
  cancel: () => void;
}

const AddState = (props: Props) => {
  const { addState, cancel } = props;

  const [name, setName] = useState<string>('');
  const [abbreviation, setAbbreviation] = useState<string>('');
  const [selectedRegions, setSelectedRegions] = useState<RegionDatum[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const selectedRegionIds = selectedRegions.map(({id}) => id);
    addState(name, abbreviation, selectedRegionIds);
    cancel();
  };

  const toggleStateListItem = (id: string, regionName: string, checked: boolean) => {
    if (checked === true) {
      setSelectedRegions([...selectedRegions, {id, name: regionName}]);
    } else if (checked === false) {
      setSelectedRegions(selectedRegions.filter(({id: idInList}) => idInList !== id));
    }
  };

  const sortedSelectedRegions = sortBy(selectedRegions, ['name']);
  const selectedRegionsLi = sortedSelectedRegions.map(state => <li key={state.id}>{state.name}</li>);

  const {loading, error, data} = useQuery<SuccessResponse>(GET_REGIONS);

  let regions: React.ReactElement | null;
  if (loading === true) {
    regions = (<p>Loading</p>);
  } else if (error !== undefined) {
    regions = null;
    console.error(error);
  } else if (data !== undefined) {
    const regionList = data.regions.map(region => {
      if (region.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return (
          <Checkbox
            key={region.id}
            id={region.id}
            name={region.name}
            toggleItem={toggleStateListItem}
          />
        );
      } else {
        return null;
      }
    });
    regions = <>{regionList}</>;
  } else {
    regions = null;
  }

  const filterRegions = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <EditPanel onCancel={cancel}>
      <form
        onSubmit={handleSubmit}
      >
        <NameActive>
          <NameInput
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Name'
          />
          <NameInput
            value={abbreviation}
            onChange={e => setAbbreviation(e.target.value)}
            placeholder='abbreviation'
          />
        </NameActive>
        <SelectionPanel>
          <CheckboxContainer>
            <StandardSearch
              placeholder={'Filter states'}
              setSearchQuery={filterRegions}
              focusOnMount={false}
              initialQuery={searchQuery}
            />
            {regions}
          </CheckboxContainer>
          <SelectedItemsContainer>
            <strong>Selected Regions</strong>
            <ol>
              {selectedRegionsLi}
            </ol>
          </SelectedItemsContainer>
        </SelectionPanel>
        <CreateButton type='submit' disabled={name === '' || abbreviation === ''}>Add State</CreateButton>
      </form>
    </EditPanel>
  );

};

export default AddState;
