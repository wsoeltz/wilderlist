import { useMutation } from '@apollo/client';
import React, { useCallback, useState } from 'react';
import useFluent from '../../../hooks/useFluent';
import { ButtonPrimary, Label, SelectBox } from '../../../styling/styleUtils';
import { PeakListFlag } from '../../../types/graphQLTypes';
import {
  ButtonWrapper,
  CancelButton,
} from '../../sharedComponents/AreYouSureModal';
import Modal from '../../sharedComponents/Modal';
import {
  FLAG_PEAK_LIST,
  FlagSuccessResponse,
  FlagVariables,
} from '../create/PeakListForm';

interface Props {
  onClose: () => void;
  peakListName: string;
  peakListId: string;
}

const FlagModal = (props: Props) => {
  const { onClose, peakListId, peakListName } = props;

  const getString = useFluent();

  const [updatePeakListFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_PEAK_LIST);

  const [flag, setFlag] = useState<PeakListFlag | ''>('');
  const updateFlagValue = useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
    setFlag(e.target.value as PeakListFlag | ''), []);
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
    ? getString('flag-peak-list-text') : getString('flag-mountain-thanks');

  const flagOptions = flagSubmitted === false ? (
    <>
      <Label>{getString('flag-mountain-select-issue')}</Label>
      <SelectBox
        value={flag}
        onChange={updateFlagValue}
      >
        <option value={''} key='empty-option-to-select'></option>
        <option value={PeakListFlag.duplicate} key='duplicate'>
          {getString('flag-peak-list-select-issue-description', {
            issue: PeakListFlag.duplicate,
          })}
        </option>
        <option value={PeakListFlag.data} key='data'>
          {getString('flag-peak-list-select-issue-description', {
            issue: PeakListFlag.data,
          })}
        </option>
        <option value={PeakListFlag.abuse} key='abuse'>
          {getString('flag-peak-list-select-issue-description', {
            issue: PeakListFlag.abuse,
          })}
        </option>
        <option value={PeakListFlag.other} key='other'>
          {getString('flag-peak-list-select-issue-description', {
            issue: PeakListFlag.other,
          })}
        </option>
      </SelectBox>
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
