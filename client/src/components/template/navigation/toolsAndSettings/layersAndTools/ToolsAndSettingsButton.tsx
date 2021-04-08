import {
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useFluent from '../../../../../hooks/useFluent';
import {
  IconContainer,
  PanelConnection,
  TextContainer,
  ToggleButton,
} from '../Utils';

interface Props {
  onClick: () => void;
  open: boolean;
}

const ToolsAndSettingsButton = ({onClick, open}: Props) => {
  const getString = useFluent();

  const connection = open ? <PanelConnection /> : null;

  return (
    <ToggleButton onClick={onClick} $open={open}>
      <IconContainer>
        <FontAwesomeIcon icon={faWrench} />
      </IconContainer>
      <TextContainer
        dangerouslySetInnerHTML={{__html: getString('global-tools-and-settings')}}
      />
      {connection}
    </ToggleButton>
  );

};

export default ToolsAndSettingsButton;
