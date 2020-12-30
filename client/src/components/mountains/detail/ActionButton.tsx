import { faFlag } from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useState} from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import { editMountainLink } from '../../../routing/Utils';
import {
  BasicIconInText,
  CompactGhostButton,
  CompactGhostButtonLink,
} from '../../../styling/styleUtils';
import {
  PermissionTypes,
} from '../../../types/graphQLTypes';
import FlagModal from './FlagModal';

interface Props {
  id: string;
  authorId: string | null;
}

const ActionButton = ({id, authorId}: Props) => {
  const getString = useFluent();
  const currentUser = useCurrentUser();

  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
  const openFlagModal = useCallback(() => setIsFlagModalOpen(true), []);
  const closeFlagModal = useCallback(() => setIsFlagModalOpen(false), []);

  if (!currentUser) {
    return null;
  } else if ((authorId === currentUser._id
              && currentUser.mountainPermissions !== -1) || currentUser.permissions === PermissionTypes.admin) {
    return(
      <CompactGhostButtonLink to={editMountainLink(id)}>
        {getString('global-text-value-edit')}
      </CompactGhostButtonLink>
    );
  } else {
    const flagModal = isFlagModalOpen === false ? null : (
      <FlagModal
        onClose={closeFlagModal}
        mountainId={id}
        mountainName={name}
      />
    );
    return (
      <>
        <CompactGhostButton onClick={openFlagModal}>
          <BasicIconInText icon={faFlag} />
          {getString('global-text-value-flag')}
        </CompactGhostButton>
        {flagModal}
      </>
    );
  }
};

export default ActionButton;
