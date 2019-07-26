import gql from 'graphql-tag';
import React from 'react';
import {
  Query,
  QueryResult,
} from 'react-apollo';

const query = gql`
  query AdminPanel{
    lists {
      id
      name
      items {
        id
        name
        state {
          name
        }
      }
    }
  }
`;

interface SuccessResponse {
  lists: Array<{
    id: string;
    name: string;
    items: Array<{
      id: string;
      name: string;
      state: {
        name: string;
      }
    }>;
  }>;
}

type Result = QueryResult<SuccessResponse, Variables>;

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
      const { lists } = data;
      const listElms = lists.map(list => {
        const mountainElms = list.items.map(mountain => {
          return (
            <li key={mountain.id}>
              {mountain.name}, {mountain.state.name}
            </li>
          );
        });
        return (
          <li key={list.id}>
            {list.name}
            <ul>
              {mountainElms}
            </ul>
          </li>
        );
      });
      out = (
        <>
          {listElms}
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
