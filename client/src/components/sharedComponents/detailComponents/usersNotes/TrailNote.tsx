import React from 'react';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {
  useAddTrailNote,
  useEditTrailNote,
  useTrailNote,
} from '../../../../queries/trails/trailNotes';
import { PlaceholderText } from '../../../../styling/styleUtils';
import UserNote, {PlaceholderTextarea} from '../../UserNote';

interface Props {
  id: string;
  name: string;
}

const TrailNote = ({id, name}: Props) => {
  const getString = useFluent();
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const {loading, error, data} = useTrailNote({
    userId,
    trailId: id,
  });

  const addTrailNote = useAddTrailNote();
  const editTrailNote = useEditTrailNote();

  const trailNote = data && data.user && data.user.trailNote ? data.user.trailNote : null;
  const defaultNoteText = trailNote && trailNote.text ? trailNote.text : '';
  const notesPlaceholderText = userId
    ? getString('user-notes-placeholder', {name})
    : getString('user-notes-placeholder-not-logged-in', {name});

  const saveNote = (text: string) => {
    if (userId) {
      if (trailNote === null) {
        addTrailNote({variables: {userId, trailId: id, text}});
      } else {
        editTrailNote({variables: {userId, trailId: id, text}});
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

export default TrailNote;
