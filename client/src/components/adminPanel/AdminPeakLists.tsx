import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import {
  ContentBody,
  ContentContainer as PeakListListColumn,
  ContentHeader,
} from '../../styling/Grid';
import { ButtonPrimary } from '../../styling/styleUtils';
import { ExternalResource, PeakList, PeakListVariants, State } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import StandardSearch from '../sharedComponents/StandardSearch';
import AddPeakList from './peakLists/AddPeakList';
import EditPeakList from './peakLists/EditPeakList';
import ListPeakLists, {PermissionsSuccessResponse} from './peakLists/ListPeakLists';
import {
  NavButtonLink,
  SubNav,
} from './sharedStyles';

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

export const GET_PEAK_LISTS = gql`
  query ListPeakLists {
    peakLists {
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

const ADD_PEAK_LIST = gql`
  mutation(
    $name: String!,
    $shortName: String!,
    $description: String,
    $optionalPeaksDescription: String,
    $type: PeakListVariants!,
    $mountains: [ID],
    $optionalMountains: [ID],
    $states: [ID],
    $parent: ID,
    $resources: [ExternalResourcesInputType],
  ) {
    addPeakList(
      name: $name,
      shortName: $shortName,
      type: $type,
      mountains: $mountains,
      optionalMountains: $optionalMountains,
      states: $states,
      parent: $parent,
      description: $description,
      optionalPeaksDescription: $optionalPeaksDescription,
      resources: $resources,
    ) {
      id
      name
      shortName
      description
      optionalPeaksDescription
      type
      searchString
      mountains {
        id
        name
      }
      optionalMountains {
        id
        name
      }
      states {
        id
        name
      }
      parent {
        id
        name
      }
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

enum EditPeakListPanelEnum {
  Empty,
  New,
  Update,
}

enum PeakListsToShow {
  all,
  pending,
  flagged,
}

const AdminPeakLists = () => {

  const [peakListsToShow, setPeakListsToShow] = useState<PeakListsToShow>(PeakListsToShow.pending);

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

  const {loading, error, data} = useQuery<SuccessResponse>(query);
  const [editPeakListPanel, setEditPeakListPanel] = useState<EditPeakListPanelEnum>(EditPeakListPanelEnum.Empty);
  const [peakListToEdit, setPeakListToEdit] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const clearEditPeakListPanel = () => {
    setEditPeakListPanel(EditPeakListPanelEnum.Empty);
    setPeakListToEdit(null);
  };

  const [deletePeakListMutation] = useMutation(DELETE_PEAK_LIST, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_PEAK_LISTS });
      if (response !== null && response.peakLists !== null) {
        cache.writeQuery({
          query: GET_PEAK_LISTS,
          data: { peakLists: response.peakLists.filter(({id}) => id !== successData.deletePeakList.id) },
        });
      }
    },
  });

  const [addPeakList] = useMutation<any, AddPeakListVariables>(ADD_PEAK_LIST, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_PEAK_LISTS });
      if (response !== null && response.peakLists !== null) {
        cache.writeQuery({
          query: GET_PEAK_LISTS,
          data: { peakLists: response.peakLists.concat([successData.addPeakList]) },
        });
      }
    },
  });

  let editPanel: React.ReactElement<any> | null;
  if (editPeakListPanel === EditPeakListPanelEnum.Empty) {
    const createNewButtonClick = () => {
      setPeakListToEdit(null);
      setEditPeakListPanel(EditPeakListPanelEnum.New);
    };
    editPanel = (
      <ButtonPrimary onClick={createNewButtonClick}>
        Create new peak list
      </ButtonPrimary>
    );
  } else if (editPeakListPanel === EditPeakListPanelEnum.New) {
    editPanel = (
      <>
        <AddPeakList
          listDatum={data}
          addPeakList={
            (input: AddPeakListVariables) =>
              addPeakList({ variables: { ...input } })
          }
          cancel={clearEditPeakListPanel}
        />
      </>
    );
  } else if (editPeakListPanel === EditPeakListPanelEnum.Update) {
    if (peakListToEdit !== null) {
      editPanel = (
        <>
          <EditPeakList
            listDatum={data}
            peakListId={peakListToEdit}
            cancel={clearEditPeakListPanel}
            key={peakListToEdit}
          />
        </>
      );
    } else {
      editPanel = null;
    }
  } else {
    editPanel = null;
    failIfValidOrNonExhaustive(editPeakListPanel, 'Invalid value for editPeakListPanel ' + editPeakListPanel);
  }

  const editPeakList = (id: string) => {
    setEditPeakListPanel(EditPeakListPanelEnum.Update);
    setPeakListToEdit(id);
  };

  const deletePeakList = (id: string) => {
    deletePeakListMutation({ variables: { id } });
    clearEditPeakListPanel();
  };

  const filterPeakLists = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <PeakListListColumn>
        <ContentHeader>
          <h2>Peak Lists</h2>
          <SubNav>
            <NavButtonLink
              onClick={() => setPeakListsToShow(PeakListsToShow.all)}
            >
              All peakLists
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
        </ContentHeader>
        <ContentBody>
          <ListPeakLists
            loading={loading}
            error={error}
            data={data}
            deletePeakList={deletePeakList}
            editPeakList={editPeakList}
            searchQuery={searchQuery}
          />
        </ContentBody>
      </PeakListListColumn>
      <div>
        <ContentBody>
        {editPanel}
        </ContentBody>
      </div>
    </>
  );
};

export default withRouter(AdminPeakLists);
