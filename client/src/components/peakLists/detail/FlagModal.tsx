import React, { useCallback, useState } from 'react';
import useFluent from '../../../hooks/useFluent';
import {useUpdatePeakListFlag} from '../../../queries/lists/flagPeakList';
import { ButtonPrimary, InputBase, Label } from '../../../styling/styleUtils';
import {AggregateItem} from '../../../types/itemTypes';
import {
  ButtonWrapper,
  CancelButton,
} from '../../sharedComponents/AreYouSureModal';
import Modal from '../../sharedComponents/Modal';

interface Props {
  onClose: () => void;
  peakListName: string;
  peakListId: string;
}

const FlagModal = (props: Props) => {
  const { onClose, peakListId, peakListName } = props;

  const getString = useFluent();

  const updatePeakListFlag = useUpdatePeakListFlag();

  const [flag, setFlag] = useState<string>('');
  const updateFlagValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
    setFlag(e.target.value), []);
  const [flagSubmitted, setFlagSubmitted] = useState<boolean>(false);

  const onSubmit = () => {
    if (peakListId && flag) {
      updatePeakListFlag({variables: {id: peakListId, flag}});
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
    ? getString('flag-item-text', {type: AggregateItem.list}) : getString('flag-mountain-thanks');

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
      <h3>{getString('flag-mountain-title', {name: peakListName})}</h3>
      <p>{text}</p>
      {flagOptions}

    </Modal>
  );
};

export default FlagModal;
