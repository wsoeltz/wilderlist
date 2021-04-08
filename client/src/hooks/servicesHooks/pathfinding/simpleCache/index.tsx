import {Coordinate, CoordinateWithElevation} from '../../../../types/graphQLTypes';

export interface SegmentFeature {
  type: 'Feature';
  properties: {
    name?: string | null,
    type?: string | null,
    id: string,
    routeLength: number,
    elevationGain?: number | null,
    elevationLoss?: number | null,
    elevationMin?: number | null,
    elevationMax?: number | null,
    avgSlope?: number | null,
    maxSlope?: number | null,
    minSlope?: number | null,
  };
  geometry: {
    type: 'LineString',
    coordinates: CoordinateWithElevation[],
  };
}

export interface Destination {
  _id: string;
  name?: string | null;
  type?: string | null;
  elevation?: number | null;
  location: Coordinate;
}

export interface Feature {
  type: 'Feature';
  properties: {
    trails: Array<{
      name?: string | null,
      type?: string | null,
      id: string,
    }>,
    trailSegments: SegmentFeature[],
    routeLength: number,
    elevationGain?: number | null,
    elevationLoss?: number | null,
    elevationMin?: number | null,
    elevationMax?: number | null,
    avgSlope?: number | null,
    maxSlope?: number | null,
    minSlope?: number | null,
    destination: Destination,
  };
  geometry: {
    type: 'LineString',
    coordinates: CoordinateWithElevation[],
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

const QUEUED_URLS: string[] = [];

export const isUrlQueued = (url: string) => {
  if (QUEUED_URLS.includes(url)) {
    return true;
  }
  return false;
};

export const pushUrlToQueue = (url: string) => {
  if (!QUEUED_URLS.includes(url)) {
    QUEUED_URLS.push(url);
  }
};

export const removeUrlFromQueue = (url: string) => {
  const index = QUEUED_URLS.indexOf(url);
  if (index > -1) {
    QUEUED_URLS.splice(index, 1);
  }
};
