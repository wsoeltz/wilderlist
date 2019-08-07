import React from 'react';
import { ApolloError } from 'apollo-boost';
import { SuccessResponse } from '../AdminRegions';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteRegion: (name: string) => void;
}

const ListRegions = (props: Props) => {
  const {loading, error, data, deleteRegion} = props;

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
          <strong>{region.name}</strong>
          <button>Edit</button>
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
