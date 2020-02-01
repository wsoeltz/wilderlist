import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import React, { useContext, useState } from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [updatePeakListFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_PEAK_LIST);

  const [flag, setFlag] = useState<PeakListFlag | ''>('');
  const [flagSubmitted, setFlagSubmitted] = useState<boolean>(false);

  const onSubmit = () => {
    if (peakListId && flag) {
      updatePeakListFlag({variables: {id: peakListId, flag}});
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
    ? getFluentString('flag-peak-list-text') : getFluentString('flag-mountain-thanks');

  const flagOptions = flagSubmitted === false ? (
    <>
      <Label>{getFluentString('flag-mountain-select-issue')}</Label>
      <SelectBox
        value={flag}
        onChange={(e) => setFlag(e.target.value as PeakListFlag | '')}
      >
        <option value={''} key='empty-option-to-select'></option>
        <option value={PeakListFlag.duplicate} key='duplicate'>
          {getFluentString('flag-peak-list-select-issue-description', {
            issue: PeakListFlag.duplicate,
          })}
        </option>
        <option value={PeakListFlag.data} key='data'>
          {getFluentString('flag-peak-list-select-issue-description', {
            issue: PeakListFlag.data,
          })}
        </option>
        <option value={PeakListFlag.abuse} key='abuse'>
          {getFluentString('flag-peak-list-select-issue-description', {
            issue: PeakListFlag.abuse,
          })}
        </option>
        <option value={PeakListFlag.other} key='other'>
          {getFluentString('flag-peak-list-select-issue-description', {
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
      <h3>{getFluentString('flag-mountain-title', {name: peakListName})}</h3>
      <p>{text}</p>
      {flagOptions}

    </Modal>
  );
};

export default FlagModal;
