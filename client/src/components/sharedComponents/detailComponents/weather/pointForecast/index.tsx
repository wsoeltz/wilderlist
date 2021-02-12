import React, {useEffect, useState} from 'react';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import useFluent from '../../../../../hooks/useFluent';
import {getWeatherAtPointURL} from '../../../../../routing/services';
import getWeather from '../../../../../utilities/getWeather';
import LoadingSpinner from '../../../LoadingSpinner';
import NWSForecast from './NWSForecast';
import OpenWeatherForecast from './OpenWeatherForecast';
import {
  readWeatherCache,
  writeWeatherCache,
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

interface Input extends LatLong {
  valley?: boolean;
}

const WeatherReport = ({latitude, longitude, valley}: Input) => {

  const intialCachedWeather = readWeatherCache(latitude, longitude, Boolean(valley));
  const [forecast, setForecast] = useState<Forecast | null>(intialCachedWeather ? intialCachedWeather.data : null);
  const [error, setError] = useState<any | null>(null);

  const currentUser = useCurrentUser();
  const getString = useFluent();

  useEffect(() => {
    let ignoreResult: boolean = false;
    const getWeatherData = async () => {
      try {
        const url = getWeatherAtPointURL({coord: [longitude, latitude], valley});
        const res = await getWeather(url);
        if (ignoreResult) {
          console.warn('Weather report promise canceled for unmounted component');
          return undefined;
        }
        if (res && res.data) {
          writeWeatherCache(latitude, longitude, Boolean(valley), res.data);
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
      const cachedWeather = readWeatherCache(latitude, longitude, Boolean(valley));
      if (!cachedWeather) {
        getWeatherData();
      } else {
        setForecast(cachedWeather.data);
      }
    }

    return () => {ignoreResult = true; };
  }, [setForecast, latitude, longitude, currentUser, valley]);

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
