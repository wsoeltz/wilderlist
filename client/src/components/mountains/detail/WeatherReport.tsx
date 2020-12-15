import { GetString } from 'fluent-react/compat';
import React, {useContext, useEffect, useState} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import getWeather from '../../../utilities/getWeather';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import NWSForecast, {NWSForecastDatum} from './weather/NWSForecast';
import OpenWeatherForecast, {OpenWeatherForecastDatum} from './weather/OpenWeatherForecast';
import {
  ForecastRootContainer,
  LoadingContainer,
} from './weather/Utils';

enum ForecastSource {
  NWS = 'nws',
  OpenWeatherMap = 'openweathermap',
}

type Forecast = {
  source: ForecastSource.OpenWeatherMap;
  data: OpenWeatherForecastDatum;
} | {
  source: ForecastSource.NWS;
  data: NWSForecastDatum[];
};

interface LatLong {
  latitude: number;
  longitude: number;
}

const WeatherReport = ({latitude, longitude}: LatLong) => {

  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [error, setError] = useState<any | null>(null);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const res = await getWeather(`/api/weather?lat=${latitude}&lng=${longitude}`);
        if (res && res.data) {
          setForecast(res.data);
        } else {
          setError('Weather for this location is not available at this time.');
        }
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
    getWeatherData();
  }, [setForecast, latitude, longitude]);

  let output: React.ReactElement<any> | null;
  if (error !== null) {
    output = <>{getFluentString('weather-forecast-network-error')}</>;
  } else if (forecast === null) {
    output = (
      <LoadingContainer>
        <LoadingSpinner
          message={{
            basic: getFluentString('weather-loading-report'),
            medium: getFluentString('weather-loading-report'),
            long: getFluentString('weather-loading-report'),
            extraLong: getFluentString('weather-loading-report'),
          }}
        />
      </LoadingContainer>
    );
  } else if (forecast) {
    if (forecast.source === ForecastSource.NWS && forecast.data && forecast.data.length) {
      output = (
        <NWSForecast
          forecast={forecast.data}
        />
      );
    } else if (forecast.source === ForecastSource.OpenWeatherMap) {
      output = (
        <OpenWeatherForecast
          forecast={forecast.data}
        />
      );
    } else {
      output = <>{getFluentString('weather-forecast-network-error')}</>;
    }
  } else {
    output = null;
  }

  return (
    <>
      <ForecastRootContainer>
        {output}
      </ForecastRootContainer>
    </>
  );
};

export default WeatherReport;
