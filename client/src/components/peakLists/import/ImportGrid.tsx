// import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  ButtonSecondary,
} from '../../../styling/styleUtils';
// import { convertFieldsToDate } from '../../../Utils';
import Modal from '../../sharedComponents/Modal';
// import {
//   ADD_MOUNTAIN_COMPLETION,
//   MountainCompletionSuccessResponse,
//   MountainCompletionVariables,
// } from '../detail/MountainCompletionModal';
import axios from 'axios';
import csv from 'csvtojson';

const ButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const SubmitButton = styled(ButtonPrimary)`
  margin-left: auto;
`;

interface Props {
  onCancel: () => void;
  userId: string;
}

const ImportAscentsModal = (props: Props) => {
  const { onCancel } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [gridData, setGridData] = useState<any[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  console.log(gridData)
  if (importError !== null) {
    console.error(importError)
  }

  // const [addMountainCompletion] =
  //   useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);

  // const validateAndAddMountainCompletion = (mountainId: Mountain['id'], day: string, month: string, year: string) => {
  //   const completedDate = convertFieldsToDate(day, month, year);
  //   if (completedDate.error !== undefined) {
  //     console.error(completedDate.error);
  //   } else {
  //     addMountainCompletion({ variables: {userId, mountainId, date: completedDate.date}});
  //   }
  // };

  const onGridCsvPaste = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fetchGridData = async () => {
      try {
        // const res = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRWqR2ZHnJQF9WPFdHbYoT1rnT6y1XAEj2xEOigNBucpH8VHT3ERwp5juGYHQr9L6_9G6kDaWcKPZ-c/pub?gid=593274570&single=true&output=csv');
        const res = await axios.get(e.target.value);
        const newGridData: any[] = [];
        await csv()
          .fromString(res.data)
          .subscribe((jsonObj)=>{
            newGridData.push(jsonObj);
          });
        setGridData([...newGridData]);
      } catch (error) {
        setImportError(error);
      }
    };
    fetchGridData();
  }



  const onConfirm = () => {
    onCancel();
  };

  return (
    <Modal
      onClose={onCancel}
      width={'80%'}
      height={'auto'}
    >
      <h2>{getFluentString('import-ascents-title')}</h2>
      <p>{getFluentString('import-ascents-para-1')}</p>
      <p>
        <em
          dangerouslySetInnerHTML={{__html: getFluentString('import-ascents-date-note')}}
        />
      </p>
      <input
        onChange={onGridCsvPaste}
      />
      <ButtonWrapper>
        <CancelButton onClick={onCancel}>
          {getFluentString('global-text-value-modal-cancel')}
        </CancelButton>
        <SubmitButton onClick={onConfirm}>
          {getFluentString('global-text-value-modal-confirm')}
        </SubmitButton>
      </ButtonWrapper>
    </Modal>
  );
};

export default ImportAscentsModal;
