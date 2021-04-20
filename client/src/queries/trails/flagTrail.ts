import { gql, useMutation } from '@apollo/client';
import {
  Trail,
} from '../../types/graphQLTypes';

const FLAG_TRAIL = gql`
  mutation($id: ID!, $flag: String) {
    trail: updateTrailFlag(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;

interface FlagSuccessResponse {
  trail: null | {
    id: Trail['id'];
    flag: Trail['flag'];
  };
}

interface FlagVariables {
  id: string;
  flag: string | null;
}

export const useUpdateTrailFlag = () => {
  const [updateTrailFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_TRAIL);
  return updateTrailFlag;
};
