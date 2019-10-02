import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonSecondary,
  InputBase,
} from '../../../styling/styleUtils';
import { Region, State } from '../../../types/graphQLTypes';
import { GET_REGIONS } from '../AdminRegions';
import { GET_STATES } from '../AdminStates';
import { EditPanel } from '../sharedStyles';

const NameInactive = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin: 1rem 0;
`;

const NameActive = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin: 1rem 0;
`;

const EditNameForm = styled.form`
  display: contents;
`;

const NameText = styled(InputBase)`
  border: 1px solid transparent;
  outline: none;
  background-color: #eee;
  flex-shrink: 0;
  margin-bottom: 0.4rem;
`;
const NameInput = styled(InputBase)`
  flex-shrink: 0;
  margin-bottom: 0.4rem;
`;

const CheckboxContainer = styled.fieldset`
  overflow: auto;
  max-height: 300px;
  padding: 0;
`;

const CheckboxRoot = styled.div`
  display: block;
  position: relative;
`;

const CheckboxInput = styled.input`
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  margin: auto;
`;

const CheckboxLabel = styled.label`
  padding: 8px 8px 8px 30px;
  display: block;
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

const GET_REGION_AND_ALL_STATES = gql`
  query GetRegionAndAllStates($id: ID!) {
    region(id: $id) {
      id
      name
      states {
        id
      }
    }
    states {
      id
      name
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
  if (loading === true) {
    name = null;
    states = (<p>Loading</p>);
  } else if (error !== undefined) {
    name = null;
    states = null;
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
            <ButtonPrimary type='submit' disabled={inputNameValue === ''}>Update</ButtonPrimary>
          </EditNameForm>
          <ButtonSecondary onClick={() => setEditingName(false)}>Cancel</ButtonSecondary>
        </NameActive>
      );
    } else {
      name = null;
    }
    const stateList = data.states.map(state => {
      return (
        <Checkbox
          key={state.id}
          id={state.id}
          name={state.name}
          defaultChecked={(data.region.states.filter(regionState => regionState.id === state.id).length > 0)}
          removeStateFromRegion={(stateId) => removeStateFromRegion({ variables: {regionId, stateId}}) }
          addStateToRegion={(stateId) => addStateToRegion({ variables: {regionId, stateId}}) }
        />
      );
    });
    states = <>{stateList}</>;
  } else {
    name = null;
    states = null;
  }

  return (
    <EditPanel onCancel={cancel}>
        {name}
        <CheckboxContainer>
          {states}
        </CheckboxContainer>
    </EditPanel>
  );

};

export default EditRegion;
