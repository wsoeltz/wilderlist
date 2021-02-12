import {Coordinate, CoordinateWithElevation} from '../../../../types/graphQLTypes';

interface Feature {
  type: 'Feature';
  properties: {
    trails: Array<{
      name?: string | null;
      type?: string | null;
      id: string;
    }>,
    routeLength: number,
    elevationGain?: number | null,
    elevationLoss?: number | null,
    elevationMin?: number | null,
    elevationMax?: number | null,
    avgSlope?: number | null,
    maxSlope?: number | null,
    minSlope?: number | null,
    destination: {
      _id: string,
      name?: string | null,
      type?: string | null,
      location: [Coordinate],
    },
  };
  geometry: {
    type: 'LineString',
    coordinates: CoordinateWithElevation[];
  };
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

const ROUTES_CACHE: Array<{key: string, data: FeatureCollection}> = [];

export const writeRoutesCache = (url: string, data: FeatureCollection) => {
  ROUTES_CACHE.push({
    key: url,
    data,
  });
  if (ROUTES_CACHE.length > 100) {
    ROUTES_CACHE.unshift();
  }
};

export const readRoutesCache = (url: string) => {
  return ROUTES_CACHE.find(d => d.key === url);
};
