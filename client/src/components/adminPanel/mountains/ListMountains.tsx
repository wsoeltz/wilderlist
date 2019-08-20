import { ApolloError } from 'apollo-boost';
import React from 'react';
import { LinkButton } from '../../../styling/styleUtils';
import { SuccessResponse } from '../AdminMountains';

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
      const { state } = mountain;
      return (
        <li key={mountain.id}>
          <strong><LinkButton
            onClick={() => editMountain(mountain.id)}
          >{mountain.name}</LinkButton></strong>
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
              State: {state !== null ? state.name : 'N/A'},
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
