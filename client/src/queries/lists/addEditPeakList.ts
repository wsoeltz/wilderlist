import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Campsite,
  Coordinate,
  ExternalResource,
  ListPrivacy,
  Mountain,
  PeakList,
  PeakListTier,
  State,
  Trail,
  User,
} from '../../types/graphQLTypes';

const baseQuery = `
  id
  name
  shortName
  description
  mountains {
    id
    name
    location
    elevation
    state {
      id
      abbreviation
    }
  }
  optionalMountains {
    id
    name
    location
    elevation
    state {
      id
      abbreviation
    }
  }
  trails {
    id
    name
    center
    line
    type
    states {
      id
      abbreviation
    }
  }
  optionalTrails {
    id
    name
    center
    line
    type
    states {
      id
      abbreviation
    }
  }
  campsites {
    id
    name
    location
    type
    state {
      id
      abbreviation
    }
  }
  optionalCampsites {
    id
    name
    location
    type
    state {
      id
      abbreviation
    }
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
  privacy
  center
  bbox
`;

// const baseMutationVariableDefs = `
//   $name: String!,
//   $shortName: String!,
//   $description: String,
//   $optionalPeaksDescription: String,
//   $type: PeakListVariants!,
//   $mountains: [ID!],
//   $optionalMountains: [ID],
//   $parent: ID,
//   $states: [ID!],
//   $resources: [ExternalResourcesInputType],
//   $tier: PeakListTier!,
// `;
// const baseMutationVariables = `
//   name: $name,
//   shortName: $shortName,
//   description: $description,
//   optionalPeaksDescription: $optionalPeaksDescription,
//   type: $type,
//   mountains: $mountains,
//   optionalMountains: $optionalMountains,
//   parent: $parent,
//   states: $states,
//   resources: $resources,
//   tier: $tier,
// `;

// const ADD_PEAK_LIST = gql`
//   mutation addPeakList(
//     $author: ID!,
//     ${baseMutationVariableDefs}
//   ) {
//     peakList: addPeakList(
//       author: $author,
//       ${baseMutationVariables}
//     ) {
//       ${baseQuery}
//     }
//   }
// `;
// const EDIT_PEAK_LIST = gql`
//   mutation editPeakList(
//     $id: ID!,
//     ${baseMutationVariableDefs}
//   ) {
//     peakList: editPeakList(
//       id: $id,
//       ${baseMutationVariables}
//     ) {
//       ${baseQuery}
//     }
//   }
// `;

const ADD_EDIT_PEAK_LIST = gql`
  mutation AddEditPeakList(
    $id: ID!,
    $name: String!
    $shortName: String!
    $description: String,
    $mountains: [ID],
    $optionalMountains: [ID],
    $trails: [ID],
    $optionalTrails: [ID],
    $campsites: [ID],
    $optionalCampsites: [ID],
    $states: [ID],
    $resources: [ExternalResourcesInputType],,
    $tier: PeakListTier,
    $privacy: String,
    $center: [Float],
    $bbox: [Float],
  ) {
    peakList: addEditPeakList(
      id: $id,
      name: $name,
      shortName: $shortName,
      description: $description,
      mountains: $mountains,
      optionalMountains: $optionalMountains,
      trails: $trails,
      optionalTrails: $optionalTrails,
      campsites: $campsites,
      optionalCampsites: $optionalCampsites,
      states: $states,
      resources: $resources,
      tier: $tier,
      privacy: $privacy,
      center: $center,
      bbox: $bbox,
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

export interface Variables {
  id: string;
  name: string;
  shortName: string;
  description: string;
  mountains: string[];
  optionalMountains: string[];
  trails: string[];
  optionalTrails: string[];
  campsites: string[];
  optionalCampsites: string[];
  states: string[];
  resources: ExternalResource[];
  tier: PeakListTier;
  privacy: ListPrivacy;
  center: Coordinate;
  bbox: [number, number, number, number];
}

// interface BaseVariables extends FormInput {
//   author: string;
// }

// interface EditVariables extends FormInput {
//   id: string;
// }

export interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    name: PeakList['name'];
    shortName: PeakList['shortName'];
    description: PeakList['description'];
    mountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
      location: Mountain['location'];
      elevation: Mountain['elevation'];
      state: {
        id: State['id'];
        abbreviation: State['abbreviation'];
      }
    }>
    optionalMountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
      location: Mountain['location'];
      elevation: Mountain['elevation'];
      state: {
        id: State['id'];
        abbreviation: State['abbreviation'];
      }
    }>
    trails: Array<{
      id: Trail['id'];
      name: Trail['name'];
      center: Trail['center'];
      line: Trail['line'];
      type: Trail['type'];
      states: Array<{
        id: State['id'];
        abbreviation: State['abbreviation'];
      }>
    }>
    optionalTrails: Array<{
      id: Trail['id'];
      name: Trail['name'];
      center: Trail['center'];
      line: Trail['line'];
      type: Trail['type'];
      states: Array<{
        id: State['id'];
        abbreviation: State['abbreviation'];
      }>
    }>
    campsites: Array<{
      id: Campsite['id'];
      name: Campsite['name'];
      location: Campsite['location'];
      type: Campsite['type'];
      state: {
        id: State['id'];
        abbreviation: State['abbreviation'];
      }
    }>
    optionalCampsites: Array<{
      id: Campsite['id'];
      name: Campsite['name'];
      location: Campsite['location'];
      type: Campsite['type'];
      state: {
        id: State['id'];
        abbreviation: State['abbreviation'];
      }
    }>
    resources: PeakList['resources'];
    author: null | {
      id: User['id'];
    }
    tier: PeakList['tier'];
    flag: PeakList['flag'];
    status: PeakList['status'];
    privacy: PeakList['privacy'];
    center: PeakList['center'];
    bbox: PeakList['bbox'];
  };
}

export const useGetPeakList = (id: string | null) => useQuery<SuccessResponse, {id: string | null}>(
  GET_PEAK_LIST,
  {variables: { id},
});

// export const useAddPeakList = () => {
//   const [addPeakList] = useMutation<SuccessResponse, BaseVariables>(ADD_PEAK_LIST);
//   return addPeakList;
// };

// export const useEditPeakList = () => {
//   const [editPeakList] = useMutation<SuccessResponse, EditVariables>(EDIT_PEAK_LIST);
//   return editPeakList;
// };

const useAddEditPeakList = () => {
  const [addEditPeakList] = useMutation<SuccessResponse, Variables>(ADD_EDIT_PEAK_LIST);
  return addEditPeakList;
};

export default useAddEditPeakList;
