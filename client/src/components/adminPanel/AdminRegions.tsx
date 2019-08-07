import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Region, State } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import AddRegion from './regions/AddRegion';
import EditRegion from './regions/EditRegion';
import ListRegions from './regions/ListRegions';

const Root = styled.div`
  display: grid;
  grid-template-columns: 5fr 3fr;
  column-gap: 2rem;
`;

const RegionListColumn = styled.div`
  grid-column: 1;
`;

const RegionEditColumn = styled.div`
  grid-column: 2;
`;

const GET_REGIONS = gql`
  query ListRegions{
    regions {
      id
      name
      states {
        id
        name
      }
    }
  }
`;

const ADD_REGION = gql`
  mutation($name: String!, $states: [ID]) {
    addRegion(name: $name, states: $states) {
      id
      name
      states {
        id
        name
      }
    }
  }
`;

const DELETE_REGION = gql`
  mutation($id: ID!) {
    deleteRegion(id: $id) {
      id
    }
  }
`;

export interface SuccessResponse {
  regions: Array<{
    id: Region['id'];
    name: Region['name'];
    states: Array<{
      id: State['id'];
      name: State['name'];
    }>
  }>;
}

enum EditRegionPanelEnum {
  Empty,
  New,
  Update,
}

const AdminPanel = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_REGIONS);
  const [editRegionPanel, setEditRegionPanel] = useState<EditRegionPanelEnum>(EditRegionPanelEnum.Empty);
  const [regionToEdit, setRegionToEdit] = useState<string | null>(null);
  const clearEditRegionPanel = () => {
    setEditRegionPanel(EditRegionPanelEnum.Empty);
    setRegionToEdit(null);
  };

  const [deleteRegionMutation] = useMutation(DELETE_REGION, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_REGIONS });
      if (response !== null && response.regions !== null) {
        cache.writeQuery({
          query: GET_REGIONS,
          data: { regions: response.regions.filter(({id}) => id !== successData.deleteRegion.id) },
        });
      }
    },
  });

  const [addRegion] = useMutation(ADD_REGION, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_REGIONS });
      if (response !== null && response.regions !== null) {
        cache.writeQuery({
          query: GET_REGIONS,
          data: { regions: response.regions.concat([successData.addRegion]) },
        });
      }
    },
  });

  let editPanel: React.ReactElement<any> | null;
  if (editRegionPanel === EditRegionPanelEnum.Empty) {
    const createNewButtonClick = () => {
      setRegionToEdit(null);
      setEditRegionPanel(EditRegionPanelEnum.New);
    };
    editPanel = (
      <button onClick={createNewButtonClick}>
        Create new region
      </button>
    );
  } else if (editRegionPanel === EditRegionPanelEnum.New) {
    editPanel = (
      <>
        <AddRegion
          addRegion={(name: string, states: Array<State['id']>) => addRegion({ variables: { name, states } })}
          cancel={clearEditRegionPanel}
        />
      </>
    );
  } else if (editRegionPanel === EditRegionPanelEnum.Update) {
    if (regionToEdit !== null) {
      editPanel = (
        <>
          <EditRegion
            regionId={regionToEdit}
            cancel={clearEditRegionPanel}
          />
        </>
      );
    } else {
      editPanel = null;
    }
  } else {
    failIfValidOrNonExhaustive(editRegionPanel, 'Invalid value for editRegionPanel ' + editRegionPanel);
    editPanel = null;
  }

  const editRegion = (id: string) => {
    setEditRegionPanel(EditRegionPanelEnum.Update);
    setRegionToEdit(id);
  };

  const deleteRegion = (id: string) => {
    deleteRegionMutation({ variables: { id } });
    clearEditRegionPanel();
  };

  return (
    <Root>
      <RegionListColumn>
        <ListRegions
          loading={loading}
          error={error}
          data={data}
          deleteRegion={deleteRegion}
          editRegion={editRegion}
        />
      </RegionListColumn>
      <RegionEditColumn>
        {editPanel}
      </RegionEditColumn>
    </Root>
  );
};

export default AdminPanel;
