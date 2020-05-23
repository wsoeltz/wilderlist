import React, {useContext, useEffect, useRef, useState} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import { borderRadius } from '../../styling/styleUtils';
import { overlayPortalContainerId } from '../../Utils';
import {AppContext} from '../App';
import BackButton from './BackButton';

export const mobileWidth = 600; // in px

const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

interface Dimensions {
  width: string;
  height: string;
}

const Container = styled.div<{dimensions: Dimensions}>`
  background-color: #fff;
  position: relative;
  border-radius: ${borderRadius}px;
  display: grid;
  grid-template-rows: 1fr auto;
  max-height: 90%;
  max-width: ${({dimensions: {width}}) => width};
  height: ${({dimensions: {height}}) => height};

  @media(max-width: ${mobileWidth}px) {
    max-height: 100%;
    height: 100%;
    width: 100%;
    max-width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const Content = styled.div`
  grid-row: 1;
  padding: 1rem;
  overflow: auto;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .3);
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, .1);
  }

  @media(max-width: ${mobileWidth}px) {
    overflow: visible;
    flex-grow: 1;
  }
`;

const Actions = styled.div`
  padding: 1rem;
  background-color: #f1f1f1;
  grid-row: 2;
  border-bottom-left-radius: ${borderRadius}px;
  border-bottom-right-radius: ${borderRadius}px;

  @media(max-width: ${mobileWidth}px) {
    padding: 0;
  }
`;

const BackButtonContainer = styled.div`
  width: 100%;
`;

interface Props {
  children: React.ReactNode;
  actions: React.ReactNode;
  onClose: () => void;
  width: string;
  height: string;
}

const Modal = (props: Props) => {
  const {
    children, onClose, width, height,
  } = props;
  const overlayPortalContainerNodeRef = useRef<HTMLElement | null>(null);
  const [isModalRendered, setIsModalRendered] = useState<boolean>(false);
  useEffect(() => {
    const node = document.querySelector<HTMLElement>(`#${overlayPortalContainerId}`);
    if (node !== null) {
      overlayPortalContainerNodeRef.current = node;
      setIsModalRendered(true);
    }
  }, []);

  const { windowWidth } = useContext(AppContext);

  const actions = props.actions === null ? null : (
    <Actions>
      {props.actions}
    </Actions>
  );

  const mobileBackButton = windowWidth <= mobileWidth ? (
    <BackButtonContainer>
      <BackButton onClick={onClose}/>
    </BackButtonContainer>
  ) : null;

  let modal: React.ReactElement<any> | null;
  if (isModalRendered === true && overlayPortalContainerNodeRef.current !== null) {
    modal = createPortal((
      <Root>
        <Overlay onClick={onClose} />
        <Container dimensions={{ width, height }}>
          {mobileBackButton}
          <Content>
            {children}
          </Content>
          {actions}
        </Container>
      </Root>
    ), overlayPortalContainerNodeRef.current);
  } else {
    modal = null;
  }

  return modal;
};

export default Modal;
