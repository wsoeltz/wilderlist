import { gql, useMutation, useQuery } from '@apollo/client';
import {
  User,
} from '../../types/graphQLTypes';

const GET_PEAK_LIST_NOTE = gql`
  query getPeakListNote($userId: ID, $peakListId: ID!) {
    user(id: $userId) {
      id
      peakListNote(peakListId: $peakListId) {
        id
        text
      }
    }
  }
`;

interface QuerySuccessResponse {
  user: null | {
    id: User['name'];
    peakListNote: User['peakListNote'];
  };
}

interface QueryVariables {
  userId: string | null;
  peakListId: string | null;
}

const ADD_PEAKLIST_NOTE = gql`
  mutation($userId: ID!, $peakListId: ID!, $text: String!) {
    user: addPeakListNote(
      userId: $userId,
      peakListId: $peakListId,
      text: $text
    ) {
      id
      peakListNote(peakListId: $peakListId) {
        id
        text
      }
    }
  }
`;

const EDIT_PEAKLIST_NOTE = gql`
  mutation($userId: ID!, $peakListId: ID!, $text: String!) {
    user: editPeakListNote(
      userId: $userId,
      peakListId: $peakListId,
      text: $text
    ) {
      id
      peakListNote(peakListId: $peakListId) {
        id
        text
      }
    }
  }
`;

interface PeakListNoteSuccess {
  user: {
    id: User['id'];
    peakListNote: User['peakListNote'];
  };
}

interface PeakListNoteVariables {
  userId: string;
  peakListId: string;
  text: string;
}

export const usePeakListNote = (variables: QueryVariables) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_PEAK_LIST_NOTE, {variables});

export const useAddPeakListNote = () => {
  const [addPeakListNote] = useMutation<PeakListNoteSuccess, PeakListNoteVariables>(ADD_PEAKLIST_NOTE);
  return addPeakListNote;
};

export const useEditPeakListNote = () => {
  const [editPeakListNote] = useMutation<PeakListNoteSuccess, PeakListNoteVariables>(EDIT_PEAKLIST_NOTE);
  return editPeakListNote;
};
