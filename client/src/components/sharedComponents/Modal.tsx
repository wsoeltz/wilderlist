import React, {useEffect, useRef, useState} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import { borderRadius } from '../../styling/styleUtils';
import { overlayPortalContainerId } from '../../Utils';

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

const Container = styled.div`
  background-color: #fff;
  position: relative;
  border-radius: ${borderRadius}px;
  display: grid;
  grid-template-rows: 1fr auto;
  max-height: 90%;

  @media(max-width: 600px) {
    max-height: 100%;
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
`;

const Actions = styled.div`
  padding: 1rem;
  background-color: #f1f1f1;
  grid-row: 2;
  border-bottom-left-radius: ${borderRadius}px;
  border-bottom-right-radius: ${borderRadius}px;

  @media(max-width: 600px) {
    padding-bottom: 6vh;
    position: sticky;
    bottom: 0;
  }
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
    children, onClose, width, height, actions,
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

  let modal: React.ReactElement<any> | null;
  if (isModalRendered === true && overlayPortalContainerNodeRef.current !== null) {
    modal = createPortal((
      <Root>
        <Overlay onClick={onClose} />
        <Container style={{ maxWidth: width, height }}>
          <Content>
            {children}
          </Content>
          <Actions>
            {actions}
          </Actions>
        </Container>
      </Root>
    ), overlayPortalContainerNodeRef.current);
  } else {
    modal = null;
  }

  return modal;
};

export default Modal;
