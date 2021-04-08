import {
  Forecast, SnowReport,
} from '../types';

const WEATHER_CACHE: Array<{key: string, data: Forecast}> = [];
const SNOW_REPORT_CACHE: Array<{key: string, data: SnowReport}> = [];

const keyFromLatLng = (lat: number, lng: number, valley: boolean) => `${lat.toFixed(4)}${lng.toFixed(4)}` + (valley ? 'valley' : '');

export const writeWeatherCache = (lat: number, lng: number, valley: boolean, data: Forecast) => {
  WEATHER_CACHE.push({
    key: keyFromLatLng(lat, lng, valley),
    data,
  });
  if (WEATHER_CACHE.length > 100) {
    WEATHER_CACHE.unshift();
  }
};

export const readWeatherCache = (lat: number, lng: number, valley: boolean) => {
  const key = keyFromLatLng(lat, lng, valley);
  return WEATHER_CACHE.find(d => d.key === key);
};

export const writeSnowReportCache = (lat: number, lng: number, valley: boolean, data: SnowReport) => {
  SNOW_REPORT_CACHE.push({
    key: keyFromLatLng(lat, lng, valley),
    data,
  });
  if (SNOW_REPORT_CACHE.length > 100) {
    SNOW_REPORT_CACHE.unshift();
  }
};

export const readSnowReportCache = (lat: number, lng: number, valley: boolean) => {
  const key = keyFromLatLng(lat, lng, valley);
  return SNOW_REPORT_CACHE.find(d => d.key === key);
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
