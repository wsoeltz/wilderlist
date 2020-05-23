import { GetString } from 'fluent-react/compat';
import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  coolBlueColor,
  lightBaseColor,
  lightBorderColor,
  LinkButton,
  warmRedColor,
} from '../../../styling/styleUtils';
import getWeather from '../../../utilities/getWeather';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import WeatherDetailModal from './WeatherDetailModal';

const ForecastContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 129px;
  overflow: auto;
  padding: 0 0 1rem;
  box-sizing: border-box;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    height: 12px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .3);
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, .1);
  }
`;

const ForecastBlock = styled.div`
  flex-shrink: 0;
  font-size: 0.9rem;
  padding-right: 2rem;
  max-width: 150px;
  display: flex;
  flex-direction: column;

  &:not(:first-child) {
    padding-left: 2rem;
  }

  &:not(:last-child) {
    border-right: solid 1px ${lightBorderColor};
  }
`;

const Temperatures = styled.div`
  display: flex;
  margin: 0.4rem 0;
  font-size: 0.8rem;
`;
const TempHigh = styled.div`
  color: ${warmRedColor};
  margin-right: 2px;
`;
const TempLow = styled.div`
  color: ${coolBlueColor};
  margin-left: 2px;
`;
const WindSpeed = styled.div`
  color: ${lightBaseColor};
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
`;
const ForecastShort = styled.div`
  font-size: 0.8rem;
  font-style: italic;
`;

const DetailModalButton = styled(LinkButton)`
  margin-top: auto;
  font-size: 0.8rem;
  padding-top: 0.4rem;
  outline: none;
`;

const LoadingContainer = styled.div`
  height: 5rem;
  width: 100%;
`;

interface LatLong {
  latitude: number;
  longitude: number;
}

export interface Forecast {
  detailedForecast: string;
  endTime: string;
  icon: string;
  isDaytime: boolean;
  name: string;
  number: number;
  shortForecast: string;
  startTime: string;
  temperature: number;
  temperatureTrend: string;
  temperatureUnit: string;
  windDirection: string;
  windSpeed: string;
}

interface DetailForecastState {
  today: Forecast | null;
  tonight: Forecast | null;
}

const WeatherReport = ({latitude, longitude}: LatLong) => {
  const [forecast, setForecast] = useState<Forecast[] | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [weatherDetail, setWeatherDetail] = useState<DetailForecastState | null>(null);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const closeWeatherDetailModal = () => {
    setWeatherDetail(null);
  };

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const res = await getWeather(`/api/weather?lat=${latitude}&lng=${longitude}`);
        if (res && res.data && res.data.length) {
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
    const start = forecast[0].isDaytime === true ? 0 : -1;
    const forecastDays: Array<React.ReactElement<any>> = [];
    let i = start;
    while (i < forecast.length) {
      if (i === -1) {
        const tonight = forecast[i + 1];
        forecastDays.push(
          <ForecastBlock key={tonight.name}>
            <strong>{tonight.name}</strong>
            <Temperatures>
              <TempHigh>{getFluentString('weather-forecast-high')} --°</TempHigh>
              /
              <TempLow>{getFluentString('weather-forecast-low')} {tonight.temperature}°</TempLow>
            </Temperatures>
            <WindSpeed>
              {getFluentString('weather-forecast-wind')} {tonight.windSpeed} {tonight.windDirection}
            </WindSpeed>
            <ForecastShort>{tonight.shortForecast}</ForecastShort>
            <DetailModalButton
              onClick={() => setWeatherDetail({today: null, tonight})}
            >
              {getFluentString('weather-forecast-detailed-report')}
            </DetailModalButton>
          </ForecastBlock>,
        );
      } else {
        const today = forecast[i];
        const tonight = forecast[i + 1];
        if (today && tonight) {
          forecastDays.push(
            <ForecastBlock key={today.name}>
              <strong>{today.name}</strong>
              <Temperatures>
                <TempHigh>{getFluentString('weather-forecast-high')} {today.temperature}°</TempHigh>
                /
                <TempLow>{getFluentString('weather-forecast-low')} {tonight.temperature}°</TempLow>
              </Temperatures>
              <WindSpeed>{getFluentString('weather-forecast-wind')} {today.windSpeed} {today.windDirection}</WindSpeed>
              <ForecastShort>{today.shortForecast}</ForecastShort>
              <DetailModalButton
                onClick={() => setWeatherDetail({today, tonight})}
              >
                {getFluentString('weather-forecast-detailed-report')}
              </DetailModalButton>
            </ForecastBlock>,
          );
        } else if (today) {
          forecastDays.push(
            <ForecastBlock key={today.name}>
              <strong>{today.name}</strong>
              <Temperatures>
                <TempHigh>{getFluentString('weather-forecast-high')} {today.temperature}°</TempHigh>
                /
                <TempLow>{getFluentString('weather-forecast-low')} --°</TempLow>
              </Temperatures>
              <WindSpeed>{getFluentString('weather-forecast-wind')} {today.windSpeed} {today.windDirection}</WindSpeed>
              <ForecastShort>{today.shortForecast}</ForecastShort>
              <DetailModalButton
                onClick={() => setWeatherDetail({today, tonight: null})}
              >
                {getFluentString('weather-forecast-detailed-report')}
              </DetailModalButton>
            </ForecastBlock>,
          );
        }
      }
      i = i + 2;
    }
    output = (
      <>
        {forecastDays}
      </>
    );
  } else {
    output = null;
  }

  const weatherDetailModal = weatherDetail === null ? null : (
    <WeatherDetailModal
      onCancel={closeWeatherDetailModal}
      today={weatherDetail.today}
      tonight={weatherDetail.tonight}
    />
  );

  return (
    <>
      <ForecastContainer>
        {output}
      </ForecastContainer>
      {weatherDetailModal}
    </>
  );
};

export default WeatherReport;
