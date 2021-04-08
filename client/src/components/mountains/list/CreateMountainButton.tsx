import {
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import { Routes } from '../../../routing/routes';
import {
  BasicIconInText,
  FloatingButton,
  FloatingButtonContainer,
} from '../../../styling/styleUtils';

const CreateMountainButton = () => {
  const user = useCurrentUser();
  const getString = useFluent();
  if (user && user.mountainPermissions !== -1) {
    return (
      <FloatingButtonContainer>
        <FloatingButton to={Routes.CreateMountain}>
          <BasicIconInText icon={faPlusCircle} />
          {getString('create-mountain-title-create')}
        </FloatingButton>
      </FloatingButtonContainer>
    );
  } else {
    return null;
  }
};

export default CreateMountainButton;
