import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import { PlaceholderText } from '../../../styling/styleUtils';
import {
  User,
} from '../../../types/graphQLTypes';
import UserNote, {PlaceholderTextarea} from '../../sharedComponents/UserNote';

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

interface MountainNoteVariables {
  userId: string;
  mountainId: string;
  text: string;
}

interface Props {
  mountainId: string;
}

const MountainNote = ({mountainId}: Props) => {
  const getString = useFluent();
  const currentUser = useCurrentUser();

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAIN_NOTE, {
    variables: {
      userId: currentUser ? currentUser._id : null,
      mountainId,
    },
  });

  const [addMountainNote] = useMutation<MountainNoteSuccess, MountainNoteVariables>(ADD_MOUNTAIN_NOTE);
  const [editMountainNote] = useMutation<MountainNoteSuccess, MountainNoteVariables>(EDIT_MOUNTAIN_NOTE);

  const mountainNote = currentUser && currentUser.mountainNote ? currentUser.mountainNote : null;
  const defaultNoteText = mountainNote && mountainNote.text ? mountainNote.text : '';
  const notesPlaceholderText = getString('user-notes-placeholder', {name});

  const saveNote = (text: string) => {
    if (currentUser) {
      if (mountainNote === null) {
        addMountainNote({variables: {userId: currentUser.id, mountainId, text}});
      } else {
        editMountainNote({variables: {userId: currentUser.id, mountainId, text}});
      }
    }
  };

  if (loading === true) {
    return <PlaceholderTextarea />;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    return (
      <UserNote
        placeholder={notesPlaceholderText}
        defaultValue={defaultNoteText}
        onSave={saveNote}
        key={defaultNoteText}
      />
    );
  } else {
    return null;
  }
};

export default MountainNote;
