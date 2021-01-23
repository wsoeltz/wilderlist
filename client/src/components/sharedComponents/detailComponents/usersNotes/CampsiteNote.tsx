import React from 'react';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {
  useAddCampsiteNote,
  useCampsiteNote,
  useEditCampsiteNote,
} from '../../../../queries/campsites/campsiteNotes';
import { PlaceholderText } from '../../../../styling/styleUtils';
import UserNote, {PlaceholderTextarea} from '../../UserNote';

interface Props {
  id: string;
  name: string;
}

const CampsiteNote = ({id, name}: Props) => {
  const getString = useFluent();
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const {loading, error, data} = useCampsiteNote({
    userId,
    campsiteId: id,
  });

  const addCampsiteNote = useAddCampsiteNote();
  const editCampsiteNote = useEditCampsiteNote();

  const campsiteNote = data && data.user && data.user.campsiteNote ? data.user.campsiteNote : null;
  const defaultNoteText = campsiteNote && campsiteNote.text ? campsiteNote.text : '';
  const notesPlaceholderText = getString('user-notes-placeholder', {name});

  const saveNote = (text: string) => {
    if (userId) {
      if (campsiteNote === null) {
        addCampsiteNote({variables: {userId, campsiteId: id, text}});
      } else {
        editCampsiteNote({variables: {userId, campsiteId: id, text}});
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

export default CampsiteNote;
