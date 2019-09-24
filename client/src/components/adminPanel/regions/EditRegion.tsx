import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Region, State } from '../../../types/graphQLTypes';
import { GET_REGIONS } from '../AdminRegions';
import { GET_STATES } from '../AdminStates';

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
    <>
      <input
        type='checkbox'
        value={id}
        id={`state-checkbox-${id}`}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={`state-checkbox-${id}`}>{name}</label>
    </>
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
        <>
          <h3>{data.region.name}</h3>
          <button onClick={setEditToTrue}>Edit Name</button>
        </>
      );
    } else if (editingName === true) {
      const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changeRegionName({variables: { id: regionId, newName: inputNameValue}});
        setEditingName(false);
      };
      name = (
        <>
        <form onSubmit={handleSubmit}>
          <input value={inputNameValue} onChange={(e) => setInputNameValue(e.target.value)} />
          <button type='submit' disabled={inputNameValue === ''}>Update</button>
        </form>
        <button onClick={() => setEditingName(false)}>Cancel</button>
        </>
      );
    } else {
      name = null;
    }
    const stateList = data.states.map(state => {
      return (
        <li key={state.id}>
          <Checkbox
            id={state.id}
            name={state.name}
            defaultChecked={(data.region.states.filter(regionState => regionState.id === state.id).length > 0)}
            removeStateFromRegion={(stateId) => removeStateFromRegion({ variables: {regionId, stateId}}) }
            addStateToRegion={(stateId) => addStateToRegion({ variables: {regionId, stateId}}) }
          />
        </li>
      );
    });
    states = <>{stateList}</>;
  } else {
    name = null;
    states = null;
  }

  return (
    <div>
      <button onClick={cancel}>Close</button>
        {name}
        <fieldset>
          <ul>
            {states}
          </ul>
        </fieldset>
    </div>
  );

};

export default EditRegion;
