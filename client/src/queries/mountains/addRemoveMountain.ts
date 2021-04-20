import { gql, useMutation } from '@apollo/client';
import { Mountain, State, User } from '../../types/graphQLTypes';

export const mountainQuery = `
      id
      name
      elevation
      latitude
      longitude
      location
      locationText
      locationTextShort
      state {
        id
        name
      }
      author {
        id
      }
      flag
`;

const mountainVariableTypes = `
  $name: String!,
  $elevation: Float!,
  $latitude: Float!,
  $longitude: Float!,
  $state: ID!,
  $locationText: String!,
  $locationTextShort: String!,
`;

const mountainBaseVariables = `
  name: $name,
  elevation: $elevation,
  latitude: $latitude,
  longitude: $longitude,
  state: $state,
  locationText: $locationText,
  locationTextShort: $locationTextShort,
`;

const ADD_MOUNTAIN = gql`
  mutation(
    $author: ID!,
    ${mountainVariableTypes}
  ) {
    mountain: addMountain(
      ${mountainBaseVariables}
      author: $author,
    ) {
      ${mountainQuery}
    }
  }
`;
const EDIT_MOUNTAIN = gql`
  mutation(
    $id: ID!,
    ${mountainVariableTypes}
  ) {
    mountain: updateMountain(
      id: $id,
      ${mountainBaseVariables}
    ) {
      ${mountainQuery}
    }
  }
`;

export interface MountainSuccessResponse {
  mountain: null | {
    id: Mountain['id'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    latitude: Mountain['latitude'];
    longitude: Mountain['longitude'];
    location: Mountain['location'];
    state: null | {id: State['id'], name: State['name']};
    locationText: Mountain['locationText'];
    locationTextShort: Mountain['locationTextShort'];
    author: null | {
      id: User['id'];
    }
    flag: Mountain['flag'];
  };
}

export interface BaseMountainVariables {
  name: string;
  elevation: number;
  latitude: number;
  longitude: number;
  state: string;
  locationText: string;
  locationTextShort: string;
}

export interface AddMountainVariables extends BaseMountainVariables {
  author: string;
}
interface EditMountainVariables extends BaseMountainVariables {
  id: string;
}

export const useAddMountain = () => {
  const [addMountain] = useMutation<MountainSuccessResponse, AddMountainVariables>(ADD_MOUNTAIN);
  return addMountain;
};

export const useEditMountain = () => {
  const [editMountain] = useMutation<MountainSuccessResponse, EditMountainVariables>(EDIT_MOUNTAIN);
  return editMountain;
};
