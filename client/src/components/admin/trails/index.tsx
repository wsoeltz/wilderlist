import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { PermissionTypes, Trail } from '../../../types/graphQLTypes';
import StandardSearch from '../../sharedComponents/StandardSearch';
import ListTrails from './ListTrails';

const GET_FLAGGED_TRAILS = gql`
  query ListFlaggedTrails {
    trails: flaggedTrails {
      id
      name
      flag
    }
  }
`;

const DELETE_TRAIL = gql`
  mutation($id: ID!) {
    deleteTrail(id: $id) {
      id
    }
  }
`;

export interface SuccessResponse {
  trails: Trail[];
}

const AdminTrails = () => {

  const user = useCurrentUser();

  const {loading, error, data, client} = useQuery<SuccessResponse>(GET_FLAGGED_TRAILS);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [deleteTrailMutation] = useMutation(DELETE_TRAIL, {
    onCompleted: client.resetStore,
  });

  const deleteTrail = (id: string) => {
    if (user && user.permissions === PermissionTypes.admin) {
      deleteTrailMutation({ variables: { id } });
    }
  };

  const filterTrails = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <h3 style={{textAlign: 'center'}}>Flagged Trails</h3>
      <div>
        <div>
          <StandardSearch
            placeholder={'Filter trails'}
            setSearchQuery={filterTrails}
            focusOnMount={false}
            initialQuery={searchQuery}
          />
        </div>
        <div>
          <ListTrails
            loading={loading}
            error={error}
            data={data}
            deleteTrail={deleteTrail}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </>
  );
};

export default withRouter(AdminTrails);
