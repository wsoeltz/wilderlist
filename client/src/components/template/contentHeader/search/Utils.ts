import {
  CampsiteType,
  Coordinate,
  TrailType,
} from '../../../../types/graphQLTypes';
import {SearchResultType} from '../../../../types/itemTypes';

export const noResultsFoundClassName = 'react-autosuggest__no_results_found';

export type SearchResultDatum = {
  id: string,
  name: string,
  type: SearchResultType,
  distance: number,
  coordinates: Coordinate,
} & (
  {
    type: SearchResultType.mountain,
    elevation: number,
    locationText: string,
  } |
  {
    type: SearchResultType.trail,
    locationText: string,
    trailType: TrailType,
    trailLength: number,
    parents: string[],
  } |
  {
    type: SearchResultType.campsite,
    campsiteType: CampsiteType,
    locationText: string,
  } |
  {
    type: SearchResultType.list,
    numPeaks: number,
    locationText: string,
  } |
  {
    type: SearchResultType.geolocation,
    locationName: string,
  }
);
