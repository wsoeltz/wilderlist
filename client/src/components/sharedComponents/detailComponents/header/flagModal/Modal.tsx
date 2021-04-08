import React, {useCallback, useState} from 'react';
import useFluent from '../../../../../hooks/useFluent';
import { ButtonPrimary, InputBase, Label } from '../../../../../styling/styleUtils';
import {AggregateItem, CoreItem} from '../../../../../types/itemTypes';
import {
  ButtonWrapper,
  CancelButton,
} from '../../../AreYouSureModal';
import Modal from '../../../Modal';

interface Props {
  onClose: () => void;
  name: string;
  id: string;
  onSave: (flag: string) => void;
  type: CoreItem | AggregateItem;
}

const FlagModal = (props: Props) => {
  const { onClose, id, name, onSave, type } = props;

  const getString = useFluent();

  const [flag, setFlag] = useState<string>('');
  const updateFlagValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
    setFlag(e.target.value), []);
  const [flagSubmitted, setFlagSubmitted] = useState<boolean>(false);

  const onSubmit = () => {
    if (id && flag) {
      onSave(flag);
    }
    setFlagSubmitted(true);
  };

  const actions = flagSubmitted === false ? (
    <ButtonWrapper>
      <CancelButton onClick={onClose} mobileExtend={true}>
        {getString('global-text-value-modal-close')}
      </CancelButton>
      <ButtonPrimary onClick={onSubmit} mobileExtend={true}>
        {getString('global-text-value-submit')}
      </ButtonPrimary>
    </ButtonWrapper>
  ) : (
    <ButtonWrapper>
      <CancelButton onClick={onClose} mobileExtend={true} style={{gridColumn: '1 / -1'}}>
        {getString('global-text-value-modal-close')}
      </CancelButton>
    </ButtonWrapper>
  );

  const text = flagSubmitted === false
    ? getString('flag-item-text', {type}) : getString('flag-mountain-thanks');

  const flagOptions = flagSubmitted === false ? (
    <>
      <Label>{getString('flag-mountain-select-issue')}</Label>
      <InputBase
        value={flag}
        onChange={updateFlagValue}
      />
    </>
  ) : null;

  return (
    <Modal
      actions={actions}
      onClose={onClose}
      width={'600px'}
      height={'auto'}
    >
      <h3>{getString('flag-mountain-title', {name})}</h3>
      <p>{text}</p>
      {flagOptions}

    </Modal>
  );
};

export default FlagModal;
