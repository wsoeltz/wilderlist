import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { PeakList, State } from '../../../types/graphQLTypes';
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
        name
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
              style={{
                fontWeight: peakListsToShow === PeakListsToShow.all ? 600 : undefined,
                color: peakListsToShow === PeakListsToShow.all ? '#333' : undefined,
                textDecoration: peakListsToShow === PeakListsToShow.all ? 'none' : undefined,
              }}
            >
              Newest
            </NavButtonLink>
            <NavButtonLink
              onClick={() => setPeakListsToShow(PeakListsToShow.pending)}
              style={{
                fontWeight: peakListsToShow === PeakListsToShow.pending ? 600 : undefined,
                color: peakListsToShow === PeakListsToShow.pending ? '#333' : undefined,
                textDecoration: peakListsToShow === PeakListsToShow.pending ? 'none' : undefined,
              }}
            >
              Pending
            </NavButtonLink>
            <NavButtonLink
              onClick={() => setPeakListsToShow(PeakListsToShow.flagged)}
              style={{
                fontWeight: peakListsToShow === PeakListsToShow.flagged ? 600 : undefined,
                color: peakListsToShow === PeakListsToShow.flagged ? '#333' : undefined,
                textDecoration: peakListsToShow === PeakListsToShow.flagged ? 'none' : undefined,
              }}
            >
              Flagged
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
