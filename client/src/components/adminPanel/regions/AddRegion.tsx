import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import { State } from '../../../types/graphQLTypes';
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

const GET_STATES = gql`
  query ListStates{
    states {
      id
      name
      abbreviation
    }
  }
`;

interface SuccessResponse {
  states: Array<{
    id: State['id'];
    name: State['name'];
    abbreviation: State['abbreviation'];
  }>;
}

interface CheckboxProps {
  name: string;
  id: string;
  toggleItem: (id: string, name: string, checked: boolean) => void;
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

interface StateDatum {
  name: State['name'];
  id: State['id'];
}

interface Props {
  addRegion: (name: string, states: Array<State['id']>) => void;
  cancel: () => void;
}

const AddRegion = (props: Props) => {
  const { addRegion, cancel } = props;

  const [name, setName] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<StateDatum[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const selectedStatesIds = selectedStates.map(({id}) => id);
    addRegion(name, selectedStatesIds);
    cancel();
  };

  const toggleStateListItem = (id: string, stateName: string, checked: boolean) => {
    if (checked === true) {
      setSelectedStates([...selectedStates, {id, name: stateName}]);
    } else if (checked === false) {
      setSelectedStates(selectedStates.filter(({id: idInList}) => idInList !== id));
    }
  };
  const sortedSelectedStates = sortBy(selectedStates, ['name']);
  const selectedStatesLi = sortedSelectedStates.map(state => <li key={state.id}>{state.name}</li>);

  const {loading, error, data} = useQuery<SuccessResponse>(GET_STATES);

  let states: React.ReactElement | null;
  if (loading === true) {
    states = (<p>Loading</p>);
  } else if (error !== undefined) {
    states = null;
    console.error(error);
  } else if (data !== undefined) {
    const sortedStates = sortBy(data.states, ['name']);
    const stateList = sortedStates.map(state => {
      if ((state.name.toLowerCase() + state.abbreviation.toLowerCase()).includes(searchQuery.toLowerCase())) {
        return (
          <Checkbox
            key={state.id}
            id={state.id}
            name={state.name}
            toggleItem={toggleStateListItem}
          />
        );
      } else {
        return null;
      }
    });
    states = <>{stateList}</>;
  } else {
    states = null;
  }

  const filterStates = (value: string) => {
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
          />
        </NameActive>
        <SelectionPanel>
          <CheckboxContainer>
            <StandardSearch
              placeholder={'Filter states'}
              setSearchQuery={filterStates}
              focusOnMount={false}
              initialQuery={searchQuery}
            />
            {states}
          </CheckboxContainer>
          <SelectedItemsContainer>
            <strong>Selected States</strong>
            <ol>
              {selectedStatesLi}
            </ol>
          </SelectedItemsContainer>
        </SelectionPanel>
        <CreateButton type='submit' disabled={name === ''}>Add Region</CreateButton>
      </form>
    </EditPanel>
  );

};

export default AddRegion;
