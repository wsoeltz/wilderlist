import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
  ContentBody,
  ContentContainer as MountainListColumn,
  ContentHeader,
} from '../../styling/Grid';
import { ButtonPrimary } from '../../styling/styleUtils';
import { Mountain, PermissionTypes } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import StandardSearch from '../sharedComponents/StandardSearch';
import { GET_PEAK_LISTS } from './AdminPeakLists';
import AddMountain from './mountains/AddMountain';
import EditMountain from './mountains/EditMountain';
import ListMountains from './mountains/ListMountains';
import {
  NavButtonLink,
  SubNav,
} from './sharedStyles';

const getMountainsQuery = `
      id
      name
      latitude
      longitude
      elevation
      prominence
      state {
        id
        name
        abbreviation
      }
      author {
        id
        mountainPermissions
        email
      }
      flag
      status
`;

export const GET_MOUNTAINS = gql`
  query ListMountains {
    mountains {
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

const ADD_MOUNTAIN = gql`
  mutation addNewMountain(
      $name: String!,
      $latitude: Float!,
      $longitude: Float!,
      $elevation: Float!,
      $prominence: Float,
      $state: ID!,
      $author: ID!,
    ) {
    addMountain(
      name: $name,
      latitude: $latitude,
      longitude: $longitude,
      elevation: $elevation,
      prominence: $prominence,
      state: $state,
      author: $author,
    ) {
      ${getMountainsQuery}
    }
  }
`;

const EDIT_MOUNTAIN = gql`
  mutation (
      $id: ID!,
      $name: String!,
      $latitude: Float!,
      $longitude: Float!,
      $elevation: Float!,
      $prominence: Float,
      $state: ID!,
    ) {
    updateMountain(
      id: $id
      name: $name,
      latitude: $latitude,
      longitude: $longitude,
      elevation: $elevation,
      prominence: $prominence,
      state: $state,
    ) {
      ${getMountainsQuery}
    }
  }
`;

interface BaseMountainVariables {
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  prominence: number | null;
  state: string;
}

export interface AddMountainVariables extends BaseMountainVariables {
  author: string;
}

export interface EditMountainVariables extends BaseMountainVariables {
  id: string;
}

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

enum EditMountainPanelEnum {
  Empty,
  New,
  Update,
}

enum MountainsToShow {
  all,
  pending,
  flagged,
}

const AdminMountains = () => {

  const user = useCurrentUser();

  const [mountainsToShow, setMountainsToShow] = useState<MountainsToShow>(MountainsToShow.pending);

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

  const {loading, error, data} = useQuery<SuccessResponse>(query);

  const [editMountainPanel, setEditMountainPanel] = useState<EditMountainPanelEnum>(EditMountainPanelEnum.Empty);
  const [mountainToEdit, setMountainToEdit] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const clearEditMountainPanel = () => {
    setEditMountainPanel(EditMountainPanelEnum.Empty);
    setMountainToEdit(null);
  };

  const [deleteMountainMutation] = useMutation(DELETE_MOUNTAIN, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_MOUNTAINS });
      if (response !== null && response.mountains !== null) {
        cache.writeQuery({
          query: GET_MOUNTAINS,
          data: { mountains: response.mountains.filter(({id}) => id !== successData.deleteMountain.id) },
        });
      }
    },
    refetchQueries: () => [{query: GET_PEAK_LISTS}],
  });

  const [addMountain] = useMutation<any, AddMountainVariables>(ADD_MOUNTAIN, {
    update: (cache, { data: successData }) => {
      const response: SuccessResponse | null = cache.readQuery({ query: GET_MOUNTAINS });
      if (response !== null && response.mountains !== null) {
        cache.writeQuery({
          query: GET_MOUNTAINS,
          data: { mountains: response.mountains.concat([successData.addMountain]) },
        });
      }
    },
    refetchQueries: () => [{query: GET_PEAK_LISTS}],
  });

  const [updateMountain] = useMutation<any, EditMountainVariables>(EDIT_MOUNTAIN);

  let editPanel: React.ReactElement<any> | null;
  if (editMountainPanel === EditMountainPanelEnum.Empty) {
    const createNewButtonClick = () => {
      setMountainToEdit(null);
      setEditMountainPanel(EditMountainPanelEnum.New);
    };
    editPanel = (
      <ButtonPrimary onClick={createNewButtonClick}>
        Create new mountain
      </ButtonPrimary>
    );
  } else if (editMountainPanel === EditMountainPanelEnum.New) {
    editPanel = (
      <>
        <AddMountain
          addMountain={(variables: AddMountainVariables) => addMountain({ variables: { ...variables } })}
          cancel={clearEditMountainPanel}
        />
      </>
    );
  } else if (editMountainPanel === EditMountainPanelEnum.Update) {
    if (mountainToEdit !== null) {
      editPanel = (
        <>
          <EditMountain
            mountainId={mountainToEdit}
            editMountain={(variables: EditMountainVariables) => updateMountain({ variables: { ...variables } })}
            cancel={clearEditMountainPanel}
            key={mountainToEdit}
          />
        </>
      );
    } else {
      editPanel = null;
    }
  } else {
    editPanel = null;
    failIfValidOrNonExhaustive(editMountainPanel, 'Invalid value for editMountainPanel ' + editMountainPanel);
  }

  const editMountain = (id: string) => {
    setEditMountainPanel(EditMountainPanelEnum.Update);
    setMountainToEdit(id);
  };

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
    clearEditMountainPanel();
  };

  const filterMountains = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <MountainListColumn>
        <ContentHeader>
          <h2>Mountains</h2>
          <SubNav>
            <NavButtonLink
              onClick={() => setMountainsToShow(MountainsToShow.all)}
            >
              All mountains
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
        </ContentHeader>
        <ContentBody>
          <ListMountains
            loading={loading}
            error={error}
            data={data}
            deleteMountain={deleteMountain}
            editMountain={editMountain}
            searchQuery={searchQuery}
          />
        </ContentBody>
      </MountainListColumn>
      <div>
        <ContentBody>
        {editPanel}
        </ContentBody>
      </div>
    </>
  );
};

export default withRouter(AdminMountains);
