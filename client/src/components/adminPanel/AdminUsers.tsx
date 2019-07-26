import gql from 'graphql-tag';
import React from 'react';
import {
  Query,
  QueryResult,
} from 'react-apollo';
import { User } from '../../types/graphQLTypes';

const query = gql`
  query AdminPanel{
    users {
      id
      name
      friends {
        id
        name
      }
    }
  }
`;

interface SuccessResponse {
  users: Array<{
    id: User['id'];
    name: User['name'];
    friends: Array<{
      id: User['id'];
      name: User['name'];
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
      const { users } = data;
      const userElms = users.map(user => {
        const friendElms = user.friends.map(friend => {
          return (
            <li key={friend.id}>
              {friend.name}
            </li>
          );
        });
        return (
          <li key={user.id}>
            {user.name}
            <ul>
              <li>Friends</li>
              <ul>
                {friendElms}
              </ul>
            </ul>
          </li>
        );
      });
      out = (
        <>
          {userElms}
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
