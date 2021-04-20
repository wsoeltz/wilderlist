import {ParkingType} from '../../../../types/graphQLTypes';

export interface Destination {
  hours: number;
  miles: number;
  minutes: number;
  originLat: number;
  originLng: number;
  originName: string | null;
  originType: ParkingType | string | undefined | null;
}

const ROUTES_CACHE: Array<{key: string, data: Destination[]}> = [];

export const writeRoutesCache = (url: string, data: Destination[]) => {
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
