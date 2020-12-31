import { gql, useQuery } from '@apollo/client';
import useMapCenter from '../../hooks/useMapCenter';
import usePrevious from '../../hooks/usePrevious';
import {
  Mountain, State,
 } from '../../types/graphQLTypes';

const GEO_NEAR_MOUNTAINS = gql`
  query GeoNearMountains(
    $latitude: Float!,
    $longitude: Float!,
    $limit: Int!,
  ) {
    mountains: geoNearMountains(
      latitude: $latitude,
      longitude: $longitude,
      limit: $limit,
    ) {
      id
      name
      state {
        id
        name
      }
      elevation
      location
    }
  }
`;

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: null | {
    id: State['id'],
    name: State['name'],
  };
  elevation: Mountain['elevation'];
  location: Mountain['location'];
}

interface SuccessResponse {
  mountains: MountainDatum[];
}

interface Variables {
  latitude: number;
  longitude: number;
  limit: number;
}

export const useGeoNearMountains = () => {
  const [longitude, latitude] = useMapCenter();

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GEO_NEAR_MOUNTAINS, {
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
