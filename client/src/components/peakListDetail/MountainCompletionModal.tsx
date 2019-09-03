import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonSecondary,
  InputBase,
} from '../../styling/styleUtils';
import { Mountain, User } from '../../types/graphQLTypes';
import { convertFieldsToDate } from '../../Utils';
import Modal from '../sharedComponents/Modal';

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

const ADD_MOUNTAIN_COMPLETION = gql`
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
}

const MountainCompletionModal = (props: Props) => {
  const { editMountainId, closeEditMountainModalModal, userId } = props;

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);
  const [completionDay, setCompletionDay] = useState<string>('');
  const [completionMonth, setCompletionMonth] = useState<string>('');
  const [completionYear, setCompletionYear] = useState<string>('');

  const validateAndAddMountainCompletion = (mountainId: Mountain['id']) => {
    const completedDate = convertFieldsToDate(completionDay, completionMonth, completionYear);
    if (completedDate.error !== undefined) {
      console.error(completedDate.error);
    } else {
      addMountainCompletion({ variables: {userId, mountainId, date: completedDate.date}});
      closeEditMountainModalModal();
    }
  };

  return (
    <Modal
      onClose={closeEditMountainModalModal}
      width={'300px'}
      height={'300px'}
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
      <ButtonSecondary onClick={closeEditMountainModalModal}>
        Cancel
      </ButtonSecondary>
      <ButtonPrimary onClick={() => validateAndAddMountainCompletion(editMountainId)}>
        Mark Complete
      </ButtonPrimary>
    </Modal>
  );
};

export default MountainCompletionModal;
