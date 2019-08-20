import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge as MountainListColumn,
  ContentRightSmall as MountainEditColumn,
} from '../../styling/Grid';
import { Mountain } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import { GET_PEAK_LISTS } from './AdminPeakLists';
import AddMountain from './mountains/AddMountain';
import EditMountain from './mountains/EditMountain';
import ListMountains from './mountains/ListMountains';

export const GET_MOUNTAINS = gql`
  query ListMountains {
    mountains {
      id
      name
      latitude
      longitude
      elevation
      prominence
      state {
        id
        name
      }
    }
  }
`;

const ADD_MOUNTAIN = gql`
  mutation addNewMountain(
      $name: String!,
      $latitude: Float!,
      $longitude: Float!,
      $elevation: Float!,
      $prominence: Float,
      $state: ID!,
    ) {
    addMountain(
      name: $name,
      latitude: $latitude,
      longitude: $longitude,
      elevation: $elevation,
      prominence: $prominence,
      state: $state,
    ) {
      id
      name
      latitude
      longitude
      elevation
      prominence
      state {
        id
        name
      }
    }
  }
`;

const EDIT_MOUNTAIN = gql`
  mutation (
      $id: ID!,
      $name: String!,
      $latitude: Float!,
      $longitude: Float!,
      $elevation: Float!,
      $prominence: Float,
      $state: ID!,
    ) {
    updateMountain(
      id: $id
      name: $name,
      latitude: $latitude,
      longitude: $longitude,
      elevation: $elevation,
      prominence: $prominence,
      state: $state,
    ) {
      id
      name
      latitude
      longitude
      elevation
      prominence
      state {
        id
        name
      }
    }
  }
`;

export interface AddMountainVariables {
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  prominence: number | null;
  state: string;
}
export type EditMountainVariables = AddMountainVariables & {
  id: string;
};

const DELETE_MOUNTAIN = gql`
  mutation($id: ID!) {
    deleteMountain(id: $id) {
      id
    }
  }
`;

export interface SuccessResponse {
  mountains: Mountain[];
}

enum EditMountainPanelEnum {
  Empty,
  New,
  Update,
}

const AdminPanel = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_MOUNTAINS);
  const [editMountainPanel, setEditMountainPanel] = useState<EditMountainPanelEnum>(EditMountainPanelEnum.Empty);
  const [mountainToEdit, setMountainToEdit] = useState<string | null>(null);
  const clearEditMountainPanel = () => {
    setEditMountainPanel(EditMountainPanelEnum.Empty);
    setMountainToEdit(null);
  };

  const [deleteMountainMutation] = useMutation(DELETE_MOUNTAIN, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_MOUNTAINS });
      if (response !== null && response.mountains !== null) {
        cache.writeQuery({
          query: GET_MOUNTAINS,
          data: { mountains: response.mountains.filter(({id}) => id !== successData.deleteMountain.id) },
        });
      }
    },
    refetchQueries: () => [{query: GET_PEAK_LISTS}],
  });

  const [addMountain] = useMutation<any, AddMountainVariables>(ADD_MOUNTAIN, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_MOUNTAINS });
      if (response !== null && response.mountains !== null) {
        cache.writeQuery({
          query: GET_MOUNTAINS,
          data: { mountains: response.mountains.concat([successData.addMountain]) },
        });
      }
    },
    refetchQueries: () => [{query: GET_PEAK_LISTS}],
  });

  const [updateMountain] = useMutation<any, EditMountainVariables>(EDIT_MOUNTAIN);

  let editPanel: React.ReactElement<any> | null;
  if (editMountainPanel === EditMountainPanelEnum.Empty) {
    const createNewButtonClick = () => {
      setMountainToEdit(null);
      setEditMountainPanel(EditMountainPanelEnum.New);
    };
    editPanel = (
      <button onClick={createNewButtonClick}>
        Create new mountain
      </button>
    );
  } else if (editMountainPanel === EditMountainPanelEnum.New) {
    editPanel = (
      <>
        <AddMountain
          addMountain={(variables: AddMountainVariables) => addMountain({ variables: { ...variables } })}
          cancel={clearEditMountainPanel}
        />
      </>
    );
  } else if (editMountainPanel === EditMountainPanelEnum.Update) {
    if (mountainToEdit !== null) {
      editPanel = (
        <>
          <EditMountain
            mountainId={mountainToEdit}
            editMountain={(variables: EditMountainVariables) => updateMountain({ variables: { ...variables } })}
            cancel={clearEditMountainPanel}
          />
        </>
      );
    } else {
      editPanel = null;
    }
  } else {
    failIfValidOrNonExhaustive(editMountainPanel, 'Invalid value for editMountainPanel ' + editMountainPanel);
    editPanel = null;
  }

  const editMountain = (id: string) => {
    setEditMountainPanel(EditMountainPanelEnum.Update);
    setMountainToEdit(id);
  };

  const deleteMountain = (id: string) => {
    deleteMountainMutation({ variables: { id } });
    clearEditMountainPanel();
  };

  return (
    <>
      <MountainListColumn>
        <ContentHeader>
          <h2>Mountains</h2>
        </ContentHeader>
        <ContentBody>
          <ListMountains
            loading={loading}
            error={error}
            data={data}
            deleteMountain={deleteMountain}
            editMountain={editMountain}
          />
        </ContentBody>
      </MountainListColumn>
      <MountainEditColumn>
        <ContentBody>
        {editPanel}
        </ContentBody>
      </MountainEditColumn>
    </>
  );
};

export default AdminPanel;
