import { gql, useMutation } from '@apollo/client';
import {
  User,
} from '../../types/graphQLTypes';

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

export const useAddPeakListNote = () => {
  const [addPeakListNote] = useMutation<PeakListNoteSuccess, PeakListNoteVariables>(ADD_PEAKLIST_NOTE);
  return addPeakListNote;
};

export const useEditPeakListNote = () => {
  const [editPeakListNote] = useMutation<PeakListNoteSuccess, PeakListNoteVariables>(EDIT_PEAKLIST_NOTE);
  return editPeakListNote;
};
