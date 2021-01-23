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
