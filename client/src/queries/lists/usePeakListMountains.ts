import { gql, useQuery } from '@apollo/client';
import {Mountain, PeakList, State} from '../../types/graphQLTypes';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!) {
    peakList(id: $id) {
      id
      mountains {
        id
        name
        elevation
        state {
          id
          abbreviation
        }
      }
    }
  }
`;

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  elevation: Mountain['elevation'];
  state: {
    id: State['id'];
    abbreviation: State['abbreviation'];
  } | null;
}

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    mountains: MountainDatum[];
  };
}

export const usePeakListMountains = (peakListId: string) => useQuery<SuccessResponse, {id: string}>(
  GET_PEAK_LIST, {
    variables: { id: peakListId },
  });
