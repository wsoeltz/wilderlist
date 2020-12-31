import { gql, useMutation, useQuery } from '@apollo/client';
import {
  ExternalResource,
  PeakList,
  PeakListTier,
  PeakListVariants,
  State,
} from '../../types/graphQLTypes';

const baseQuery = `
  id
  name
  shortName
  description
  optionalPeaksDescription
  type
  mountains {
    id
    name
    latitude
    longitude
    elevation
    state {
      id
      name
      abbreviation
      regions {
        id
        name
        states {
          id
        }
      }
    }
  }
  optionalMountains {
    id
    name
    latitude
    longitude
    elevation
    state {
      id
      name
      abbreviation
      regions {
        id
        name
        states {
          id
        }
      }
    }
  }
  parent {
    id
    name
    mountains {
      id
      name
      latitude
      longitude
      elevation
      state {
        id
        name
        abbreviation
        regions {
          id
          name
          states {
            id
          }
        }
      }
    }
    optionalMountains {
      id
      name
      latitude
      longitude
      elevation
      state {
        id
        name
        abbreviation
        regions {
          id
          name
          states {
            id
          }
        }
      }
    }
  }
  states {
    id
  }
  resources {
    title
    url
  }
  author {
    id
  }
  tier
  flag
  status
`;

const baseMutationVariableDefs = `
  $name: String!,
  $shortName: String!,
  $description: String,
  $optionalPeaksDescription: String,
  $type: PeakListVariants!,
  $mountains: [ID!],
  $optionalMountains: [ID],
  $parent: ID,
  $states: [ID!],
  $resources: [ExternalResourcesInputType],
  $tier: PeakListTier!,
`;
const baseMutationVariables = `
  name: $name,
  shortName: $shortName,
  description: $description,
  optionalPeaksDescription: $optionalPeaksDescription,
  type: $type,
  mountains: $mountains,
  optionalMountains: $optionalMountains,
  parent: $parent,
  states: $states,
  resources: $resources,
  tier: $tier,
`;

const ADD_PEAK_LIST = gql`
  mutation addPeakList(
    $author: ID!,
    ${baseMutationVariableDefs}
  ) {
    peakList: addPeakList(
      author: $author,
      ${baseMutationVariables}
    ) {
      ${baseQuery}
    }
  }
`;
const EDIT_PEAK_LIST = gql`
  mutation editPeakList(
    $id: ID!,
    ${baseMutationVariableDefs}
  ) {
    peakList: editPeakList(
      id: $id,
      ${baseMutationVariables}
    ) {
      ${baseQuery}
    }
  }
`;

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID) {
    peakList(id: $id) {
      ${baseQuery}
    }
    states {
      id
      abbreviation
    }
  }
`;

export interface FormInput {
  name: string;
  shortName: string;
  description: string | null;
  optionalPeaksDescription: string | null;
  type: PeakListVariants;
  mountains: string[];
  optionalMountains: string[];
  parent: null;
  states: string[];
  resources: ExternalResource[] | null;
  tier: PeakListTier | null;
}

interface BaseVariables extends FormInput {
  author: string;
}

interface EditVariables extends FormInput {
  id: string;
}

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    name: PeakList['name'];
    shortName: PeakList['shortName'];
    description: PeakList['description'];
    optionalPeaksDescription: PeakList['optionalPeaksDescription'];
    type: PeakList['type'];
    mountains: PeakList['mountains'];
    optionalMountains: PeakList['optionalMountains'];
    parent: PeakList['parent'];
    states: PeakList['states'];
    resources: PeakList['resources'];
    author: PeakList['author'];
    tier: PeakList['tier'];
    flag: PeakList['flag'];
    status: PeakList['status'];
  };
  states: Array<{
    id: State['id']
    abbreviation: State['abbreviation'],
  }>;
}

export const useGetPeakList = (id: string | null) => useQuery<SuccessResponse, {id: string | null}>(
  GET_PEAK_LIST,
  {variables: { id},
});

export const useAddPeakList = () => {
  const [addPeakList] = useMutation<SuccessResponse, BaseVariables>(ADD_PEAK_LIST);
  return addPeakList;
};

export const useEditPeakList = () => {
  const [editPeakList] = useMutation<SuccessResponse, EditVariables>(EDIT_PEAK_LIST);
  return editPeakList;
};
