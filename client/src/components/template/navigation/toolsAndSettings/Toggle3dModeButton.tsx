import {
  faCube,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import {
  primaryColor,
} from '../../../../styling/styleUtils';
import {
  FloatingButton,
  IconContainer,
  TextContainer,
} from './Utils';

const CreateRouteButton = () => {
  const getString = useFluent();
  const [is3dModeOn, setIs3dModeOn] = useState<boolean>(false);
  const mapContext = useMapContext();

  const toggle3dMode = () => {
    if (mapContext.intialized) {
      setIs3dModeOn(mapContext.toggle3dTerrain);
    }
  };

  const containerStyles: React.CSSProperties | undefined = is3dModeOn ? {
    backgroundColor: primaryColor,
    color: '#fff',
  } : undefined;

  const iconStyles: React.CSSProperties | undefined = is3dModeOn ? {
    color: '#fff',
  } : undefined;

  const text = is3dModeOn ? getString('global-3d-mode-off') : getString('global-3d-mode-on');

  return (
    <FloatingButton
      onClick={toggle3dMode}
      style={containerStyles}
    >
      <IconContainer style={iconStyles}>
        <FontAwesomeIcon icon={faCube} />
      </IconContainer>
      <TextContainer
        style={iconStyles}
        dangerouslySetInnerHTML={{__html: text}}
      />
    </FloatingButton>
  );

};

export default CreateRouteButton;
