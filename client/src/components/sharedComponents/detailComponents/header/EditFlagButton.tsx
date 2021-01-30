import {
  faFlag,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {
  BasicIconInTextCompact,
  LinkButtonCompact,
  SmallLink,
} from '../../../../styling/styleUtils';
import {PermissionTypes} from '../../../../types/graphQLTypes';
import {CoreItem} from '../../../../types/itemTypes';

interface Props {
  authorId: null | string;
  type: CoreItem;
}

const EditFlagButton = (props: Props) => {
  const {authorId} = props;

  const user = useCurrentUser();
  const getString = useFluent();

  if (!user) {
    return null;
  } else {
    return (user && authorId && user._id === authorId
          && user.peakListPermissions !== -1)
      || (user && user.permissions === PermissionTypes.admin) ? (
      <SmallLink to={'#'}>
        <BasicIconInTextCompact icon={faPencilAlt} />
        {getString('global-text-value-edit')}
      </SmallLink>
    ) : (
      <LinkButtonCompact>
        <BasicIconInTextCompact icon={faFlag} />
        {getString('global-text-value-flag')}
      </LinkButtonCompact>
    );
  }
};

export default EditFlagButton;
