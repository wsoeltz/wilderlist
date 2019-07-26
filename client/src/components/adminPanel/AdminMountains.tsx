import gql from 'graphql-tag';
import React from 'react';
import {
  Query,
  QueryResult,
} from 'react-apollo';
import { Mountain, State } from '../../types/graphQLTypes';

const query = gql`
  query AdminPanel{
    mountains {
      id
      name
      state {
        id
        name
      }
    }
  }
`;

interface SuccessResponse {
  mountains: Array<{
    id: Mountain['id'];
    name: Mountain['name'];
    state: {
      id: State['id'];
      name: State['name'];
    }
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
      const { mountains } = data;
      const mountainElms = mountains.map(mountain => {
        return (
          <li key={mountain.id}>
            {mountain.name}, {mountain.state.name}
          </li>
        );
      });
      out = (
        <>
          {mountainElms}
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
