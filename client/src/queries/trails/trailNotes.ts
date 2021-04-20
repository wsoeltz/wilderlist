import { gql, useMutation, useQuery } from '@apollo/client';
import {
  User,
} from '../../types/graphQLTypes';

const GET_TRAIL_NOTE = gql`
  query getTrailNote($userId: ID, $trailId: ID) {
    user(id: $userId) {
      id
      trailNote(trailId: $trailId) {
        id
        text
      }
    }
  }
`;

interface QuerySuccessResponse {
  user: null | {
    id: User['name'];
    trailNote: User['trailNote'];
  };
}

interface QueryVariables {
  userId: string | null;
  trailId: string | null;
}

const ADD_TRAIL_NOTE = gql`
  mutation($userId: ID!, $trailId: ID!, $text: String!) {
    user: addTrailNote(
      userId: $userId,
      trailId: $trailId,
      text: $text
    ) {
      id
      trailNote(trailId: $trailId) {
        id
        text
      }
    }
  }
`;

const EDIT_TRAIL_NOTE = gql`
  mutation($userId: ID!, $trailId: ID!, $text: String!) {
    user: editTrailNote(
      userId: $userId,
      trailId: $trailId,
      text: $text
    ) {
      id
      trailNote(trailId: $trailId) {
        id
        text
      }
    }
  }
`;

interface TrailNoteSuccess {
  user: {
    id: User['id'];
    trailNote: User['trailNote'];
  };
}

interface Variables {
  userId: string;
  trailId: string;
  text: string;
}

export const useTrailNote = (variables: QueryVariables) => useQuery<QuerySuccessResponse, QueryVariables>(
  GET_TRAIL_NOTE, {variables});

export const useAddTrailNote = () => {
  const [addTrailNote] = useMutation<TrailNoteSuccess, Variables>(ADD_TRAIL_NOTE);
  return addTrailNote;
};
export const useEditTrailNote = () => {
  const [editTrailNote] = useMutation<TrailNoteSuccess, Variables>(EDIT_TRAIL_NOTE);
  return editTrailNote;
};
