import { gql, useQuery } from '@apollo/client';
import useMapCenter from '../../hooks/useMapCenter';
import usePrevious from '../../hooks/usePrevious';
import {
  Trail,
 } from '../../types/graphQLTypes';

const GEO_NEAR_TRAILS = gql`
  query GeoNearTrails(
    $latitude: Float!,
    $longitude: Float!,
    $limit: Int!,
  ) {
    trails: geoNearTrails(
      latitude: $latitude,
      longitude: $longitude,
      limit: $limit,
      maxDistance: 48280,
      hasName: true
    ) {
      id
      name
      locationText
      trailLength
      avgSlope
      type
      center
    }
  }
`;

export interface TrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  locationText: Trail['locationText'];
  trailLength: Trail['trailLength'];
  avgSlope: Trail['avgSlope'];
  center: Trail['center'];
}

interface SuccessResponse {
  trails: TrailDatum[];
}

interface Variables {
  latitude: number;
  longitude: number;
  limit: number;
}

export const useGeoNearTrails = () => {
  const [longitude, latitude] = useMapCenter();

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GEO_NEAR_TRAILS, {
    variables: {
      latitude,
      longitude,
      limit: 45,
    },
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

  return {loading, error, data: dataToUse, longitude, latitude};
};
