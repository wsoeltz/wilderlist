import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Mountain, PeakList } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import AddPeakList from './peakLists/AddPeakList';
// import EditPeakList from './peakLists/EditPeakList';
import ListPeakLists from './peakLists/ListPeakLists';

const Root = styled.div`
  display: grid;
  grid-template-columns: 5fr 3fr;
  column-gap: 2rem;
`;

const PeakListListColumn = styled.div`
  grid-column: 1;
`;

const PeakListEditColumn = styled.div`
  grid-column: 2;
`;

export const GET_PEAK_LISTS = gql`
  query ListPeakLists {
    peakLists {
      id
      name
      shortName
      variants {
        standard
        winter
        fourSeason
        grid
      }
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
    $standardVariant: Boolean!,
    $winterVariant: Boolean!,
    $fourSeasonVariant: Boolean!,
    $gridVariant: Boolean!,
    $mountains: [ID],
  ) {
    addPeakList(
      name: $name,
      shortName: $shortName,
      standardVariant: $standardVariant,
      winterVariant: $winterVariant,
      fourSeasonVariant: $fourSeasonVariant,
      gridVariant: $gridVariant,
      mountains: $mountains,
    ) {
      id
      name
      shortName
      variants {
        standard
        winter
        fourSeason
        grid
      }
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
  standardVariant: boolean;
  winterVariant: boolean;
  fourSeasonVariant: boolean;
  gridVariant: boolean;
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
    variants: PeakList['variants'];
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
      // editPanel = (
      //   <>
      //     <EditPeakList
      //       stateId={peakListToEdit}
      //       cancel={clearEditPeakListPanel}
      //     />
      //   </>
      // );
      editPanel = null;
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
    <Root>
      <h2>Mountains</h2>
      <PeakListListColumn>
        <ListPeakLists
          loading={loading}
          error={error}
          data={data}
          deletePeakList={deletePeakList}
          editPeakList={editPeakList}
        />
      </PeakListListColumn>
      <PeakListEditColumn>
        {editPanel}
      </PeakListEditColumn>
    </Root>
  );
};

export default AdminPanel;
