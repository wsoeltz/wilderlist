import React from 'react';
import {
  ButtonWarning,
  ButtonSecondary,
} from '../../styling/styleUtils';
import Modal from './Modal';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  text: string;
  confirmText: string;
  cancelText: string;
}

const AreYouSureModal = (props: Props) => {
  const { onConfirm, onCancel, title, text, confirmText, cancelText } = props;

  return (
    <Modal
      onClose={onCancel}
      width={'300px'}
      height={'auto'}
    >
      <h3>{title}</h3>
      <p>{text}</p>
      <ButtonWrapper>
        <CancelButton onClick={onCancel}>
          {cancelText}
        </CancelButton>
        <ButtonWarning onClick={onConfirm}>
          {confirmText}
        </ButtonWarning>
      </ButtonWrapper>
    </Modal>
  );
};

export default AreYouSureModal;
