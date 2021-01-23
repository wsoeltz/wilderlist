import {
  Forecast,
} from '../types';

const NWS_CACHE: Array<{key: string, data: Forecast}> = [];

const keyFromLatLng = (lat: number, lng: number) => `${lat.toFixed(3)}${lng.toFixed(3)}`;

export const writeNWSCache = (lat: number, lng: number, data: Forecast) => {
  NWS_CACHE.push({
    key: keyFromLatLng(lat, lng),
    data,
  });
  if (NWS_CACHE.length > 100) {
    NWS_CACHE.unshift();
  }
};

export const readNWSCache = (lat: number, lng: number) => {
  const key = keyFromLatLng(lat, lng);
  return NWS_CACHE.find(d => d.key === key);
};
