import { ApolloError } from 'apollo-boost';
import React from 'react';
import { LinkButton } from '../../../styling/styleUtils';
import { SuccessResponse } from '../AdminRegions';

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
          <strong><LinkButton
            onClick={() => editRegion(region.id)}
          >{region.name}</LinkButton></strong>
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
