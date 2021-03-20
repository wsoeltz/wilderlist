import mapboxgl from 'mapbox-gl';
import openweatherMapLayer from './openweatherMapLayer';
import precipitation from './precipitation';

export enum WeatherOverlay {
  precipitation = 'precipitation',
  pressure = 'pressure',
  wind = 'wind',
  temp = 'temp',
  clouds = 'clouds',
}

export interface WeatherState {
  type: WeatherOverlay;
  activeTime: Date;
  allTimes: Date[];
  setTime: (date: Date) => WeatherState | null;
}

let weatherState: WeatherState | null = null;

const sourceId = 'weather-overlay-source-id';

export const getWeatherState = () => weatherState;
export const updateActiveTime = (date: Date) => {
  if (weatherState) {
    weatherState.activeTime = date;
  }
  return weatherState;
};

const setWeatherOverlay = async (map: mapboxgl.Map, value: WeatherOverlay | null): Promise<WeatherState | null> => {
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
  if (value === WeatherOverlay.precipitation) {
    weatherState = await precipitation({map, sourceId});
  } else if (value !== null) {
    weatherState = await openweatherMapLayer({map, sourceId, type: value});
  } else {
    weatherState = null;
  }
  return weatherState;
};

export default setWeatherOverlay;
