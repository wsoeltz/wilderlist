import {
  CampsiteType,
  Coordinate,
  TrailType,
} from '../../../types/graphQLTypes';
import {SearchResultType} from '../../../types/itemTypes';

export const noResultsFoundClassName = 'react-autosuggest__no_results_found';

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
    numTrails: number,
    numCampsites: number,
    stateText: string[],
  } |
  {
    type: SearchResultType.geolocation,
    locationName: string,
  }
);
