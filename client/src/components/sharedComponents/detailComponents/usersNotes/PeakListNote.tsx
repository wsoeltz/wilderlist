import React from 'react';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {
  useAddPeakListNote,
  useEditPeakListNote,
  usePeakListNote,
} from '../../../../queries/lists/peakListNotes';
import { PlaceholderText } from '../../../../styling/styleUtils';
import UserNote, {PlaceholderTextarea} from '../../UserNote';

interface Props {
  id: string;
  name: string;
}

const PeakListNote = ({id, name}: Props) => {
  const getString = useFluent();
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const {loading, error, data} = usePeakListNote({
    userId,
    peakListId: id,
  });

  const addPeakListNote = useAddPeakListNote();
  const editPeakListNote = useEditPeakListNote();

  const peakListNote = data && data.user && data.user.peakListNote ? data.user.peakListNote : null;
  const defaultNoteText = peakListNote && peakListNote.text ? peakListNote.text : '';
  const notesPlaceholderText = userId
    ? getString('user-notes-placeholder', {name})
    : getString('user-notes-placeholder-not-logged-in', {name});

  const saveNote = (text: string) => {
    if (userId) {
      if (peakListNote === null) {
        addPeakListNote({variables: {userId, peakListId: id, text}});
      } else {
        editPeakListNote({variables: {userId, peakListId: id, text}});
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

export default PeakListNote;
