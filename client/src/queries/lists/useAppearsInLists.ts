import { gql, useQuery } from '@apollo/client';
import {
  PeakList,
} from '../../types/graphQLTypes';
import {
  CoreItems,
} from '../../types/itemTypes';

interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  numMountains: PeakList['numMountains'];
  numTrails: PeakList['numTrails'];
  numCampsites: PeakList['numCampsites'];
  locationText: PeakList['locationText'];
  isActive: PeakList['isActive'];
}

const GET_APPEARS_IN_LISTS = gql`
  query GetAppearsIn($id: ID!, $field: String!) {
    appearsIn(id: $id, field: $field) {
      id
      name
      shortName
      numMountains
      numTrails
      numCampsites
      locationText
      isActive
    }
  }
`;

interface Variables {
  id: string;
  field: CoreItems;
}

interface SuccessResponse {
  appearsIn: PeakListDatum[];
}

const useAppearsInLists = (variables: Variables) => useQuery<SuccessResponse, Variables>(
  GET_APPEARS_IN_LISTS, {variables},
);

export default useAppearsInLists;
