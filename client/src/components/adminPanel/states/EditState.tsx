import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
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

const GET_STATE_AND_ALL_REGIONS = gql`
  query GetStateAndAllRegions($id: ID!) {
    state(id: $id) {
      id
      name
      abbreviation
      regions {
        id
        name
      }
    }
    regions {
      id
      name
    }
  }
`;

const REMOVE_REGION_FROM_STATE = gql`
  mutation($regionId: ID!, $stateId: ID!) {
    removeRegionFromState(regionId: $regionId, stateId: $stateId) {
      id
      name
      abbreviation
      regions {
        id
      }
    }
  }
`;

const ADD_REGION_TO_STATE = gql`
  mutation($regionId: ID!, $stateId: ID!) {
    addRegionToState(regionId: $regionId, stateId: $stateId) {
      id
      name
      abbreviation
      regions {
        id
      }
    }
  }
`;

const CHANGE_STATE_NAME = gql`
  mutation($id: ID!, $newName: String!) {
    changeStateName(id: $id, newName: $newName) {
      id
      name
      abbreviation
      regions {
        id
      }
    }
  }
`;

const CHANGE_STATE_ABBREVIATION = gql`
  mutation($id: ID!, $newAbbreviation: String!) {
    changeStateAbbreviation(id: $id, newAbbreviation: $newAbbreviation) {
      id
      name
      abbreviation
      regions {
        id
      }
    }
  }
`;

interface SuccessResponse {
  state: {
    id: State['id'];
    name: State['name'];
    abbreviation: State['abbreviation'];
    regions: State['regions'];
  };
  regions: Array<{
    id: Region['id'];
    name: Region['name'];
  }>;
}

interface Variables {
  id: string;
}

interface CheckboxProps {
  name: string;
  id: string;
  defaultChecked: boolean;
  removeRegionFromState: (stateId: string) => void;
  addRegionToState: (stateId: string) => void;
}

const Checkbox = (props: CheckboxProps) => {
  const {
    name, id, defaultChecked,
    removeRegionFromState, addRegionToState,
  } = props;
  const [checked, setChecked] = useState<boolean>(defaultChecked);

  const onChange = () => {
    const checkedWillBe = !checked;
    setChecked(checkedWillBe);
    if (checkedWillBe === true) {
      addRegionToState(id);
    } else if (checkedWillBe === false) {
      removeRegionFromState(id);
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
  stateId: string;
  cancel: () => void;
}

const EditRegion = (props: Props) => {
  const { stateId, cancel } = props;
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingAbbreviation, setEditingAbbreviation] = useState<boolean>(false);
  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [inputAbbreviationValue, setInputAbbreviationValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_STATE_AND_ALL_REGIONS, {
    variables: { id: stateId },
  });
  const [removeRegionFromState] = useMutation(REMOVE_REGION_FROM_STATE, {
    refetchQueries: () => [{query: GET_STATES}, {query: GET_REGIONS}],
  });
  const [addRegionToState] = useMutation(ADD_REGION_TO_STATE, {
    refetchQueries: () => [{query: GET_STATES}, {query: GET_REGIONS}],
  });
  const [changeStateName] = useMutation(CHANGE_STATE_NAME, {
    refetchQueries: () => [{query: GET_REGIONS}],
  });
  const [changeStateAbbreviation] = useMutation(CHANGE_STATE_ABBREVIATION, {
    refetchQueries: () => [{query: GET_REGIONS}],
  });

  let name: React.ReactElement | null;
  let abbreviation: React.ReactElement | null;
  let regions: React.ReactElement | null;
  let selectedRegions: Array<React.ReactElement<any>> | null;
  if (loading === true) {
    name = null;
    abbreviation = null;
    selectedRegions = null;
    regions = (<p>Loading</p>);
  } else if (error !== undefined) {
    name = null;
    abbreviation = null;
    regions = null;
    selectedRegions = null;
    console.error(error);
  } else if (data !== undefined) {
    if (editingName === false) {
      const setEditNameToTrue = () => {
        setEditingName(true);
        setInputNameValue(data.state.name);
      };
      name = (
        <NameInactive>
          <NameText value={data.state.name} readOnly={true} />
          <ButtonSecondary onClick={setEditNameToTrue}>Edit Name</ButtonSecondary>
        </NameInactive>
      );
    } else if (editingName === true) {
      const handleNameSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changeStateName({variables: { id: stateId, newName: inputNameValue}});
        setEditingName(false);
      };
      name = (
        <NameActive>
          <EditNameForm onSubmit={handleNameSubmit}>
            <NameInput value={inputNameValue} onChange={(e) => setInputNameValue(e.target.value)} />
            <UpdateButton type='submit' disabled={inputNameValue === ''}>Update</UpdateButton>
          </EditNameForm>
          <ButtonSecondary onClick={() => setEditingName(false)}>Cancel</ButtonSecondary>
        </NameActive>
      );
    } else {
      name = null;
    }
    if (editingAbbreviation === false) {
      const setEditAbbreviationToTrue = () => {
        setEditingAbbreviation(true);
        setInputAbbreviationValue(data.state.abbreviation);
      };
      abbreviation = (
        <NameInactive>
          <NameText value={data.state.abbreviation}  readOnly={true} />
          <ButtonSecondary onClick={setEditAbbreviationToTrue}>Edit Abbreviation</ButtonSecondary>
        </NameInactive>
      );
    } else if (editingAbbreviation === true) {
      const handleAbbreviationSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changeStateAbbreviation({variables: { id: stateId, newAbbreviation: inputAbbreviationValue}});
        setEditingAbbreviation(false);
      };
      abbreviation = (
        <NameActive>
          <EditNameForm onSubmit={handleAbbreviationSubmit}>
            <NameInput value={inputAbbreviationValue} onChange={(e) => setInputAbbreviationValue(e.target.value)} />
            <UpdateButton type='submit' disabled={inputAbbreviationValue === ''}>Update</UpdateButton>
          </EditNameForm>
          <ButtonSecondary onClick={() => setEditingAbbreviation(false)}>Cancel</ButtonSecondary>
        </NameActive>
      );
    } else {
      abbreviation = null;
    }
    const filteredSelectedRegions = data.state.regions.filter(notEmpty);

    const sortedRegions = sortBy(data.regions, ['name']);
    const regionList = sortedRegions.map(region => {
      return (
        <Checkbox
          id={region.id}
          name={region.name}
          defaultChecked={(filteredSelectedRegions.filter(stateRegion => stateRegion.id === region.id).length > 0)}
          removeRegionFromState={(regionId) => removeRegionFromState({ variables: {regionId, stateId}}) }
          addRegionToState={(regionId) => addRegionToState({ variables: {regionId, stateId}}) }
        />
      );
    });
    regions = <>{regionList}</>;
    const sortedSelectedRegion = sortBy(filteredSelectedRegions, ['name']);
    selectedRegions = sortedSelectedRegion.map(state => <li key={'selected-' + state.id}>{state.name}</li>);
  } else {
    name = null;
    abbreviation = null;
    regions = null;
    selectedRegions = null;
  }

  const filterRegions = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <EditPanel onCancel={cancel}>
        {name}
        {abbreviation}
        <SelectionPanel>
          <CheckboxContainer>
            <StandardSearch
              placeholder={'Filter regions'}
              setSearchQuery={filterRegions}
              focusOnMount={false}
              initialQuery={searchQuery}
            />
            {regions}
          </CheckboxContainer>
          <SelectedItemsContainer>
            <strong>Selected Regions</strong>
            <ol>
              {selectedRegions}
            </ol>
          </SelectedItemsContainer>
        </SelectionPanel>
    </EditPanel>
  );

};

export default EditRegion;
