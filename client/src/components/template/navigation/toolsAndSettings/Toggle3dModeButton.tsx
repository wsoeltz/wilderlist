import {
  faCube,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import {
  FloatingButton,
  IconContainer,
  TextContainer,
} from './Utils';

const CreateRouteButton = () => {
  const getString = useFluent();

  return (
    <FloatingButton>
      <IconContainer>
        <FontAwesomeIcon icon={faCube} />
      </IconContainer>
      <TextContainer
        dangerouslySetInnerHTML={{__html: getString('global-3d-mode-on')}}
      />
    </FloatingButton>
  );

};

export default CreateRouteButton;
