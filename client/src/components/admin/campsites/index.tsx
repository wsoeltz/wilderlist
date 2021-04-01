import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { Campsite, PermissionTypes } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {
  NavButtonLink,
  SubNav,
} from '../sharedStyles';
import ListCampsites from './ListCampsites';

const getCampsitesQuery = `
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
        campsitePermissions
        email
      }
      flag
      status
`;

const GET_CAMPSITES = gql`
  query ListCampsites {
    campsites: newestCampsites {
      ${getCampsitesQuery}
    }
  }
`;

const GET_FLAGGED_CAMPSITES = gql`
  query ListFlaggedCampsites {
    campsites: flaggedCampsites {
      ${getCampsitesQuery}
    }
  }
`;

const GET_PENDING_CAMPSITES = gql`
  query ListPendingCampsites {
    campsites: pendingCampsites {
      ${getCampsitesQuery}
    }
  }
`;

const DELETE_CAMPSITE = gql`
  mutation($id: ID!) {
    deleteCampsite(id: $id) {
      id
    }
  }
`;

export interface SuccessResponse {
  campsites: Campsite[];
}

enum CampsitesToShow {
  all,
  pending,
  flagged,
}

const AdminCampsites = () => {

  const user = useCurrentUser();

  const [campsitesToShow, setCampsitesToShow] = useState<CampsitesToShow>(CampsitesToShow.all);

  let query;
  if (campsitesToShow === CampsitesToShow.all) {
    query = GET_CAMPSITES;
  } else if (campsitesToShow === CampsitesToShow.flagged) {
    query = GET_FLAGGED_CAMPSITES;
  } else if (campsitesToShow === CampsitesToShow.pending) {
    query = GET_PENDING_CAMPSITES;
  } else {
    query = GET_CAMPSITES;
    failIfValidOrNonExhaustive(campsitesToShow,
      'Invalid type for campsitesToShow ' + campsitesToShow);
  }

  const {loading, error, data, client} = useQuery<SuccessResponse>(query);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [deleteCampsiteMutation] = useMutation(DELETE_CAMPSITE, {
    onCompleted: client.resetStore,
  });

  const deleteCampsite = (id: string) => {
    const campsiteToDelete = data && data.campsites
      ? data.campsites.find(mtn => mtn.id === id) : undefined;
    const authorId = campsiteToDelete && campsiteToDelete.author
      ? campsiteToDelete.author.id : null;
    if (user &&
        (user._id === authorId || user.permissions === PermissionTypes.admin)
       ) {
      deleteCampsiteMutation({ variables: { id } });
    }
  };

  const filterCampsites = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <div>
        <div>
          <SubNav>
            <NavButtonLink
              onClick={() => setCampsitesToShow(CampsitesToShow.all)}
              style={{
                fontWeight: campsitesToShow === CampsitesToShow.all ? 600 : undefined,
                color: campsitesToShow === CampsitesToShow.all ? '#333' : undefined,
                textDecoration: campsitesToShow === CampsitesToShow.all ? 'none' : undefined,
              }}
            >
              Newest
            </NavButtonLink>
            <NavButtonLink
              onClick={() => setCampsitesToShow(CampsitesToShow.pending)}
              style={{
                fontWeight: campsitesToShow === CampsitesToShow.pending ? 600 : undefined,
                color: campsitesToShow === CampsitesToShow.pending ? '#333' : undefined,
                textDecoration: campsitesToShow === CampsitesToShow.pending ? 'none' : undefined,
              }}
            >
              Pending
            </NavButtonLink>
            <NavButtonLink
              onClick={() => setCampsitesToShow(CampsitesToShow.flagged)}
              style={{
                fontWeight: campsitesToShow === CampsitesToShow.flagged ? 600 : undefined,
                color: campsitesToShow === CampsitesToShow.flagged ? '#333' : undefined,
                textDecoration: campsitesToShow === CampsitesToShow.flagged ? 'none' : undefined,
              }}
            >
              Flagged
            </NavButtonLink>
          </SubNav>
          <StandardSearch
            placeholder={'Filter campsites'}
            setSearchQuery={filterCampsites}
            focusOnMount={false}
            initialQuery={searchQuery}
          />
        </div>
        <div>
          <ListCampsites
            loading={loading}
            error={error}
            data={data}
            deleteCampsite={deleteCampsite}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </>
  );
};

export default withRouter(AdminCampsites);
