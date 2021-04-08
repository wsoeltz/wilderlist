import { gql, useMutation } from '@apollo/client';
import { PeakList, PeakListVariants } from '../../types/graphQLTypes';

const ADD_PEAK_LIST = gql`
  mutation addPeakList(
    $name: String!,
    $shortName: String!,
    $type: PeakListVariants!,
    $parent: ID!,
  ) {
    peakList: addPeakList(
      name: $name,
      shortName: $shortName,
      type: $type,
      parent: $parent,
    ) {
      id
    }
  }
`;

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
  };
}

interface AddChildListVariables {
  name: string;
  shortName: string;
  type: PeakListVariants;
  parent: string;
}

export const useAddPeakListVariant = () => {
  const [addPeakList] = useMutation<SuccessResponse, AddChildListVariables>(ADD_PEAK_LIST);
  return addPeakList;
};
