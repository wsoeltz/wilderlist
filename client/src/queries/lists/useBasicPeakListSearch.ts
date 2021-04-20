import { gql, useQuery } from '@apollo/client';
import { PeakList } from '../../types/graphQLTypes';
import {MountainDatum} from '../mountains/useBasicSearchMountains';

const SEARCH_PEAK_LISTS = gql`
  query SearchPeakLists(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
  ) {
    peakLists: peakListsSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      shortName
      type
      mountains {
        id
        name
        state {
          id
          abbreviation
        }
        elevation
        latitude
        longitude
      }
      optionalMountains {
        id
        name
        state {
          id
          abbreviation
        }
        elevation
        latitude
        longitude
      }
      parent {
        id
      }
    }
  }
`;

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  mountains: null | MountainDatum[];
  optionalMountains: null | MountainDatum[];
  parent: null | { id: PeakList['id'] };
}

interface SuccessResponse {
  peakLists: null | PeakListDatum[];
}

interface Variables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}

export const useBasicPeakListSearch = (variables: Variables) =>
  useQuery<SuccessResponse, Variables>(SEARCH_PEAK_LISTS, {variables});
