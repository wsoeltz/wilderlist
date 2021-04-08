import {Coordinate} from '../../../../types/graphQLTypes';

export interface StationDatum {
  ghcnid: string;
  url: string;
  name: string;
  county: string;
  elevation: string;
  coordinates: Coordinate;
  day: number;
  month: number; // accurate to month
  year: number;
  distance: number; // in miles
  mostRecentValue: string | 'T' | 'M'; // string as number or T for trace amounts or M for missing data
  hasRecentValue: 0 | 1; // 0 === false, 1 === true
}

// API returns values already sorted by distance from point
export interface SnowReport {
  snowFall: StationDatum[];
  snowDepth: StationDatum[];
}

const SNOW_AND_ICE_CACHE: Array<{key: string, data: SnowReport}> = [];

export const writeSnowCache = (url: string, data: SnowReport) => {
  SNOW_AND_ICE_CACHE.push({
    key: url,
    data,
  });
  if (SNOW_AND_ICE_CACHE.length > 100) {
    SNOW_AND_ICE_CACHE.unshift();
  }
};

export const readSnowCache = (url: string) => {
  return SNOW_AND_ICE_CACHE.find(d => d.key === url);
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
