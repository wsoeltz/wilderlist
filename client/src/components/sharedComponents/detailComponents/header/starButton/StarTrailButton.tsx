import React, {useEffect, useState} from 'react';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import useFluent from '../../../../../hooks/useFluent';
import {useSavedTrails} from '../../../../../queries/trails/useSavedTrails';
import SignUpModal from '../../../SignUpModal';
import StarButton from '../../../StarButton';

interface Props {
  id: string;
  name: string;
  compact?: boolean;
}

const StarTrailButton = ({name, id, compact}: Props) => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const getString = useFluent();

  const {response: {loading, data}, saveTrailToUser, removeSavedTrailFromUser} = useSavedTrails();

  const [isActive, setIsActive] = useState<boolean>(
    data && data.user ? Boolean(data.user.savedTrails.find(n => n.id === id)) : false,
  );

  useEffect(() => {
    if (data && data.user) {
      setIsActive(Boolean(data.user.savedTrails.find(n => n.id === id)));
    }
  }, [data, id]);

  const [isSignUpModal, setIsSignUpModal] = useState<boolean>(false);

  const openSignUpModal = () => setIsSignUpModal(true);
  const closeSignUpModal = () => setIsSignUpModal(false);

  const toggleActive = async () => {
    if (userId && data) {
      if (isActive) {
        setIsActive(false);
        removeSavedTrailFromUser({variables: {userId,  trailId: id}});
      } else {
        setIsActive(true);
        saveTrailToUser({variables: {userId,  trailId: id}});
      }
    } else {
      openSignUpModal();
    }
  };

  const signUpModal = isSignUpModal === false ? null : (
    <SignUpModal
      text={getString('global-text-value-modal-sign-up-today-save', {
        'list-short-name': name ? name : 'this',
      })}
      onCancel={closeSignUpModal}
    />
  );

  return (
    <div style={loading ? {visibility: 'hidden'} : undefined}>
      <StarButton
        starred={Boolean(isActive)}
        toggleStarred={toggleActive}
        compact={compact}
      />
      {signUpModal}
    </div>
  );
};

export default StarTrailButton;
