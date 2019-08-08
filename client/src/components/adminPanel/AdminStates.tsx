import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Region, State } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import { GET_REGIONS } from './AdminRegions';
import AddState from './states/AddState';
import EditState from './states/EditState';
import ListStates from './states/ListStates';

const Root = styled.div`
  display: grid;
  grid-template-columns: 5fr 3fr;
  column-gap: 2rem;
`;

const StateListColumn = styled.div`
  grid-column: 1;
`;

const StateEditColumn = styled.div`
  grid-column: 2;
`;

export const GET_STATES = gql`
  query ListStates {
    states {
      id
      name
      abbreviation
      regions {
        id
        name
      }
    }
  }
`;

const ADD_STATE = gql`
  mutation($name: String!, $abbreviation: String!, $regions: [ID]) {
    addState(name: $name, abbreviation: $abbreviation, regions: $regions) {
      id
      name
      abbreviation
      regions {
        id
        name
      }
    }
  }
`;

interface AddStateVariables {
  name: string;
  abbreviation: string;
  regions: string[];
}

const DELETE_STATE = gql`
  mutation($id: ID!) {
    deleteState(id: $id) {
      id
    }
  }
`;

export interface SuccessResponse {
  states: Array<{
    id: State['id'];
    name: State['name'];
    abbreviation: State['abbreviation'];
    regions: Array<{
      id: Region['id'];
      name: Region['name'];
    }>
  }>;
}

enum EditStatePanelEnum {
  Empty,
  New,
  Update,
}

const AdminPanel = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_STATES);
  const [editStatePanel, setEditStatePanel] = useState<EditStatePanelEnum>(EditStatePanelEnum.Empty);
  const [regionToEdit, setRegionToEdit] = useState<string | null>(null);
  const clearEditStatePanel = () => {
    setEditStatePanel(EditStatePanelEnum.Empty);
    setRegionToEdit(null);
  };

  const [deleteStateMutation] = useMutation(DELETE_STATE, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_STATES });
      if (response !== null && response.states !== null) {
        cache.writeQuery({
          query: GET_STATES,
          data: { states: response.states.filter(({id}) => id !== successData.deleteState.id) },
        });
      }
    },
    refetchQueries: () => [{query: GET_REGIONS}],
  });

  const [addState] = useMutation<any, AddStateVariables>(ADD_STATE, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_STATES });
      if (response !== null && response.states !== null) {
        cache.writeQuery({
          query: GET_STATES,
          data: { states: response.states.concat([successData.addState]) },
        });
      }
    },
    refetchQueries: () => [{query: GET_REGIONS}],
  });

  let editPanel: React.ReactElement<any> | null;
  if (editStatePanel === EditStatePanelEnum.Empty) {
    const createNewButtonClick = () => {
      setRegionToEdit(null);
      setEditStatePanel(EditStatePanelEnum.New);
    };
    editPanel = (
      <button onClick={createNewButtonClick}>
        Create new state
      </button>
    );
  } else if (editStatePanel === EditStatePanelEnum.New) {
    editPanel = (
      <>
        <AddState
          addState={
            (name: string, abbreviation: string, regions: Array<State['id']>) =>
              addState({ variables: { name, abbreviation, regions } })
          }
          cancel={clearEditStatePanel}
        />
      </>
    );
  } else if (editStatePanel === EditStatePanelEnum.Update) {
    if (regionToEdit !== null) {
      editPanel = (
        <>
          <EditState
            stateId={regionToEdit}
            cancel={clearEditStatePanel}
          />
        </>
      );
    } else {
      editPanel = null;
    }
  } else {
    failIfValidOrNonExhaustive(editStatePanel, 'Invalid value for editStatePanel ' + editStatePanel);
    editPanel = null;
  }

  const editState = (id: string) => {
    setEditStatePanel(EditStatePanelEnum.Update);
    setRegionToEdit(id);
  };

  const deleteState = (id: string) => {
    deleteStateMutation({ variables: { id } });
    clearEditStatePanel();
  };

  return (
    <Root>
      <h2>Regions</h2>
      <StateListColumn>
        <ListStates
          loading={loading}
          error={error}
          data={data}
          deleteState={deleteState}
          editState={editState}
        />
      </StateListColumn>
      <StateEditColumn>
        {editPanel}
      </StateEditColumn>
    </Root>
  );
};

export default AdminPanel;
