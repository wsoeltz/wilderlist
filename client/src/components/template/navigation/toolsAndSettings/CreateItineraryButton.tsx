import {
  faRoad,
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
        <FontAwesomeIcon icon={faRoad} />
      </IconContainer>
      <TextContainer
        dangerouslySetInnerHTML={{__html: getString('global-create-itinerary')}}
      />
    </FloatingButton>
  );

};

export default CreateRouteButton;
