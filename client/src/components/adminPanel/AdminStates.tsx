import gql from 'graphql-tag';
import React from 'react';
import {
  Query,
  QueryResult,
} from 'react-apollo';
import { Mountain, State } from '../../types/graphQLTypes';

const query = gql`
  query AdminStates{
    states {
      id
      name
      mountains {
        id
        name
      }
    }
  }
`;

interface SuccessResponse {
  states: Array<{
    id: State['id'];
    name: State['name'];
    mountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
    }>
  }>;
}

type Result = QueryResult<SuccessResponse>;

const AdminPanel = () => {
  const renderProp = (result: Result) => {
    const {loading, error, data} = result;
    let out: React.ReactElement<any> | null;
    if (loading === true) {
      out = null;
    } else if (error !== undefined) {
      console.error(error);
      out = null;
    } else if (data !== undefined) {
      const { states } = data;
      const stateElms = states.map(state => {
        const mountainElms = state.mountains.map(mountain => {
          return (
            <li key={mountain.id}>
              {mountain.name}
            </li>
          );
        });
        return (
          <li key={state.id}>
            {state.name}
            <ul>
              {mountainElms}
            </ul>
          </li>
        );
      });
      out = (
        <>
          <h3>States</h3>
          {stateElms}
        </>
      );
    } else {
      out = null;
    }
    return out;
  };
  return (
    <Query
      query={query}
      children={renderProp}
    />
  );
};

export default AdminPanel;
