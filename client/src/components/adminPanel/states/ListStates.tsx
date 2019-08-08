import { ApolloError } from 'apollo-boost';
import React from 'react';
import styled from 'styled-components';
import { SuccessResponse } from '../AdminStates';

const StateName = styled.a`
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
          <strong><StateName
            onClick={() => editState(state.id)}
          >{state.name} ({state.abbreviation})</StateName></strong>
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
