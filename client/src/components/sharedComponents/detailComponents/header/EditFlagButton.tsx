import {
  faFlag,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useState} from 'react';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {editCampsiteLink, editMountainLink} from '../../../../routing/Utils';
import {
  BasicIconInTextCompact,
  LinkButtonCompact,
  SmallLink,
} from '../../../../styling/styleUtils';
import {PermissionTypes} from '../../../../types/graphQLTypes';
import {CoreItem} from '../../../../types/itemTypes';
import FlagModal from './flagModal';

interface Props {
  authorId: null | string;
  type: CoreItem;
  name: string;
  id: string;
}

const EditFlagButton = (props: Props) => {
  const {id, name, type, authorId} = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = useCallback(() => setModalOpen(true), [setModalOpen]);
  const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

  const user = useCurrentUser();
  const getString = useFluent();

  if (!user) {
    return null;
  } else {
    const flagModal = modalOpen ? (
      <FlagModal
        id={id}
        name={name}
        type={type}
        onClose={closeModal}
      />
    ) : null;
    let relevantPermission: number | null = null;
    let url: string = '#';
    if (type === CoreItem.mountain) {
      relevantPermission = user.mountainPermissions;
      url = editMountainLink(id);
    }
    if (type === CoreItem.campsite) {
      relevantPermission = user.campsitePermissions;
      url = editCampsiteLink(id);
    }
    return (user && authorId && user._id === authorId
          && relevantPermission !== -1)
      || (user && user.permissions === PermissionTypes.admin) ? (
      <SmallLink to={url}>
        <BasicIconInTextCompact icon={faPencilAlt} />
        {getString('global-text-value-edit')}
      </SmallLink>
    ) : (
      <>
        <LinkButtonCompact onClick={openModal}>
          <BasicIconInTextCompact icon={faFlag} />
          {getString('global-text-value-flag')}
        </LinkButtonCompact>
        {flagModal}
      </>
    );
  }
};

export default EditFlagButton;
