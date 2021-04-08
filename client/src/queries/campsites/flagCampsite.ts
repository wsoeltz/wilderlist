import { gql, useMutation } from '@apollo/client';
import {
  Campsite,
} from '../../types/graphQLTypes';

const FLAG_CAMPSITE = gql`
  mutation($id: ID!, $flag: String) {
    campsite: updateCampsiteFlag(id: $id, flag: $flag) {
      id
      flag
    }
  }
`;

interface FlagSuccessResponse {
  campsite: null | {
    id: Campsite['id'];
    flag: Campsite['flag'];
  };
}

interface FlagVariables {
  id: string;
  flag: string | null;
}

export const useUpdateCampsiteFlag = () => {
  const [updateCampsiteFlag] = useMutation<FlagSuccessResponse, FlagVariables>(FLAG_CAMPSITE);
  return updateCampsiteFlag;
};
