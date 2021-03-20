import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { ExternalResource, PeakList, PeakListVariants, State } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import StandardSearch from '../../sharedComponents/StandardSearch';
import {
  NavButtonLink,
  SubNav,
} from '../sharedStyles';
import ListPeakLists, {PermissionsSuccessResponse} from './ListPeakLists';

const getPeakListsQuery = `
      id
      name
      shortName
      type
      searchString
      parent {
        id
        name
        type
      }
      states {
        id
        name
      }
      status
      flag
      author {
        id
        email
        peakListPermissions
      }
`;

const GET_PEAK_LISTS = gql`
  query ListPeakLists {
    peakLists: newestPeakLists {
      ${getPeakListsQuery}
    }
  }
`;

const GET_FLAGGED_PEAK_LISTS = gql`
  query ListFlaggedPeakLists {
    peakLists: flaggedPeakLists {
      ${getPeakListsQuery}
    }
  }
`;

const GET_PENDING_PEAK_LISTS = gql`
  query ListPendingPeakLists {
    peakLists: pendingPeakLists {
      ${getPeakListsQuery}
    }
  }
`;

export interface AddPeakListVariables {
  name: string;
  shortName: string;
  type: PeakListVariants;
  mountains: string[];
  optionalMountains: string[];
  states: string[];
  parent: string | null;
  description: string | null;
  optionalPeaksDescription: string | null;
  resources: ExternalResource[];
}

const DELETE_PEAK_LIST = gql`
  mutation($id: ID!) {
    deletePeakList(id: $id) {
      id
    }
  }
`;

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  description: PeakList['description'];
  optionalPeaksDescription: PeakList['optionalPeaksDescription'];
  type: PeakList['type'];
  searchString: PeakList['searchString'];
  parent: {
    id: PeakList['id'];
    name: PeakList['name'];
    type: PeakList['type'];
  };
  states: Array<{
    id: State['id'];
    name: State['name'];
  }>;
  status: PeakList['status'];
  flag: PeakList['flag'];
  author: PermissionsSuccessResponse['user'];
}

export interface SuccessResponse {
  peakLists: PeakListDatum[];
}

enum PeakListsToShow {
  all,
  pending,
  flagged,
}

const AdminPeakLists = () => {

  const [peakListsToShow, setPeakListsToShow] = useState<PeakListsToShow>(PeakListsToShow.all);

  let query;
  if (peakListsToShow === PeakListsToShow.all) {
    query = GET_PEAK_LISTS;
  } else if (peakListsToShow === PeakListsToShow.flagged) {
    query = GET_FLAGGED_PEAK_LISTS;
  } else if (peakListsToShow === PeakListsToShow.pending) {
    query = GET_PENDING_PEAK_LISTS;
  } else {
    query = GET_PEAK_LISTS;
    failIfValidOrNonExhaustive(peakListsToShow,
      'Invalid type for peakListsToShow ' + peakListsToShow);
  }

  const {loading, error, data, client} = useQuery<SuccessResponse>(query);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [deletePeakListMutation] = useMutation(DELETE_PEAK_LIST, {
    onCompleted: client.resetStore,
  });

  const deletePeakList = (id: string) => {
    deletePeakListMutation({ variables: { id } });
  };

  const filterPeakLists = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <>
        <div>
          <SubNav>
            <NavButtonLink
              onClick={() => setPeakListsToShow(PeakListsToShow.all)}
            >
              Newest peakLists
            </NavButtonLink>
            <NavButtonLink
              onClick={() => setPeakListsToShow(PeakListsToShow.pending)}
            >
              Pending peakLists
            </NavButtonLink>
            <NavButtonLink
              onClick={() => setPeakListsToShow(PeakListsToShow.flagged)}
            >
              Flagged peakLists
            </NavButtonLink>
          </SubNav>
          <StandardSearch
            placeholder={'Filter peak lists'}
            setSearchQuery={filterPeakLists}
            focusOnMount={false}
            initialQuery={searchQuery}
          />
        </div>
        <div>
          <ListPeakLists
            loading={loading}
            error={error}
            data={data}
            deletePeakList={deletePeakList}
            searchQuery={searchQuery}
          />
        </div>
      </>
    </>
  );
};

export default withRouter(AdminPeakLists);
