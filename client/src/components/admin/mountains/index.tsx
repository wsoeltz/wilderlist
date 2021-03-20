import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { Mountain, PermissionTypes } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {
  NavButtonLink,
  SubNav,
} from '../sharedStyles';
import ListMountains from './ListMountains';

const getMountainsQuery = `
      id
      name
      elevation
      state {
        id
        name
        abbreviation
      }
      author {
        id
        name
        mountainPermissions
        email
      }
      flag
      status
`;

export const GET_MOUNTAINS = gql`
  query ListMountains {
    mountains: newestMountains {
      ${getMountainsQuery}
    }
  }
`;

const GET_FLAGGED_MOUNTAINS = gql`
  query ListFlaggedMountains {
    mountains: flaggedMountains {
      ${getMountainsQuery}
    }
  }
`;

const GET_PENDING_MOUNTAINS = gql`
  query ListPendingMountains {
    mountains: pendingMountains {
      ${getMountainsQuery}
    }
  }
`;

const DELETE_MOUNTAIN = gql`
  mutation($id: ID!) {
    deleteMountain(id: $id) {
      id
    }
  }
`;

export interface SuccessResponse {
  mountains: Mountain[];
}

enum MountainsToShow {
  all,
  pending,
  flagged,
}

const AdminMountains = () => {

  const user = useCurrentUser();

  const [mountainsToShow, setMountainsToShow] = useState<MountainsToShow>(MountainsToShow.all);

  let query;
  if (mountainsToShow === MountainsToShow.all) {
    query = GET_MOUNTAINS;
  } else if (mountainsToShow === MountainsToShow.flagged) {
    query = GET_FLAGGED_MOUNTAINS;
  } else if (mountainsToShow === MountainsToShow.pending) {
    query = GET_PENDING_MOUNTAINS;
  } else {
    query = GET_MOUNTAINS;
    failIfValidOrNonExhaustive(mountainsToShow,
      'Invalid type for mountainsToShow ' + mountainsToShow);
  }

  const {loading, error, data, client} = useQuery<SuccessResponse>(query);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [deleteMountainMutation] = useMutation(DELETE_MOUNTAIN, {
    onCompleted: client.resetStore,
  });

  const deleteMountain = (id: string) => {
    const mountainToDelete = data && data.mountains
      ? data.mountains.find(mtn => mtn.id === id) : undefined;
    const authorId = mountainToDelete && mountainToDelete.author
      ? mountainToDelete.author.id : null;
    if (user &&
        (user._id === authorId || user.permissions === PermissionTypes.admin)
       ) {
      deleteMountainMutation({ variables: { id } });
    }
  };

  const filterMountains = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <div>
        <div>
          <SubNav>
            <NavButtonLink
              onClick={() => setMountainsToShow(MountainsToShow.all)}
            >
              Newest mountains
            </NavButtonLink>
            <NavButtonLink
              onClick={() => setMountainsToShow(MountainsToShow.pending)}
            >
              Pending mountains
            </NavButtonLink>
            <NavButtonLink
              onClick={() => setMountainsToShow(MountainsToShow.flagged)}
            >
              Flagged mountains
            </NavButtonLink>
          </SubNav>
          <StandardSearch
            placeholder={'Filter mountains'}
            setSearchQuery={filterMountains}
            focusOnMount={false}
            initialQuery={searchQuery}
          />
        </div>
        <div>
          <ListMountains
            loading={loading}
            error={error}
            data={data}
            deleteMountain={deleteMountain}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </>
  );
};

export default withRouter(AdminMountains);
