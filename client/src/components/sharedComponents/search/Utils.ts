import {
  CampsiteType,
  Coordinate,
  TrailType,
} from '../../../types/graphQLTypes';

export const noResultsFoundClassName = 'react-autosuggest__no_results_found';

export enum SearchResultType {
  mountain = 'mountain',
  trail = 'trail',
  campsite = 'campsite',
  list = 'list',
  geolocation = 'geolocation',
}

export type SearchResultDatum = {
  id: string,
  name: string,
  type: SearchResultType,
  distance: number,
  coordinates: Coordinate,
  datum: any;
} & (
  {
    type: SearchResultType.mountain,
    elevation: number,
    stateText: string[],
  } |
  {
    type: SearchResultType.trail,
    stateText: string[],
    trailType: TrailType,
    parents: string[],
  } |
  {
    type: SearchResultType.campsite,
    campsiteType: CampsiteType,
    stateText: string[],
  } |
  {
    type: SearchResultType.list,
    numPeaks: number,
    stateText: string[],
  } |
  {
    type: SearchResultType.geolocation,
    locationName: string,
  }
);
