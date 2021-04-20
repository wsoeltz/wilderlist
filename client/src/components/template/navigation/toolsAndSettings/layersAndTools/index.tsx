import React, {useState} from 'react';
import styled, {keyframes} from 'styled-components/macro';
import useFluent from '../../../../../hooks/useFluent';
import {
  baseColor,
  lightBorderColor,
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {mobileSize} from '../../../../../Utils';
import {MapStyle} from '../../../globalMap/map';
import MapLayers from './MapLayers';
import MapLayersButton from './MapLayersButton';
import MapTools from './MapTools';
import ToolsAndSettingsButton from './ToolsAndSettingsButton';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5rem;

  @media (max-width: ${mobileSize}px) {
    display: contents;
  }
`;

const slideDown = keyframes`
  0%   {
    height: 0rem;
  }
  100% {
    height: 15rem;
  }
`;

const ContentContainer = styled.div`
  grid-column: 1 / -1;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  padding: 0.35rem 0 0;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  border-radius: 4px;
  position: relative;
  height: 0rem;
  overflow: auto;
  animation: ${slideDown} 0.2s ease-in-out forwards;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
    height: 9px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .3);
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, .1);
  }

  @media (max-width: ${mobileSize}px) {
    animation: none;
    height: 9.5rem;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(-100%);
    background-color: ${tertiaryColor};
    padding: 0.35rem 0.5rem;
    box-shadow: none;
    border-top: solid 1px ${lightBorderColor};
    width: 100%;
    display: flex;
  }

`;

const ClosePanelButton = styled.button`
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 1.5rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: ${baseColor};
  background-color: ${tertiaryColor};
  border-top: solid 1px ${lightBorderColor};

  @media (max-width: ${mobileSize}px) {
    top: 0;
    right: 0;
    width: auto;
    left: auto;
    margin-left: auto;
    font-size: 0;
    color: rgba(0, 0, 0, 0);
    border: none;

    &:after {
      content: '×';
      font-size: 1.15rem;
      color: ${baseColor};
    }
  }
`;

enum Mode {
  closed,
  layers,
  tools,
}

interface Props {
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
}

const LayersAndTools = ({mapStyle, setMapStyle}: Props) => {
  const [mode, setMode] = useState<Mode>(Mode.closed);
  const getString = useFluent();

  const toggleLayers = () => setMode(m => m === Mode.layers ? Mode.closed : Mode.layers);
  const toggleTools = () => setMode(m => m === Mode.tools ? Mode.closed : Mode.tools);
  const closePanel = () => setMode(Mode.closed);

  let content: React.ReactElement<any> | null;
  if (mode === Mode.layers) {
    content = (
      <ContentContainer>
        <MapLayers
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
        />
        <ClosePanelButton onClick={closePanel}>
          {getString('global-text-value-modal-close-panel')}
        </ClosePanelButton>
      </ContentContainer>
    );
  } else if (mode === Mode.tools) {
    content = (
      <ContentContainer>
        <MapTools/>
        <ClosePanelButton onClick={closePanel}>
          {getString('global-text-value-modal-close-panel')}
        </ClosePanelButton>
      </ContentContainer>
    );
  } else {
    content = null;
  }

  return (
    <Root>
      <MapLayersButton
        onClick={toggleLayers}
        open={mode === Mode.layers}
      />
      <ToolsAndSettingsButton
        onClick={toggleTools}
        open={mode === Mode.tools}
      />
      {content}
    </Root>
  );
};

export default LayersAndTools;
