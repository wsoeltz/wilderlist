import { gql, useMutation } from '@apollo/client';
import useCurrentUser from '../../hooks/useCurrentUser';
import { PeakList, User } from '../../types/graphQLTypes';
import {refetchAllInProgressItems} from '../users/useAllInProgressItems';
import {refetchGeoNearPeakLists, useGeoNearVariables} from './getGeoNearPeakLists';
import {refetchUsersPeakLists} from './getUsersPeakLists';

const ADD_PEAK_LIST_TO_USER = gql`
  mutation addPeakListToUser($userId: ID!, $peakListId: ID!) {
    addPeakListToUser(userId: $userId, peakListId: $peakListId) {
      id
      peakLists {
        id
        name
        shortName
        type
        parent {
          id
        }
        numMountains
        numCompletedAscents(userId: $userId)
        latestAscent(userId: $userId)
        isActive(userId: $userId)
      }
    }
  }
`;

const REMOVE_PEAK_LIST_FROM_USER = gql`
  mutation removePeakListFromUser($userId: ID!, $peakListId: ID!) {
    removePeakListFromUser(userId: $userId, peakListId: $peakListId) {
      id
      peakLists {
        id
        name
        shortName
        type
        parent {
          id
        }
        numMountains
        numCompletedAscents(userId: $userId)
        latestAscent(userId: $userId)
        isActive(userId: $userId)
      }
    }
  }
`;

export type AddRemovePeakListSuccessResponse = null | {
  id: User['id'];
  peakLists: Array<{
    id: PeakList['id'];
  }>;
};

export interface AddRemovePeakListVariables {
  userId: string | null;
  peakListId: string;
}

export const useAddPeakListToUser = () => {
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const variables = useGeoNearVariables();

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER, {
      refetchQueries: () => [
        refetchGeoNearPeakLists(variables),
        refetchUsersPeakLists({userId}),
        refetchAllInProgressItems(userId ? userId : ''),
      ],
    });
  return addPeakListToUser;
};

export const useRemovePeakListFromUser = () => {
  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const variables = useGeoNearVariables();

  const [removePeakListFromUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(REMOVE_PEAK_LIST_FROM_USER, {
      refetchQueries: () => [
        refetchGeoNearPeakLists(variables),
        refetchUsersPeakLists({userId}),
        refetchAllInProgressItems(userId ? userId : ''),
      ],
    });
  return removePeakListFromUser;
};
