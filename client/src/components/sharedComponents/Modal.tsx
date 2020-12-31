import React, {useEffect, useRef, useState} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import useWindowWidth from '../../hooks/useWindowWidth';
import { borderRadius, lightBorderColor } from '../../styling/styleUtils';
import { overlayPortalContainerId } from '../../Utils';
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
    padding-bottom: 15vh;
  }
`;

const Actions = styled.div`
  padding: 1rem;
  background-color: #f1f1f1;
  grid-row: 2;
  border-bottom-left-radius: ${borderRadius}px;
  border-bottom-right-radius: ${borderRadius}px;
  border-top: solid 1px ${lightBorderColor};

  @media(max-width: ${mobileWidth}px) {
    z-index: 100;
    padding: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
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
  contentStyles?: React.CSSProperties;
}

const Modal = (props: Props) => {
  const {
    children, onClose, width, height, contentStyles,
  } = props;
  const overlayPortalContainerNodeRef = useRef<HTMLElement | null>(null);
  const [isModalRendered, setIsModalRendered] = useState<boolean>(false);
  useEffect(() => {
    window.history.pushState('forward', '', '');
    const node = document.querySelector<HTMLElement>(`#${overlayPortalContainerId}`);
    if (node !== null) {
      overlayPortalContainerNodeRef.current = node;
      setIsModalRendered(true);
    }
  }, []);

  useEffect(() => {
    let closedWithBackButton = false;
    const closeModalOnBackClick = (e: Event) => {
      closedWithBackButton = true;
      e.preventDefault();
      onClose();
    };
    window.addEventListener('popstate', closeModalOnBackClick);
    return () => {
      window.removeEventListener('popstate', closeModalOnBackClick);
      if (!closedWithBackButton) {
        window.history.back();
      }
    };
  }, [onClose]);

  const windowWidth = useWindowWidth();

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
        <Container dimensions={{width, height}}>
          {mobileBackButton}
          <Content style={contentStyles}>
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
