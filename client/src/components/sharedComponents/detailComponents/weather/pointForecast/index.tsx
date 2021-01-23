import React, {useEffect, useState} from 'react';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import useFluent from '../../../../../hooks/useFluent';
import getWeather from '../../../../../utilities/getWeather';
import LoadingSpinner from '../../..//LoadingSpinner';
import NWSForecast from './NWSForecast';
import OpenWeatherForecast from './OpenWeatherForecast';
import {
  readNWSCache,
  writeNWSCache,
} from './simpleCache';
import {
  Forecast,
  ForecastSource,
} from './types';
import {
  ForecastRootContainer,
  LoadingContainer,
} from './Utils';

interface LatLong {
  latitude: number;
  longitude: number;
}

const WeatherReport = ({latitude, longitude}: LatLong) => {

  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [error, setError] = useState<any | null>(null);

  const currentUser = useCurrentUser();
  const getString = useFluent();

  useEffect(() => {
    let ignoreResult: boolean = false;
    const getWeatherData = async () => {
      try {
        const res = await getWeather(`/api/weather?lat=${latitude}&lng=${longitude}`);
        if (ignoreResult) {
          console.warn('Weather report promise canceled for unmounted component');
          return undefined;
        }
        if (res && res.data) {
          writeNWSCache(latitude, longitude, res.data);
          setForecast(res.data);
        } else {
          setError('Weather for this location is not available at this time.');
        }
      } catch (err) {
        console.error(err);
        if (!ignoreResult) {
          setError(err);
        }
      }
    };
    if (currentUser !== null) {
      const cachedWeather = readNWSCache(latitude, longitude);
      if (!cachedWeather) {
        getWeatherData();
      } else {
        setForecast(cachedWeather.data);
      }
    }

    return () => {ignoreResult = true; };
  }, [setForecast, latitude, longitude, currentUser]);

  let output: React.ReactElement<any> | null;
  if (error !== null) {
    output = <>{getString('weather-forecast-network-error')}</>;
  } else if (forecast === null) {
    output = (
      <LoadingContainer>
        <LoadingSpinner
          message={{
            basic: getString('weather-loading-report'),
            medium: getString('weather-loading-report'),
            long: getString('weather-loading-report'),
            extraLong: getString('weather-loading-report'),
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
      output = <>{getString('weather-forecast-network-error')}</>;
    }
  } else {
    output = null;
  }

  return (
    <>
      <ForecastRootContainer hideScrollbars={false}>
        {output}
      </ForecastRootContainer>
    </>
  );
};

export default WeatherReport;
