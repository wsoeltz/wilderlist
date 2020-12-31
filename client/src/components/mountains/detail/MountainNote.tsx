import React from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  useAddMountainNote,
  useEditMountainNote,
  useMountainNote,
} from '../../../queries/mountains/mountainNotes';
import { PlaceholderText } from '../../../styling/styleUtils';
import UserNote, {PlaceholderTextarea} from '../../sharedComponents/UserNote';

interface Props {
  mountainId: string;
}

const MountainNote = ({mountainId}: Props) => {
  const getString = useFluent();
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const {loading, error, data} = useMountainNote({
    userId,
    mountainId,
  });

  const addMountainNote = useAddMountainNote();
  const editMountainNote = useEditMountainNote();

  const mountainNote = data && data.user && data.user.mountainNote ? data.user.mountainNote : null;
  const defaultNoteText = mountainNote && mountainNote.text ? mountainNote.text : '';
  const notesPlaceholderText = getString('user-notes-placeholder', {name});

  const saveNote = (text: string) => {
    if (userId) {
      if (mountainNote === null) {
        addMountainNote({variables: {userId, mountainId, text}});
      } else {
        editMountainNote({variables: {userId, mountainId, text}});
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
