import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Region, State } from '../../../types/graphQLTypes';
import { GET_REGIONS } from '../AdminRegions';

const GET_STATE_AND_ALL_REGIONS = gql`
  query GetStateAndAllRegions($id: ID!) {
    state(id: $id) {
      id
      name
      abbreviation
      regions {
        id
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
  stateId: string;
  cancel: () => void;
}

const EditRegion = (props: Props) => {
  const { stateId, cancel } = props;
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingAbbreviation, setEditingAbbreviation] = useState<boolean>(false);
  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [inputAbbreviationValue, setInputAbbreviationValue] = useState<string>('');

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_STATE_AND_ALL_REGIONS, {
    variables: { id: stateId },
  });
  const [removeRegionFromState] = useMutation(REMOVE_REGION_FROM_STATE, {
    refetchQueries: () => [{query: GET_REGIONS}],
  });
  const [addRegionToState] = useMutation(ADD_REGION_TO_STATE, {
    refetchQueries: () => [{query: GET_REGIONS}],
  });
  const [changeStateName] = useMutation(CHANGE_STATE_NAME, {
    refetchQueries: () => [{query: GET_REGIONS}],
  });
  const [changeStateAbbreviation] = useMutation(CHANGE_STATE_ABBREVIATION, {
    refetchQueries: () => [{query: GET_REGIONS}],
  });

  let name: React.ReactElement | null;
  let abbreviation: React.ReactElement | null;
  let states: React.ReactElement | null;
  if (loading === true) {
    name = null;
    abbreviation = null;
    states = (<p>Loading</p>);
  } else if (error !== undefined) {
    name = null;
    abbreviation = null;
    states = null;
    console.error(error);
  } else if (data !== undefined) {
    if (editingName === false) {
      const setEditNameToTrue = () => {
        setEditingName(true);
        setInputNameValue(data.state.name);
      };
      name = (
        <>
          <h3>{data.state.name}</h3>
          <button onClick={setEditNameToTrue}>Edit Name</button>
        </>
      );
    } else if (editingName === true) {
      const handleNameSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changeStateName({variables: { id: stateId, newName: inputNameValue}});
        setEditingName(false);
      };
      name = (
        <>
        <form onSubmit={handleNameSubmit}>
          <input value={inputNameValue} onChange={(e) => setInputNameValue(e.target.value)} />
          <button type='submit' disabled={inputNameValue === ''}>Update</button>
        </form>
        <button onClick={() => setEditingName(false)}>Cancel</button>
        </>
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
        <>
          <h4>{data.state.abbreviation}</h4>
          <button onClick={setEditAbbreviationToTrue}>Edit Abbreviation</button>
        </>
      );
    } else if (editingAbbreviation === true) {
      const handleAbbreviationSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        changeStateAbbreviation({variables: { id: stateId, newAbbreviation: inputAbbreviationValue}});
        setEditingAbbreviation(false);
      };
      abbreviation = (
        <>
        <form onSubmit={handleAbbreviationSubmit}>
          <input value={inputAbbreviationValue} onChange={(e) => setInputAbbreviationValue(e.target.value)} />
          <button type='submit' disabled={inputAbbreviationValue === ''}>Update</button>
        </form>
        <button onClick={() => setEditingAbbreviation(false)}>Cancel</button>
        </>
      );
    } else {
      abbreviation = null;
    }
    const stateList = data.regions.map(region => {
      return (
        <li key={region.id}>
          <Checkbox
            id={region.id}
            name={region.name}
            defaultChecked={(data.state.regions.filter(stateRegion => stateRegion.id === region.id).length > 0)}
            removeRegionFromState={(regionId) => removeRegionFromState({ variables: {regionId, stateId}}) }
            addRegionToState={(regionId) => addRegionToState({ variables: {regionId, stateId}}) }
          />
        </li>
      );
    });
    states = <>{stateList}</>;
  } else {
    name = null;
    abbreviation = null;
    states = null;
  }

  return (
    <div>
      <button onClick={cancel}>Close</button>
        {name}
        {abbreviation}
        <fieldset>
          <ul>
            {states}
          </ul>
        </fieldset>
    </div>
  );

};

export default EditRegion;
