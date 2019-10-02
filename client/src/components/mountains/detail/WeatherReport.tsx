import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
  coolBlueColor,
  lightBaseColor,
  lightBorderColor,
  LinkButton,
  warmRedColor,
} from '../../../styling/styleUtils';
import getWeather from '../../../utilities/getWeather';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import {
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';
import WeatherDetailModal from './WeatherDetailModal';

const ForecastContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 70px;
  overflow: auto;
  padding: 1rem 0;

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
  today: Forecast;
  tonight: Forecast;
}

const WeatherReport = ({latitude, longitude}: LatLong) => {
  const [forecast, setForecast] = useState<Forecast[] | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [weatherDetail, setWeatherDetail] = useState<DetailForecastState | null>(null);

  const closeWeatherDetailModal = () => {
    setWeatherDetail(null);
  };

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const res = await getWeather(`https://api.weather.gov/points/${latitude},${longitude}`);
        if (res && res.data && res.data.properties && res.data.properties.forecast) {
          const forecastData = await getWeather(res.data.properties.forecast);
          if (forecastData && forecastData.data && forecastData.data.properties
            && forecastData.data.properties.periods) {
            setForecast(forecastData.data.properties.periods);
          } else {
            setError('There was an error getting the forecast');
          }
        } else {
          setError('There was an error getting the location response');
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
    output = <>There was a network error retrieving weather data. Please try again later.</>;
  } else if (forecast === null) {
    output = <LoadingSpinner />;
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
              <TempHigh>High --°</TempHigh>
              /
              <TempLow>Low {tonight.temperature}°</TempLow>
            </Temperatures>
            <WindSpeed>Wind {tonight.windSpeed} {tonight.windDirection}</WindSpeed>
            <ForecastShort>{tonight.shortForecast}</ForecastShort>
            <DetailModalButton
              onClick={() => setWeatherDetail({today: tonight, tonight})}
            >
              Detailed report
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
                <TempHigh>High {today.temperature}°</TempHigh>
                /
                <TempLow>Low {tonight.temperature}°</TempLow>
              </Temperatures>
              <WindSpeed>Wind {today.windSpeed} {today.windDirection}</WindSpeed>
              <ForecastShort>{today.shortForecast}</ForecastShort>
              <DetailModalButton
                onClick={() => setWeatherDetail({today, tonight})}
              >
                Detailed report
              </DetailModalButton>
            </ForecastBlock>,
          );
        } else if (today) {
          forecastDays.push(
            <ForecastBlock key={today.name}>
              <strong>{today.name}</strong>
              <Temperatures>
                <TempHigh>High {today.temperature}°</TempHigh>
                /
                <TempLow>Low --°</TempLow>
              </Temperatures>
              <WindSpeed>Wind {today.windSpeed} {today.windDirection}</WindSpeed>
              <ForecastShort>{today.shortForecast}</ForecastShort>
              <DetailModalButton
                onClick={() => setWeatherDetail({today, tonight})}
              >
                Detailed report
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
    <VerticalContentItem>
      <ItemTitle>
        Weather
      </ItemTitle>
      <ForecastContainer>
        {output}
      </ForecastContainer>
      {weatherDetailModal}
    </VerticalContentItem>
  );
};

export default WeatherReport;
