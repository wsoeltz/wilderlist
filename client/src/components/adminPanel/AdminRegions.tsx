import gql from 'graphql-tag';
import React from 'react';
import {
  Query,
  QueryResult,
} from 'react-apollo';
import { Region, State } from '../../types/graphQLTypes';

const query = gql`
  query AdminPanel{
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

interface SuccessResponse {
  regions: Array<{
    id: Region['id'];
    name: Region['name'];
    states: Array<{
      id: State['id'];
      name: State['name'];
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
      const { regions } = data;
      const regionElms = regions.map(region => {
        const mountainElms = region.states.map(state => {
          return (
            <li key={state.id}>
              {state.name}
            </li>
          );
        });
        return (
          <li key={region.id}>
            {region.name}
            <ul>
              {mountainElms}
            </ul>
          </li>
        );
      });
      out = (
        <>
          {regionElms}
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
