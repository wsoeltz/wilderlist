import { gql, useMutation } from '@apollo/client';
import {
  PeakList,
} from '../../types/graphQLTypes';

export const FLAG_PEAK_LIST = gql`
  mutation($id: ID!, $flag: String) {
    peakList: updatePeakListFlag(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;

export interface FlagSuccessResponse {
  peakList: null | {
    id: PeakList['id'];
    flag: PeakList['flag'];
  };
}

export interface FlagVariables {
  id: string;
  flag: string | null;
}

export const useUpdatePeakListFlag = () => {
  const [updatePeakListFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_PEAK_LIST);
  return updatePeakListFlag;
};
