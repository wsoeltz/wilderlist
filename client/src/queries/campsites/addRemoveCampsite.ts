import { gql, useMutation } from '@apollo/client';
import {
  Campsite,
  CampsiteOwnership,
  CampsiteReservation,
  CampsiteType,
  State,
  User,
} from '../../types/graphQLTypes';

export const campsiteQuery = `
      id
      name
      type
      location
      elevation
      locationText
      locationTextShort
      website
      ownership
      electricity
      toilets
      drinking_water
      email
      reservation
      showers
      phone
      fee
      tents
      capacity
      internet_access
      fire
      maxtents
      state {
        id
        name
      }
      author {
        id
      }
      flag
`;

const campsiteVariableTypes = `
  $name: String,
  $type: String!,
  $latitude: Float!,
  $longitude: Float!,
  $elevation: Float!,
  $state: ID!,
  $locationText: String!,
  $locationTextShort: String!,
  $website: String,
  $ownership: String,
  $electricity: Boolean,
  $toilets: Boolean,
  $drinking_water: Boolean,
  $email: String,
  $reservation: String,
  $showers: Boolean,
  $phone: String,
  $fee: Boolean,
  $tents: Boolean,
  $capacity: Int,
  $internet_access: Boolean,
  $fire: Boolean,
  $maxtents: Int,
`;

const campsiteBaseVariables = `
  name: $name,
  type: $type,
  latitude: $latitude,
  longitude: $longitude,
  elevation: $elevation,
  state: $state,
  locationText: $locationText,
  locationTextShort: $locationTextShort,
  website: $website,
  ownership: $ownership,
  electricity: $electricity,
  toilets: $toilets,
  drinking_water: $drinking_water,
  email: $email,
  reservation: $reservation,
  showers: $showers,
  phone: $phone,
  fee: $fee,
  tents: $tents,
  capacity: $capacity,
  internet_access: $internet_access,
  fire: $fire,
  maxtents: $maxtents,
`;

const ADD_CAMPSITE = gql`
  mutation(
    $author: ID!,
    ${campsiteVariableTypes}
  ) {
    campsite: addCampsite(
      ${campsiteBaseVariables}
      author: $author,
    ) {
      ${campsiteQuery}
    }
  }
`;
const EDIT_CAMPSITE = gql`
  mutation(
    $id: ID!,
    ${campsiteVariableTypes}
  ) {
    campsite: updateCampsite(
      id: $id,
      ${campsiteBaseVariables}
    ) {
      ${campsiteQuery}
    }
  }
`;

export interface CampsiteSuccessResponse {
  campsite: null | {
    id: Campsite['id'];
    name: Campsite['name'];
    type: Campsite['type'];
    location: Campsite['location'];
    elevation: Campsite['elevation'];
    locationText: Campsite['locationText'];
    locationTextShort: Campsite['locationTextShort'];
    website: Campsite['website'];
    ownership: Campsite['ownership'];
    electricity: Campsite['electricity'];
    toilets: Campsite['toilets'];
    drinking_water: Campsite['drinking_water'];
    email: Campsite['email'];
    reservation: Campsite['reservation'];
    showers: Campsite['showers'];
    phone: Campsite['phone'];
    fee: Campsite['fee'];
    tents: Campsite['tents'];
    capacity: Campsite['capacity'];
    internet_access: Campsite['internet_access'];
    fire: Campsite['fire'];
    maxtents: Campsite['maxtents'];
    state: null | {id: State['id'], name: State['name']};
    author: null | {
      id: User['id'];
    }
    flag: Campsite['flag'];
  };
}

export interface BaseCampsiteVariables {
  name?: string | null;
  type: CampsiteType;
  latitude: number;
  longitude: number;
  elevation: number;
  state: string;
  locationText: string;
  locationTextShort: string;
  website?: string | null;
  ownership?: CampsiteOwnership | null;
  electricity?: boolean | null;
  toilets?: boolean | null;
  drinking_water?: boolean | null;
  email?: string | null;
  reservation?: CampsiteReservation | string | null;
  showers?: boolean | null;
  phone?: string | null;
  fee?: boolean | null;
  tents?: boolean | null;
  capacity?: number | null;
  internet_access?: boolean | null;
  fire?: boolean | null;
  maxtents?: number | null;
}

export interface AddCampsiteVariables extends BaseCampsiteVariables {
  author: string;
}
interface EditCampsiteVariables extends BaseCampsiteVariables {
  id: string;
}

export const useAddCampsite = () => {
  const [addCampsite] = useMutation<CampsiteSuccessResponse, AddCampsiteVariables>(ADD_CAMPSITE);
  return addCampsite;
};

export const useEditCampsite = () => {
  const [editCampsite] = useMutation<CampsiteSuccessResponse, EditCampsiteVariables>(EDIT_CAMPSITE);
  return editCampsite;
};
