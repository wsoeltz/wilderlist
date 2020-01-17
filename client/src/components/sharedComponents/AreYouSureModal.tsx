import React from 'react';
import styled from 'styled-components/macro';
import {
  ButtonSecondary,
  ButtonWarning,
} from '../../styling/styleUtils';
import Modal from './Modal';

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

export interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  text: string;
  confirmText: string;
  cancelText: string;
}

const AreYouSureModal = (props: Props) => {
  const { onConfirm, onCancel, title, text, confirmText, cancelText } = props;

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={onCancel}>
        {cancelText}
      </CancelButton>
      <ButtonWarning onClick={onConfirm}>
        {confirmText}
      </ButtonWarning>
    </ButtonWrapper>
  );

  return (
    <Modal
      onClose={onCancel}
      width={'300px'}
      height={'auto'}
      actions={actions}
    >
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{__html: text}} />
    </Modal>
  );
};

export default AreYouSureModal;
