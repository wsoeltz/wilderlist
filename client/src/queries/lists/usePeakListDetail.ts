import { gql, useQuery } from '@apollo/client';
import {
  Mountain,
  PeakList,
  State,
  User,
} from '../../types/graphQLTypes';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!, $userId: ID) {
    peakList(id: $id) {
      id
      name
      shortName
      description
      optionalPeaksDescription
      bbox
      parent {
        id
        name
        type
      }
      children {
        id
        name
        type
      }
      siblings {
        id
        name
        type
      }
      author {
        id
      }
      resources {
        title
        url
      }
      type
      mountains {
        id
        name
        latitude
        longitude
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
        latitude
        longitude
        location
        elevation
        state {
          id
          abbreviation
        }
      }
      stateOrRegionString
    }
    user(id: $userId) {
      id
      name
      permissions
      peakListPermissions
      peakLists {
        id
      }
      mountains {
        mountain {
          id
        }
        dates
      }
      peakListNote(peakListId: $id) {
        id
        text
      }
    }
  }
`;

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  location: Mountain['location'];
  elevation: Mountain['elevation'];
  state: {
    id: State['id'];
    abbreviation: State['abbreviation'];
  } | null;
}

interface ListVariantDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  type: PeakList['type'];
}

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  type: PeakList['type'];
  bbox: PeakList['bbox'];
  description: PeakList['description'];
  optionalPeaksDescription: PeakList['optionalPeaksDescription'];
  resources: PeakList['resources'];
  mountains: MountainDatum[] | null;
  optionalMountains: MountainDatum[] | null;
  stateOrRegionString: PeakList['stateOrRegionString'];
  parent: null | ListVariantDatum;
  children: null | ListVariantDatum[];
  siblings: null | ListVariantDatum[];
  author: null | { id: User['id'] };
}

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  peakLists: Array<{
    id: PeakList['id'];
  }>;
  mountains: User['mountains'];
  peakListPermissions?: User['peakListPermissions'];
  permissions: User['permissions'];
}

interface UserDatumWithNote extends UserDatum {
  peakListNote: User['peakListNote'];
}

interface SuccessResponse {
  peakList: PeakListDatum;
  user: UserDatumWithNote | null;
}

interface Variables {
  id: string;
  userId: string | null;
}

export const usePeakListDetail = (id: string, userId: string | null) => useQuery<SuccessResponse, Variables>(
  GET_PEAK_LIST, {variables: { id, userId }},
);
