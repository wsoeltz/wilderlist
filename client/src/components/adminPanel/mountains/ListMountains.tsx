import { ApolloError } from 'apollo-boost';
import React from 'react';
import styled from 'styled-components';
import { SuccessResponse } from '../AdminMountains';

const MountainName = styled.a`
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
  deleteMountain: (id: string) => void;
  editMountain: (id: string) => void;
}

const ListMountains = (props: Props) => {
  const {loading, error, data, deleteMountain, editMountain} = props;

  if (loading === true) {
    return (<p>Loading</p>);
  } else if (error !== undefined) {
    console.error(error);
    return (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { mountains } = data;
    const mountainElms = mountains.map(mountain => {
      return (
        <li key={mountain.id}>
          <strong><MountainName
            onClick={() => editMountain(mountain.id)}
          >{mountain.name}</MountainName></strong>
          <button
            onClick={() => deleteMountain(mountain.id)}
          >
            Delete
          </button>
          <div>
            <small>
              Elevation: {mountain.elevation},
              Latitude: {mountain.latitude},
              Longitude: {mountain.longitude},
              Prominence: {mountain.prominence},
              State: {mountain.state.name},
            </small>
          </div>
        </li>
      );
    });
    return(
      <>
        {mountainElms}
      </>
    );
  } else {
    return null;
  }
};

export default ListMountains;
