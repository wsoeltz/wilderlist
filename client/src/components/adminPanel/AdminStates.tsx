import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge as StateListColumn,
  ContentRightSmall as StateEditColumn,
} from '../../styling/Grid';
import { Region, State } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import { GET_MOUNTAINS } from './AdminMountains';
import { GET_REGIONS } from './AdminRegions';
import AddState from './states/AddState';
import EditState from './states/EditState';
import ListStates from './states/ListStates';

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

export interface StateDatum {
  id: State['id'];
  name: State['name'];
  abbreviation: State['abbreviation'];
  regions: Array<{
    id: Region['id'];
    name: Region['name'];
  }>;
}

export interface SuccessResponse {
  states: StateDatum[];
}

enum EditStatePanelEnum {
  Empty,
  New,
  Update,
}

const AdminStates = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_STATES);
  const [editStatePanel, setEditStatePanel] = useState<EditStatePanelEnum>(EditStatePanelEnum.Empty);
  const [stateToEdit, setStateToEdit] = useState<string | null>(null);
  const clearEditStatePanel = () => {
    setEditStatePanel(EditStatePanelEnum.Empty);
    setStateToEdit(null);
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
    refetchQueries: () => [{query: GET_REGIONS}, {query: GET_MOUNTAINS}],
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
    refetchQueries: () => [{query: GET_REGIONS}, {query: GET_MOUNTAINS}],
  });

  let editPanel: React.ReactElement<any> | null;
  if (editStatePanel === EditStatePanelEnum.Empty) {
    const createNewButtonClick = () => {
      setStateToEdit(null);
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
    if (stateToEdit !== null) {
      editPanel = (
        <>
          <EditState
            stateId={stateToEdit}
            cancel={clearEditStatePanel}
            key={stateToEdit}
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
    setStateToEdit(id);
  };

  const deleteState = (id: string) => {
    deleteStateMutation({ variables: { id } });
    clearEditStatePanel();
  };

  return (
    <>
      <StateListColumn>
        <ContentHeader>
          <h2>States</h2>
        </ContentHeader>
        <ContentBody>
          <ListStates
            loading={loading}
            error={error}
            data={data}
            deleteState={deleteState}
            editState={editState}
          />
        </ContentBody>
      </StateListColumn>
      <StateEditColumn>
        <ContentBody>
        {editPanel}
        </ContentBody>
      </StateEditColumn>
    </>
  );
};

export default withRouter(AdminStates);
