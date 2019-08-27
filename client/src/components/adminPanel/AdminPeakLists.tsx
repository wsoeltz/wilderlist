import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge as PeakListListColumn,
  ContentRightSmall as PeakListEditColumn,
} from '../../styling/Grid';
import { Mountain, PeakList, PeakListVariants } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
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
      mountains {
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
    $type: PeakListVariants!,
    $mountains: [ID],
  ) {
    addPeakList(
      name: $name,
      shortName: $shortName,
      type: $type,
      mountains: $mountains,
    ) {
      id
      name
      shortName
      type
      mountains {
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
}

const DELETE_PEAK_LIST = gql`
  mutation($id: ID!) {
    deletePeakList(id: $id) {
      id
    }
  }
`;

export interface SuccessResponse {
  peakLists: Array<{
    id: PeakList['id'];
    name: PeakList['name'];
    shortName: PeakList['shortName'];
    type: PeakList['type'];
    mountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
    }>
  }>;
}

enum EditPeakListPanelEnum {
  Empty,
  New,
  Update,
}

const AdminPanel = () => {
  const {loading, error, data} = useQuery<SuccessResponse>(GET_PEAK_LISTS);
  const [editPeakListPanel, setEditPeakListPanel] = useState<EditPeakListPanelEnum>(EditPeakListPanelEnum.Empty);
  const [peakListToEdit, setPeakListToEdit] = useState<string | null>(null);
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
      <button onClick={createNewButtonClick}>
        Create new peak list
      </button>
    );
  } else if (editPeakListPanel === EditPeakListPanelEnum.New) {
    editPanel = (
      <>
        <AddPeakList
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

  return (
    <>
      <PeakListListColumn>
        <ContentHeader>
          <h2>Peak Lists</h2>
        </ContentHeader>
        <ContentBody>
          <ListPeakLists
            loading={loading}
            error={error}
            data={data}
            deletePeakList={deletePeakList}
            editPeakList={editPeakList}
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

export default AdminPanel;
