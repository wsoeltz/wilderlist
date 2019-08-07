import { ApolloError } from 'apollo-boost';
import React from 'react';
import styled from 'styled-components';
import { SuccessResponse } from '../AdminRegions';

const RegionName = styled.a`
  color: blue;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteRegion: (id: string) => void;
  editRegion: (id: string) => void;
}

const ListRegions = (props: Props) => {
  const {loading, error, data, deleteRegion, editRegion} = props;

  if (loading === true) {
    return (<p>Loading</p>);
  } else if (error !== undefined) {
    console.error(error);
    return (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { regions } = data;
    const regionElms = regions.map(region => {
      const stateElms = region.states.map(({name}) => name + ', ');
      return (
        <li key={region.id}>
          <strong><RegionName
            onClick={() => editRegion(region.id)}
          >{region.name}</RegionName></strong>
          <button
            onClick={() => deleteRegion(region.id)}
          >
            Delete
          </button>
          <div>
            <small>{stateElms}</small>
          </div>
        </li>
      );
    });
    return(
      <>
        {regionElms}
      </>
    );
  } else {
    return null;
  }
};

export default ListRegions;
