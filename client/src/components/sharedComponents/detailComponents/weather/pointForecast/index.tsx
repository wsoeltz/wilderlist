import React, {useEffect, useState} from 'react';
import useFluent from '../../../../../hooks/useFluent';
import {getWeatherAtPointURL} from '../../../../../routing/services';
import {
  CenteredHeader,
  EmptyBlock,
  HorizontalScrollContainer,
} from '../../../../../styling/sharedContentStyles';
import getWeather from '../../../../../utilities/getWeather';
import LoadingSimple from '../../../LoadingSimple';
import NWSForecast from './NWSForecast';
import OpenWeatherForecast from './OpenWeatherForecast';
import {
  isUrlQueued,
  pushUrlToQueue,
  readWeatherCache,
  removeUrlFromQueue,
  writeWeatherCache,
} from './simpleCache';
import {
  Forecast,
  ForecastSource,
} from './types';

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

  const getString = useFluent();

  useEffect(() => {
    let ignoreResult: boolean = false;
    let attempts = 0;
    const getWeatherData = async () => {
      const cachedWeather = readWeatherCache(latitude, longitude, Boolean(valley));
      if (!cachedWeather) {

        const url = getWeatherAtPointURL({coord: [longitude, latitude], valley});
        if (!isUrlQueued(url) || attempts > 100) {
          pushUrlToQueue(url);
          try {
            const res = await getWeather(url);
            if (res && res.data) {
              writeWeatherCache(latitude, longitude, Boolean(valley), res.data);
              removeUrlFromQueue(url);
              if (ignoreResult) {
                console.warn('Weather report promise canceled for unmounted component');
                return undefined;
              }
              setForecast(res.data);
            } else {
              setError('Weather for this location is not available at this time.');
            }
          } catch (err) {
            removeUrlFromQueue(url);
            console.error(err);
            if (!ignoreResult) {
              setError(err);
            }
          }
        } else {
          attempts++;
          setTimeout(getWeatherData, 100);
        }
      } else {
        setForecast(cachedWeather.data);
      }
    };
    getWeatherData();

    return () => {ignoreResult = true; };
  }, [setForecast, latitude, longitude, valley]);

  let output: React.ReactElement<any> | null;
  if (error !== null) {
    output = <>{getString('weather-forecast-network-error')}</>;
  } else if (forecast === null) {
    output = (
      <EmptyBlock>
        <CenteredHeader>
          <LoadingSimple />
          {getString('weather-loading-report')}...
        </CenteredHeader>
      </EmptyBlock>
    );
  } else if (forecast) {
    if (forecast.source === ForecastSource.NWS && forecast.data && forecast.data.length) {
      output = (
        <NWSForecast
          latitude={latitude}
          longitude={longitude}
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
      output = (
        <EmptyBlock>
          <CenteredHeader>
            {getString('weather-forecast-network-error')}
          </CenteredHeader>
        </EmptyBlock>
      );
    }
  } else {
    output = null;
  }

  return (
    <>
      <HorizontalScrollContainer hideScrollbars={false}>
        {output}
      </HorizontalScrollContainer>
    </>
  );
};

export default WeatherReport;
