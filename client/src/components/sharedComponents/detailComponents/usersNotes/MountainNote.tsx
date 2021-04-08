import React from 'react';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {
  useAddMountainNote,
  useEditMountainNote,
  useMountainNote,
} from '../../../../queries/mountains/mountainNotes';
import { PlaceholderText } from '../../../../styling/styleUtils';
import UserNote, {PlaceholderTextarea} from '../../UserNote';

interface Props {
  id: string;
  name: string;
}

const MountainNote = ({id, name}: Props) => {
  const getString = useFluent();
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const {loading, error, data} = useMountainNote({
    userId,
    mountainId: id,
  });

  const addMountainNote = useAddMountainNote();
  const editMountainNote = useEditMountainNote();

  const mountainNote = data && data.user && data.user.mountainNote ? data.user.mountainNote : null;
  const defaultNoteText = mountainNote && mountainNote.text ? mountainNote.text : '';
  const notesPlaceholderText = userId
    ? getString('user-notes-placeholder', {name})
    : getString('user-notes-placeholder-not-logged-in', {name});

  const saveNote = (text: string) => {
    if (userId) {
      if (mountainNote === null) {
        addMountainNote({variables: {userId, mountainId: id, text}});
      } else {
        editMountainNote({variables: {userId, mountainId: id, text}});
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
