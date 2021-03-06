import { gql, useQuery } from '@apollo/client';
import useMapCenter from '../../hooks/useMapCenter';
import usePrevious from '../../hooks/usePrevious';
import {
  Campsite,
 } from '../../types/graphQLTypes';

const GEO_NEAR_CAMPSITES = gql`
  query GeoNearCampsites(
    $latitude: Float!,
    $longitude: Float!,
    $limit: Int!,
  ) {
    campsites: geoNearCampsites(
      latitude: $latitude,
      longitude: $longitude,
      limit: $limit,
      hasName: true,
    ) {
      id
      name
      type
      locationText
      ownership
      location
    }
  }
`;

export interface CampsiteDatum {
  id: Campsite['id'];
  name: Campsite['name'];
  locationText: Campsite['locationText'];
  type: Campsite['type'];
  ownership: Campsite['ownership'];
  location: Campsite['location'];
}

interface SuccessResponse {
  campsites: CampsiteDatum[];
}

interface Variables {
  latitude: number;
  longitude: number;
  limit: number;
}

export const useGeoNearCampsites = () => {
  const [longitude, latitude] = useMapCenter();

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GEO_NEAR_CAMPSITES, {
    variables: {
      latitude,
      longitude,
      limit: 15,
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
