import { ApolloError } from 'apollo-boost';
import React from 'react';
import { LinkButton } from '../../../styling/styleUtils';
import { SuccessResponse } from '../AdminStates';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: SuccessResponse | undefined;
  deleteState: (id: string) => void;
  editState: (id: string) => void;
}

const ListStates = (props: Props) => {
  const {loading, error, data, deleteState, editState} = props;

  if (loading === true) {
    return (<p>Loading</p>);
  } else if (error !== undefined) {
    console.error(error);
    return (<p>There was an error</p>);
  } else if (data !== undefined) {
    const { states } = data;
    const stateElms = states.map(state => {
      const regionElms = state.regions.map(({name}) => name + ', ');
      return (
        <li key={state.id}>
          <strong><LinkButton
            onClick={() => editState(state.id)}
          >{state.name} ({state.abbreviation})</LinkButton></strong>
          <button
            onClick={() => deleteState(state.id)}
          >
            Delete
          </button>
          <div>
            <small>{regionElms}</small>
          </div>
        </li>
      );
    });
    return(
      <>
        {stateElms}
      </>
    );
  } else {
    return null;
  }
};

export default ListStates;
