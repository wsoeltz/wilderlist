import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import { overlayPortalContainerId } from '../../Utils';
import LoadingSimple from './LoadingSimple';

const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: progress;
`;

const LoadingSuspense = () => createPortal((
  <Root>
    <LoadingSimple size={60} />
  </Root>
), document.querySelector(`#${overlayPortalContainerId}`) as Element);

export default LoadingSuspense;
