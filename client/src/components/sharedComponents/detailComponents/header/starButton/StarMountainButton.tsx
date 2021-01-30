import React, {/*useEffect,*/ useState} from 'react';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import useFluent from '../../../../../hooks/useFluent';
// import {
//   useAddPeakListToUser,
//   useRemovePeakListFromUser,
// } from '../../../../../queries/lists/addRemovePeakListsToUser';
// import {useUsersPeakLists} from '../../../../../queries/lists/getUsersPeakLists';
import SignUpModal from '../../../SignUpModal';
import StarButton from '../../../StarButton';

interface Props {
  id: string;
  name: string;
}

const StarListButton = ({name}: Props) => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const getString = useFluent();
  // const {data} = useUsersPeakLists({userId});

  const [isActive, setIsActive] = useState<boolean>(false);

  // useEffect(() => {
  //   if (data && data.user) {
  //     setIsActive(Boolean(data.user.peakLists.find(n => n.id === id)));
  //   }
  // }, [data, id]);

  // const addPeakListToUser = useAddPeakListToUser();
  // const removePeakListFromUser = useRemovePeakListFromUser();

  const [isSignUpModal, setIsSignUpModal] = useState<boolean>(false);

  const openSignUpModal = () => setIsSignUpModal(true);
  const closeSignUpModal = () => setIsSignUpModal(false);

  const toggleActive = async () => {
    if (userId
      // && data
      ) {
      if (isActive) {
        setIsActive(false);
        // removePeakListFromUser({variables: {userId,  id}});
      } else {
        setIsActive(true);
        // addPeakListToUser({variables: {userId,  id}});
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
    <>
      <StarButton
        starred={Boolean(isActive)}
        toggleStarred={toggleActive}
      />
      {signUpModal}
    </>
  );
};

export default StarListButton;
