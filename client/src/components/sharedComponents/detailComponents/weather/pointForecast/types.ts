import {NWSForecastDatum} from './NWSForecast';
import {OpenWeatherForecastDatum} from './OpenWeatherForecast';

export enum ForecastSource {
  NWS = 'nws',
  OpenWeatherMap = 'openweathermap',
}

export type Forecast = {
  source: ForecastSource.OpenWeatherMap;
  data: OpenWeatherForecastDatum;
} | {
  source: ForecastSource.NWS;
  data: NWSForecastDatum[];
};

export enum AltValues {
  Trace = 'trace amounts',
  NoData = 'no data',
}

export interface SnowValue {
  date: Date; value: number | AltValues;
}

export interface CleanedSnowData {
  county: string;
  stationName: string;
  location: [number, number];
  distance: number;
  elevation: number;
  values: SnowValue[];
}

export interface SnowReport {
  snowfall: CleanedSnowData;
  snowdepth: CleanedSnowData;
}
