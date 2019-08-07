import React from 'react';
import gql from 'graphql-tag';
import { Region, State } from '../../types/graphQLTypes';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ListRegions from './regions/ListRegions';
import AddRegion from './regions/AddRegion';

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
  mutation($name: String!) {
    addRegion(name: $name) {
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

const AdminPanel = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_REGIONS);

  const [deleteRegion] = useMutation(DELETE_REGION, {
    update: (cache, { data: { deleteRegion } }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_REGIONS });
      if (response !== null && response.regions !== null) {
        cache.writeQuery({
          query: GET_REGIONS,
          data: { regions: response.regions.filter(({id}) => id !== deleteRegion.id) },
        });
      }
    }
  });

  const [addRegion] = useMutation(ADD_REGION, {
    update: (cache, { data: { addRegion } }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_REGIONS });
      if (response !== null && response.regions !== null) {
        cache.writeQuery({
          query: GET_REGIONS,
          data: { regions: response.regions.concat([addRegion]) },
        });
      }
    }
  });

  return (
    <>
      <ListRegions
        loading={loading}
        error={error}
        data={data}
        deleteRegion={(id: string) => deleteRegion({ variables: { id } })}
      />
      <AddRegion
        addRegion={(name: string) => addRegion({ variables: { name } })}
      />
    </>
  );
};

export default AdminPanel;
