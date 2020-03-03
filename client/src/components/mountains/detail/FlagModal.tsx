import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import React, { useContext, useState } from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [updateMountainFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_MOUNTAIN);

  const [flag, setFlag] = useState<MountainFlag | ''>('');
  const [flagSubmitted, setFlagSubmitted] = useState<boolean>(false);

  const onSubmit = () => {
    if (mountainId && flag) {
      updateMountainFlag({variables: {id: mountainId, flag}});
    }
    setFlagSubmitted(true);
  };

  const actions = flagSubmitted === false ? (
    <ButtonWrapper>
      <CancelButton onClick={onClose}>
        {getFluentString('global-text-value-modal-close')}
      </CancelButton>
      <ButtonPrimary onClick={onSubmit}>
        {getFluentString('global-text-value-submit')}
      </ButtonPrimary>
    </ButtonWrapper>
  ) : (
    <ButtonWrapper>
      <CancelButton onClick={onClose}>
        {getFluentString('global-text-value-modal-close')}
      </CancelButton>
    </ButtonWrapper>
  );

  const text = flagSubmitted === false
    ? getFluentString('flag-mountain-text') : getFluentString('flag-mountain-thanks');

  const flagOptions = flagSubmitted === false ? (
    <>
      <Label>{getFluentString('flag-mountain-select-issue')}</Label>
      <SelectBox
        value={flag}
        onChange={(e) => setFlag(e.target.value as MountainFlag | '')}
      >
        <option value={''} key='empty-option-to-select'></option>
        <option value={MountainFlag.location} key='location'>
          {getFluentString('flag-mountain-select-issue-description', {
            issue: MountainFlag.location,
          })}
        </option>
        <option value={MountainFlag.elevation} key='elevation'>
          {getFluentString('flag-mountain-select-issue-description', {
            issue: MountainFlag.elevation,
          })}
        </option>
        <option value={MountainFlag.state} key='state'>
          {getFluentString('flag-mountain-select-issue-description', {
            issue: MountainFlag.state,
          })}
        </option>
        <option value={MountainFlag.duplicate} key='duplicate'>
          {getFluentString('flag-mountain-select-issue-description', {
            issue: MountainFlag.duplicate,
          })}
        </option>
        <option value={MountainFlag.data} key='data'>
          {getFluentString('flag-mountain-select-issue-description', {
            issue: MountainFlag.data,
          })}
        </option>
        <option value={MountainFlag.abuse} key='abuse'>
          {getFluentString('flag-mountain-select-issue-description', {
            issue: MountainFlag.abuse,
          })}
        </option>
        <option value={MountainFlag.other} key='other'>
          {getFluentString('flag-mountain-select-issue-description', {
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
      <h3>{getFluentString('flag-mountain-title', {name: mountainName})}</h3>
      <p>{text}</p>
      {flagOptions}

    </Modal>
  );
};

export default FlagModal;
