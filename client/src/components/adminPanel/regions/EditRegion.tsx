import { gql, useMutation, useQuery } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import {
  ButtonSecondary,
} from '../../../styling/styleUtils';
import { Region, State } from '../../../types/graphQLTypes';
import { notEmpty } from '../../../Utils';
import StandardSearch from '../../sharedComponents/StandardSearch';
import { GET_REGIONS } from '../AdminRegions';
import { GET_STATES } from '../AdminStates';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  CheckboxRoot,
  EditNameForm,
  EditPanel,
  NameActive,
  NameInactive,
  NameInput,
  NameText,
  SelectedItemsContainer,
  SelectionPanel,
  UpdateButton,
} from '../sharedStyles';

const GET_REGION_AND_ALL_STATES = gql`
  query GetRegionAndAllStates($id: ID!) {
    region(id: $id) {
      id
      name
      states {
        id
        name
      }
    }
    states {
      id
      name
      abbreviation
    }
  }
`;

const REMOVE_STATE_FROM_REGION = gql`
  mutation($regionId: ID!, $stateId: ID!) {
    removeStateFromRegion(regionId: $regionId, stateId: $stateId) {
      id
      name
      states {
        id
      }
    }
  }
`;

const ADD_STATE_TO_REGION = gql`
  mutation($regionId: ID!, $stateId: ID!) {
    addStateToRegion(regionId: $regionId, stateId: $stateId) {
      id
      name
      states {
        id
      }
    }
  }
`;

const CHANGE_REGION_NAME = gql`
  mutation($id: ID!, $newName: String!) {
    changeRegionName(id: $id, newName: $newName) {
      id
      name
      states {
        id
      }
    }
  }
`;

interface SuccessResponse {
  region: {
    id: Region['id'];
    name: Region['name'];
    states: Region['states'];
  };
  states: Array<{
    id: State['id'];
    name: State['name'];
    abbreviation: State['abbreviation'];
  }>;
}

interface Variables {
  id: string;
}

interface CheckboxProps {
  name: string;
  id: string;
  defaultChecked: boolean;
  removeStateFromRegion: (stateId: string) => void;
  addStateToRegion: (stateId: string) => void;
}

const Checkbox = (props: CheckboxProps) => {
  const {
    name, id, defaultChecked,
    removeStateFromRegion, addStateToRegion,
  } = props;
  const [checked, setChecked] = useState<boolean>(defaultChecked);

  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    if (checkedWillBe === true) {
      addStateToRegion(id);
    } else if (checkedWillBe === false) {
      removeStateFromRegion(id);
    }
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

interface Props {
  regionId: string;
  cancel: () => void;
}

const EditRegion = (props: Props) => {
  const { regionId, cancel } = props;
  const [editingName, setEditingName] = useState<boolean>(false);
  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_REGION_AND_ALL_STATES, {
    variables: { id: regionId },
  });
  const [removeStateFromRegion] = useMutation(REMOVE_STATE_FROM_REGION, {
    refetchQueries: () => [{query: GET_STATES}, {query: GET_REGIONS}],
  });
  const [addStateToRegion] = useMutation(ADD_STATE_TO_REGION, {
    refetchQueries: () => [{query: GET_STATES}, {query: GET_REGIONS}],
  });
  const [changeRegionName] = useMutation(CHANGE_REGION_NAME, {
    refetchQueries: () => [{query: GET_STATES}, {query: GET_REGIONS}],
  });

  let name: React.ReactElement | null;
  let states: React.ReactElement | null;
  let selectedStates: React.ReactElement[] | null;
  if (loading === true) {
    name = null;
    states = (<p>Loading</p>);
    selectedStates = null;
  } else if (error !== undefined) {
    name = null;
    states = null;
    selectedStates = null;
    console.error(error);
  } else if (data !== undefined) {
    if (editingName === false) {
      const setEditToTrue = () => {
        setEditingName(true);
        setInputNameValue(data.region.name);
      };
      name = (
        <NameInactive>
          <NameText value={data.region.name} readOnly={true}/>
          <ButtonSecondary onClick={setEditToTrue}>Edit Name</ButtonSecondary>
        </NameInactive>
      );
    } else if (editingName === true) {
      const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changeRegionName({variables: { id: regionId, newName: inputNameValue}});
        setEditingName(false);
      };
      name = (
        <NameActive>
          <EditNameForm onSubmit={handleSubmit}>
            <NameInput value={inputNameValue} onChange={(e) => setInputNameValue(e.target.value)} />
            <UpdateButton type='submit' disabled={inputNameValue === ''}>Update</UpdateButton>
          </EditNameForm>
          <ButtonSecondary onClick={() => setEditingName(false)}>Cancel</ButtonSecondary>
        </NameActive>
      );
    } else {
      name = null;
    }
    const filteredStates = data.states.filter(notEmpty);
    const filteredSelectedStates = data.region.states.filter(notEmpty);

    const sortedStates = sortBy(filteredStates, ['name']);
    const stateList = sortedStates.map(state => {
      if ((state.name.toLowerCase() + state.abbreviation.toLowerCase()).includes(searchQuery.toLowerCase())) {
        return (
          <Checkbox
            key={state.id}
            id={state.id}
            name={state.name}
            defaultChecked={(filteredSelectedStates.filter(regionState => regionState.id === state.id).length > 0)}
            removeStateFromRegion={(stateId) => removeStateFromRegion({ variables: {regionId, stateId}}) }
            addStateToRegion={(stateId) => addStateToRegion({ variables: {regionId, stateId}}) }
          />
        );
      } else {
        return null;
      }
    });
    states = <>{stateList}</>;
    const sortedSelectedStates = sortBy(filteredSelectedStates, ['name']);
    selectedStates = sortedSelectedStates.map(state => <li key={'selected-' + state.id}>{state.name}</li>);
  } else {
    name = null;
    states = null;
    selectedStates = null;
  }

  const filterStates = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <EditPanel onCancel={cancel}>
        {name}
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
              {selectedStates}
            </ol>
          </SelectedItemsContainer>
        </SelectionPanel>
    </EditPanel>
  );

};

export default EditRegion;
