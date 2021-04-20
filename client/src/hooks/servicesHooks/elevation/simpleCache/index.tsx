import {CoordinateWithElevation} from '../../../../types/graphQLTypes';

export interface SuccessResponse {
  avg_slope?: number;
  elevation_gain?: number;
  elevation_loss?: number;
  elevation_max?: number;
  elevation_min?: number;
  line: CoordinateWithElevation[];
  max_slope?: number;
  min_slope?: number;
}

const LINE_ELEVATION_CACHE: Array<{key: string, data: SuccessResponse}> = [];

export const writeLineElevationCache = (url: string, data: SuccessResponse) => {
  LINE_ELEVATION_CACHE.push({
    key: url,
    data,
  });
  if (LINE_ELEVATION_CACHE.length > 100) {
    LINE_ELEVATION_CACHE.unshift();
  }
};

export const readLineElevationCache = (url: string) => {
  return LINE_ELEVATION_CACHE.find(d => d.key === url);
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
