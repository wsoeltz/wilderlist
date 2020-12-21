import { useMutation } from '@apollo/client';
import React, {useCallback, useState} from 'react';
import useFluent from '../../../hooks/useFluent';
import { ButtonPrimary, Label, SelectBox } from '../../../styling/styleUtils';
import { MountainFlag } from '../../../types/graphQLTypes';
import {
  ButtonWrapper,
  CancelButton,
} from '../../sharedComponents/AreYouSureModal';
import Modal from '../../sharedComponents/Modal';
import {
  FLAG_MOUNTAIN,
  FlagSuccessResponse,
  FlagVariables,
} from '../create/MountainForm';

interface Props {
  onClose: () => void;
  mountainName: string;
  mountainId: string;
}

const FlagModal = (props: Props) => {
  const { onClose, mountainId, mountainName } = props;

  const getString = useFluent();

  const [updateMountainFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_MOUNTAIN);

  const [flag, setFlag] = useState<MountainFlag | ''>('');
  const updateFlagValue = useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
    setFlag(e.target.value as MountainFlag | ''), []);
  const [flagSubmitted, setFlagSubmitted] = useState<boolean>(false);

  const onSubmit = () => {
    if (mountainId && flag) {
      updateMountainFlag({variables: {id: mountainId, flag}});
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
    ? getString('flag-mountain-text') : getString('flag-mountain-thanks');

  const flagOptions = flagSubmitted === false ? (
    <>
      <Label>{getString('flag-mountain-select-issue')}</Label>
      <SelectBox
        value={flag}
        onChange={updateFlagValue}
      >
        <option value={''} key='empty-option-to-select'></option>
        <option value={MountainFlag.location} key='location'>
          {getString('flag-mountain-select-issue-description', {
            issue: MountainFlag.location,
          })}
        </option>
        <option value={MountainFlag.elevation} key='elevation'>
          {getString('flag-mountain-select-issue-description', {
            issue: MountainFlag.elevation,
          })}
        </option>
        <option value={MountainFlag.state} key='state'>
          {getString('flag-mountain-select-issue-description', {
            issue: MountainFlag.state,
          })}
        </option>
        <option value={MountainFlag.duplicate} key='duplicate'>
          {getString('flag-mountain-select-issue-description', {
            issue: MountainFlag.duplicate,
          })}
        </option>
        <option value={MountainFlag.data} key='data'>
          {getString('flag-mountain-select-issue-description', {
            issue: MountainFlag.data,
          })}
        </option>
        <option value={MountainFlag.abuse} key='abuse'>
          {getString('flag-mountain-select-issue-description', {
            issue: MountainFlag.abuse,
          })}
        </option>
        <option value={MountainFlag.other} key='other'>
          {getString('flag-mountain-select-issue-description', {
            issue: MountainFlag.other,
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
      <h3>{getString('flag-mountain-title', {name: mountainName})}</h3>
      <p>{text}</p>
      {flagOptions}

    </Modal>
  );
};

export default FlagModal;
