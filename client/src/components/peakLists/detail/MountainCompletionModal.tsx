import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  ButtonSecondary,
  InputBase,
  warningColor,
} from '../../../styling/styleUtils';
import { Mountain, User } from '../../../types/graphQLTypes';
import { convertFieldsToDate } from '../../../Utils';
import Modal from '../../sharedComponents/Modal';

const DateInputContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 5fr 7fr;
  grid-column-gap: 1rem;
`;

const DayInput = styled(InputBase)`
  grid-column: 2;
  text-align: center;
`;
const MonthInput = styled(InputBase)`
  grid-column: 1;
  text-align: center;
`;
const YearInput = styled(InputBase)`
  grid-column: 3;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const Error = styled.p`
  color: ${warningColor};
  text-align: center;
`;

export const ADD_MOUNTAIN_COMPLETION = gql`
  mutation addMountainCompletion(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    addMountainCompletion(
      userId: $userId,
      mountainId: $mountainId,
      date: $date
    ) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

export interface MountainCompletionSuccessResponse {
  id: User['id'];
  mountains: User['mountains'];
}

export interface MountainCompletionVariables {
  userId: string;
  mountainId: string;
  date: string;
}

interface Props {
  editMountainId: string;
  closeEditMountainModalModal: () => void;
  userId: string;
  textNote?: React.ReactElement<any> | null;
}

const MountainCompletionModal = (props: Props) => {
  const { editMountainId, closeEditMountainModalModal, userId, textNote } = props;

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);
  const [completionDay, setCompletionDay] = useState<string>('');
  const [completionMonth, setCompletionMonth] = useState<string>('');
  const [completionYear, setCompletionYear] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const validateAndAddMountainCompletion = (mountainId: Mountain['id']) => {
    const completedDate = convertFieldsToDate(completionDay, completionMonth, completionYear);
    if (completedDate.error !== undefined) {
      setErrorMessage(completedDate.error);
    } else {
      setErrorMessage(undefined);
      addMountainCompletion({ variables: {userId, mountainId, date: completedDate.date}});
      closeEditMountainModalModal();
    }
  };

  const error = errorMessage === undefined ? null : <Error>{errorMessage}</Error>;

  return (
    <Modal
      onClose={closeEditMountainModalModal}
      width={'240px'}
      height={'auto'}
    >
      <DateInputContainer>
        <MonthInput
          placeholder='MM'
          value={completionMonth}
          onChange={e => setCompletionMonth(e.target.value)}
          type='number'
        />
        <DayInput
          placeholder='DD'
          value={completionDay}
          onChange={e => setCompletionDay(e.target.value)}
          type='number'
        />
        <YearInput
          placeholder='YYYY'
          value={completionYear}
          onChange={e => setCompletionYear(e.target.value)}
          type='number'
        />
      </DateInputContainer>
      {error}
      {textNote}
      <ButtonWrapper>
        <CancelButton onClick={closeEditMountainModalModal}>
          {getFluentString('global-text-value-modal-cancel')}
        </CancelButton>
        <ButtonPrimary onClick={() => validateAndAddMountainCompletion(editMountainId)}>
          {getFluentString('global-text-value-modal-mark-complete')}
        </ButtonPrimary>
      </ButtonWrapper>
    </Modal>
  );
};

export default MountainCompletionModal;
