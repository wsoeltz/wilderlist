import { gql, useQuery } from '@apollo/client';
import {Campsite, Mountain, PeakList, State, Trail} from '../../types/graphQLTypes';

const GET_PEAK_LIST_ITEMS = gql`
  query GetPeakListItems($id: ID!) {
    peakList(id: $id) {
      id
      mountains {
        id
        name
        elevation
        location
        state {
          id
          abbreviation
        }
      }
      trails {
        id
        name
        type
        center
        line
        states {
          id
          abbreviation
        }
      }
      campsites {
        id
        name
        type
        location
        state {
          id
          abbreviation
        }
      }
    }
  }
`;

interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  elevation: Mountain['elevation'];
  location: Mountain['location'];
  state: {
    id: State['id'];
    abbreviation: State['abbreviation'];
  } | null;
}

interface TrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  center: Trail['center'];
  line: Trail['line'];
  states: null | Array<{
    id: State['id'];
    abbreviation: State['abbreviation'];
  } | null>;
}

interface CampsiteDatum {
  id: Campsite['id'];
  name: Campsite['name'];
  type: Campsite['type'];
  location: Campsite['location'];
  state: {
    id: State['id'];
    abbreviation: State['abbreviation'];
  } | null;
}

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    mountains: MountainDatum[];
    trails: TrailDatum[];
    campsites: CampsiteDatum[];
  };
}

export const usePeakListItems = (peakListId: string) => useQuery<SuccessResponse, {id: string}>(
  GET_PEAK_LIST_ITEMS, {
    variables: { id: peakListId },
  });
