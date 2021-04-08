import { gql, useMutation, useQuery } from '@apollo/client';
import {
  User,
} from '../../types/graphQLTypes';

const GET_MOUNTAIN_NOTE = gql`
  query getMountainNote($userId: ID, $mountainId: ID) {
    user(id: $userId) {
      id
      mountainNote(mountainId: $mountainId) {
        id
        text
      }
    }
  }
`;

interface QuerySuccessResponse {
  user: null | {
    id: User['name'];
    mountainNote: User['mountainNote'];
  };
}

interface QueryVariables {
  userId: string | null;
  mountainId: string | null;
}

const ADD_MOUNTAIN_NOTE = gql`
  mutation($userId: ID!, $mountainId: ID!, $text: String!) {
    user: addMountainNote(
      userId: $userId,
      mountainId: $mountainId,
      text: $text
    ) {
      id
      mountainNote(mountainId: $mountainId) {
        id
        text
      }
    }
  }
`;

const EDIT_MOUNTAIN_NOTE = gql`
  mutation($userId: ID!, $mountainId: ID!, $text: String!) {
    user: editMountainNote(
      userId: $userId,
      mountainId: $mountainId,
      text: $text
    ) {
      id
      mountainNote(mountainId: $mountainId) {
        id
        text
      }
    }
  }
`;

interface MountainNoteSuccess {
  user: {
    id: User['id'];
    mountainNote: User['mountainNote'];
  };
}

interface Variables {
  userId: string;
  mountainId: string;
  text: string;
}

export const useMountainNote = (variables: QueryVariables) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_MOUNTAIN_NOTE, {variables});

export const useAddMountainNote = () => {
  const [addMountainNote] = useMutation<MountainNoteSuccess, Variables>(ADD_MOUNTAIN_NOTE);
  return addMountainNote;
};
export const useEditMountainNote = () => {
  const [editMountainNote] = useMutation<MountainNoteSuccess, Variables>(EDIT_MOUNTAIN_NOTE);
  return editMountainNote;
};
