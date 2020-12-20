import React, {useState} from 'react';
import useFluent from '../../../../hooks/useFluent';
import {
  AdditionalInfo,
  DetailModalButton,
  ForecastBlock,
  ForecastShort,
  Temperatures,
  TempHigh,
  TempLow,
} from './Utils';
import WeatherDetailNWSModal from './WeatherDetailNWSModal';

export interface NWSForecastDatum {
  detailedForecast: string;
  icon: string;
  isDaytime: boolean;
  name: string;
  number: number;
  shortForecast: string;
  startTime: string;
  temperature: number;
  precipitation: number;
}

interface DetailForecastState {
  today: NWSForecastDatum | null;
  tonight: NWSForecastDatum | null;
}

interface Props {
  forecast: NWSForecastDatum[];
}

const NWSForecast = (props: Props) => {
  const {
    forecast,
  } = props;
  const [weatherDetail, setWeatherDetail] = useState<DetailForecastState | null>(null);

  const getString = useFluent();

  const closeWeatherDetailModal = () => {
    setWeatherDetail(null);
  };

  const weatherDetailModal = weatherDetail === null ? null : (
    <WeatherDetailNWSModal
      onCancel={closeWeatherDetailModal}
      today={weatherDetail.today}
      tonight={weatherDetail.tonight}
    />
  );

  const start = forecast[0].isDaytime === true ? 0 : -1;
  const forecastDays: Array<React.ReactElement<any>> = [];
  let i = start;
  while (i < forecast.length) {
    if (i === -1) {
      const tonight = forecast[i + 1];
      const tonightPrecip = tonight.precipitation ? (
      <AdditionalInfo>
          {tonight.precipitation}% {getString('weather-forecast-chance-precip')}
      </AdditionalInfo>
      ) : null;
      forecastDays.push(
        <ForecastBlock key={tonight.name}>
          <strong>{tonight.name}</strong>
          <ForecastShort>{tonight.shortForecast}</ForecastShort>
          <Temperatures>
            <TempHigh>{getString('weather-forecast-high')} --°F</TempHigh>
            /
            <TempLow>{getString('weather-forecast-low')} {tonight.temperature}°F</TempLow>
          </Temperatures>
          {tonightPrecip}
          <DetailModalButton
            onClick={() => setWeatherDetail({today: null, tonight})}
          >
            {getString('weather-forecast-detailed-report')}
          </DetailModalButton>
        </ForecastBlock>,
      );
    } else {
      const today = forecast[i];
      const tonight = forecast[i + 1];
      if (today && tonight) {
        const todayPrecip = today.precipitation ? (
          <AdditionalInfo>
            {today.precipitation}% {getString('weather-forecast-chance-precip')}
          </AdditionalInfo>
        ) : null;
        forecastDays.push(
          <ForecastBlock key={today.name}>
            <strong>{today.name}</strong>
            <ForecastShort>{today.shortForecast}</ForecastShort>
            <Temperatures>
              <TempHigh>{today.temperature}°F</TempHigh>
              /
              <TempLow>{tonight.temperature}°F</TempLow>
            </Temperatures>
            {todayPrecip}
            <DetailModalButton
              onClick={() => setWeatherDetail({today, tonight})}
            >
              {getString('weather-forecast-detailed-report')}
            </DetailModalButton>
          </ForecastBlock>,
        );
      } else if (today) {
        const todayPrecip = today.precipitation ? (
          <AdditionalInfo>
            {today.precipitation}% {getString('weather-forecast-chance-precip')}
          </AdditionalInfo>
        ) : null;
        forecastDays.push(
          <ForecastBlock key={today.name}>
            <strong>{today.name}</strong>
            <ForecastShort>{today.shortForecast}</ForecastShort>
            <Temperatures>
              <TempHigh>{today.temperature}°F</TempHigh>
              /
              <TempLow>--°F</TempLow>
            </Temperatures>
            {todayPrecip}
            <DetailModalButton
              onClick={() => setWeatherDetail({today, tonight: null})}
            >
              {getString('weather-forecast-detailed-report')}
            </DetailModalButton>
          </ForecastBlock>,
        );
      }
    }
    i = i + 2;
  }

  return (
    <>
      {forecastDays}
      {weatherDetailModal}
    </>
  );

};

export default NWSForecast;
