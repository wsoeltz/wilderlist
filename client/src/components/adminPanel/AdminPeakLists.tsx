import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge as PeakListListColumn,
  ContentRightSmall as PeakListEditColumn,
} from '../../styling/Grid';
import { ButtonPrimary } from '../../styling/styleUtils';
import { PeakList, PeakListVariants, State } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import StandardSearch from '../sharedComponents/StandardSearch';
import AddPeakList from './peakLists/AddPeakList';
import EditPeakList from './peakLists/EditPeakList';
import ListPeakLists from './peakLists/ListPeakLists';

export const GET_PEAK_LISTS = gql`
  query ListPeakLists {
    peakLists {
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
    }
  }
`;

const ADD_PEAK_LIST = gql`
  mutation(
    $name: String!,
    $shortName: String!,
    $description: String,
    $type: PeakListVariants!,
    $mountains: [ID],
    $optionalMountains: [ID],
    $states: [ID],
    $parent: ID,
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
    ) {
      id
      name
      shortName
      description
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
}

export interface SuccessResponse {
  peakLists: PeakListDatum[];
}

enum EditPeakListPanelEnum {
  Empty,
  New,
  Update,
}

const AdminPeakLists = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_PEAK_LISTS);
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
    failIfValidOrNonExhaustive(editPeakListPanel, 'Invalid value for editPeakListPanel ' + editPeakListPanel);
    editPanel = null;
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
      <PeakListEditColumn>
        <ContentBody>
        {editPanel}
        </ContentBody>
      </PeakListEditColumn>
    </>
  );
};

export default withRouter(AdminPeakLists);
