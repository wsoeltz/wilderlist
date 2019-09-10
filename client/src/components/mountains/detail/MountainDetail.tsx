import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import {
  ButtonPrimary,
  ButtonSecondary,
} from '../../../styling/styleUtils';
import { Mountain, User } from '../../../types/graphQLTypes';
import { convertFieldsToDate } from '../../../Utils';
import MountainCompletionModal, {
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
} from '../../peakLists/detail/MountainCompletionModal';
import {
  DateObject,
  formatDate,
  getDates,
} from '../../peakLists/Utils';

const GET_MOUNTAIN_LIST = gql`
  query getMountain($id: ID!, $userId: ID!) {
    mountain(id: $id) {
      id
      name
    }
    user(id: $userId) {
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

interface QuerySuccessResponse {
  mountain: {
    id: Mountain['name'];
    name: Mountain['name'];
  };
  user: {
    id: User['name'];
    mountains: User['mountains'];
  };
}

interface QueryVariables {
  id: string;
  userId: string;
}

const REMOVE_MOUNTAIN_COMPLETION = gql`
  mutation removeMountainCompletion(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    removeMountainCompletion(
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

interface Props {
  userId: string;
  id: string;
}

const getDateAsString = (date: DateObject) => {
  const day = isNaN(date.day) ? '' : date.day;
  const month = isNaN(date.month) ? '' : date.month;
  const year = isNaN(date.year) ? '' : date.year;
  const result = convertFieldsToDate(day.toString(), month.toString(), year.toString());
  if (result.error || result.date === undefined) {
    return '';
  }
  return result.date;
};

const MountainDetail = (props: Props) => {
  const { userId, id } = props;

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAIN_LIST, {
    variables: { id, userId },
  });

  const [removeMountainCompletion] =
  useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(REMOVE_MOUNTAIN_COMPLETION);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  const editMountainModal = editMountainId === null ? null : (
    <MountainCompletionModal
      editMountainId={editMountainId}
      closeEditMountainModalModal={closeEditMountainModalModal}
      userId={userId}
    />
  );

  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const { mountain: { name }, user } = data;
    const userMountains = (user && user.mountains) ? user.mountains : [];
    const completedDates = userMountains.find(
      (completedMountain) => completedMountain.mountain.id === id);
    let completionContent: React.ReactElement<any> | null;
    if (completedDates && completedDates.dates.length) {
      const dates = getDates(completedDates.dates);
      const completionListItems = dates.map(date => (
        <li key={date.dateAsNumber}>
          {formatDate(date)}
          <ButtonSecondary
            onClick={
              () => removeMountainCompletion({ variables: { userId, mountainId: id, date: getDateAsString(date)}})
            }
          >
            Remove Ascent
          </ButtonSecondary>
        </li>
      ));
      completionContent = (
        <>
          <h2>Ascent dates</h2>
          <ul>
            {completionListItems}
          </ul>
          <ButtonPrimary onClick={() => setEditMountainId(id)}>
            Add another ascent
          </ButtonPrimary>
        </>
      );
    } else {
      completionContent = (
        <>
          <h2>Completed dates</h2>
          <p>You have not yet hiked {name}.</p>
          <ButtonPrimary onClick={() => setEditMountainId(id)}>
            Add Ascent Date
          </ButtonPrimary>
        </>
      );
    }
    return (
      <>
        <h1>{name}</h1>
        {completionContent}
        {editMountainModal}
      </>
    );
  } else {
    return null;
  }
};

export default MountainDetail;
