import { gql, useQuery } from '@apollo/client';
import {Campsite, Mountain, PeakList, State, Trail} from '../../types/graphQLTypes';

const GET_PEAK_LIST_ITEMS = gql`
  query GetPeakListItems($id: ID!) {
    peakList(id: $id) {
      id
      type
      mountains {
        id
        name
        elevation
        location
        locationTextShort
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
        trailLength
        locationTextShort
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
        locationTextShort
        state {
          id
          abbreviation
        }
      }
      optionalMountains {
        id
        name
        elevation
        location
        locationTextShort
        state {
          id
          abbreviation
        }
      }
      optionalTrails {
        id
        name
        type
        center
        line
        trailLength
        locationTextShort
        states {
          id
          abbreviation
        }
      }
      optionalCampsites {
        id
        name
        type
        location
        locationTextShort
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
  locationTextShort: Mountain['locationTextShort'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
}

interface TrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  center: Trail['center'];
  line: Trail['line'];
  trailLength: Trail['trailLength'];
  locationTextShort: Trail['locationTextShort'];
  states: Array<{
    id: State['id'];
    abbreviation: State['abbreviation'];
  } | null>;
}

interface CampsiteDatum {
  id: Campsite['id'];
  name: Campsite['name'];
  type: Campsite['type'];
  location: Campsite['location'];
  locationTextShort: Trail['locationTextShort'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
}

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    type: PeakList['type'];
    mountains: MountainDatum[];
    trails: TrailDatum[];
    campsites: CampsiteDatum[];
    optionalMountains: MountainDatum[];
    optionalTrails: TrailDatum[];
    optionalCampsites: CampsiteDatum[];
  };
}

export const usePeakListItems = (peakListId: string) => useQuery<SuccessResponse, {id: string}>(
  GET_PEAK_LIST_ITEMS, {
    variables: { id: peakListId },
  });
