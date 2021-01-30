import { gql, useMutation } from '@apollo/client';
import {
  Mountain,
} from '../../types/graphQLTypes';

const FLAG_MOUNTAIN = gql`
  mutation($id: ID!, $flag: String) {
    mountain: updateMountainFlag(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;

interface FlagSuccessResponse {
  mountain: null | {
    id: Mountain['id'];
    flag: Mountain['flag'];
  };
}

interface FlagVariables {
  id: string;
  flag: string | null;
}

export const useUpdateMountainFlag = () => {
  const [updateMountainFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_MOUNTAIN);
  return updateMountainFlag;
};
