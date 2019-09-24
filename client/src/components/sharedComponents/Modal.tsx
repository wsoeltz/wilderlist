import React, {useEffect, useRef, useState} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
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
  padding: 1rem;
  border-radius: ${borderRadius}px;
  max-height: 90%;
  overflow: auto;
`;

interface Props {
  children: React.ReactNode;
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

  let modal: React.ReactElement<any> | null;
  if (isModalRendered === true && overlayPortalContainerNodeRef.current !== null) {
    modal = createPortal((
      <Root>
        <Overlay onClick={onClose} />
        <Container style={{ maxWidth: width, height }}>
          {children}
        </Container>
      </Root>
    ), overlayPortalContainerNodeRef.current);
  } else {
    modal = null;
  }

  return modal;
};

export default Modal;
