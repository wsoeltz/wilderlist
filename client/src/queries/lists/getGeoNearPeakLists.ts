import { gql, useQuery } from '@apollo/client';
import {useMemo} from 'react';
import useMapCenter from '../../hooks/useMapCenter';
import usePrevious from '../../hooks/usePrevious';
import {
  PeakList,
} from '../../types/graphQLTypes';

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  locationText: PeakList['locationText'];
  center: PeakList['center'];
  bbox: PeakList['bbox'];
  numUsers: PeakList['numUsers'];
  numMountains: PeakList['numMountains'];
  numTrails: PeakList['numTrails'];
  numCampsites: PeakList['numCampsites'];
  numCompletedTrips: PeakList['numCampsites'];
}

export interface SuccessResponse {
  peakLists: PeakListDatum[];
}

export interface Variables {
  latitude: number;
  longitude: number;
  limit: number;
}

const GEO_NEAR_PEAK_LISTS = gql`
  query SearchPeakLists(
    $latitude: Float!,
    $longitude: Float!,
    $limit: Int!,
  ) {
    peakLists: geoNearPeakLists(
      latitude: $latitude,
      longitude: $longitude,
      limit: $limit,
    ) {
      id
      name
      locationText
      center
      bbox
      numUsers
      numMountains
      numTrails
      numCampsites
      numCompletedTrips
    }
  }
`;

export const useGeoNearVariables = () => {
  const [longitude, latitude] = useMapCenter();

  return useMemo(() => ({
    latitude: parseFloat(latitude.toFixed(2)),
    longitude: parseFloat(longitude.toFixed(2)),
    limit: 15,
  }), [latitude, longitude]);
};

export const useGeoNearPeakLists = () => {
  const variables = useGeoNearVariables();
  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GEO_NEAR_PEAK_LISTS, {
    variables,
  });
  const prevData = usePrevious(data);
  let dataToUse: SuccessResponse | undefined;
  if (data !== undefined) {
    dataToUse = data;
  } else if (prevData !== undefined) {
    dataToUse = prevData;
  } else {
    dataToUse = undefined;
  }
  return {loading, error, data: dataToUse, ...variables};
};

export const refetchGeoNearPeakLists = (variables: Variables) => ({query: GEO_NEAR_PEAK_LISTS, variables});
