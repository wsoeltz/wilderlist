import { gql, useMutation } from '@apollo/client';
import {
  Mountain,
  MountainFlag,
} from '../../types/graphQLTypes';

const FLAG_MOUNTAIN = gql`
  mutation($id: ID!, $flag: MountainFlag) {
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
  flag: MountainFlag | null;
}

export const useUpdateMountainFlag = () => {
  const [updateMountainFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_MOUNTAIN);
  return updateMountainFlag;
};
