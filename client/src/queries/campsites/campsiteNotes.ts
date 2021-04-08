import { gql, useMutation, useQuery } from '@apollo/client';
import {
  User,
} from '../../types/graphQLTypes';

const GET_CAMPSITE_NOTE = gql`
  query getCampsiteNote($userId: ID, $campsiteId: ID) {
    user(id: $userId) {
      id
      campsiteNote(campsiteId: $campsiteId) {
        id
        text
      }
    }
  }
`;

interface QuerySuccessResponse {
  user: null | {
    id: User['name'];
    campsiteNote: User['campsiteNote'];
  };
}

interface QueryVariables {
  userId: string | null;
  campsiteId: string | null;
}

const ADD_CAMPSITE_NOTE = gql`
  mutation($userId: ID!, $campsiteId: ID!, $text: String!) {
    user: addCampsiteNote(
      userId: $userId,
      campsiteId: $campsiteId,
      text: $text
    ) {
      id
      campsiteNote(campsiteId: $campsiteId) {
        id
        text
      }
    }
  }
`;

const EDIT_CAMPSITE_NOTE = gql`
  mutation($userId: ID!, $campsiteId: ID!, $text: String!) {
    user: editCampsiteNote(
      userId: $userId,
      campsiteId: $campsiteId,
      text: $text
    ) {
      id
      campsiteNote(campsiteId: $campsiteId) {
        id
        text
      }
    }
  }
`;

interface CampsiteNoteSuccess {
  user: {
    id: User['id'];
    campsiteNote: User['campsiteNote'];
  };
}

interface Variables {
  userId: string;
  campsiteId: string;
  text: string;
}

export const useCampsiteNote = (variables: QueryVariables) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_CAMPSITE_NOTE, {variables});

export const useAddCampsiteNote = () => {
  const [addCampsiteNote] = useMutation<CampsiteNoteSuccess, Variables>(ADD_CAMPSITE_NOTE);
  return addCampsiteNote;
};
export const useEditCampsiteNote = () => {
  const [editCampsiteNote] = useMutation<CampsiteNoteSuccess, Variables>(EDIT_CAMPSITE_NOTE);
  return editCampsiteNote;
};
