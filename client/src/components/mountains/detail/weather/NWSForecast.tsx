import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
import {
  DetailModalButton,
  ForecastBlock,
  ForecastShort,
  Temperatures,
  TempHigh,
  TempLow,
  WindSpeed,
} from './Utils';
import WeatherDetailNWSModal from './WeatherDetailNWSModal';

export interface NWSForecastDatum {
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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

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
      forecastDays.push(
        <ForecastBlock key={tonight.name}>
          <strong>{tonight.name}</strong>
          <Temperatures>
            <TempHigh>{getFluentString('weather-forecast-high')} --°F</TempHigh>
            /
            <TempLow>{getFluentString('weather-forecast-low')} {tonight.temperature}°F</TempLow>
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
            <ForecastShort>{today.shortForecast}</ForecastShort>
            <Temperatures>
              <TempHigh>{today.temperature}°F</TempHigh>
              /
              <TempLow>{tonight.temperature}°F</TempLow>
            </Temperatures>
            <WindSpeed>{getFluentString('weather-forecast-wind')} {today.windSpeed} {today.windDirection}</WindSpeed>
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
            <ForecastShort>{today.shortForecast}</ForecastShort>
            <Temperatures>
              <TempHigh>{today.temperature}°F</TempHigh>
              /
              <TempLow>--°F</TempLow>
            </Temperatures>
            <WindSpeed>{getFluentString('weather-forecast-wind')} {today.windSpeed} {today.windDirection}</WindSpeed>
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

  return (
    <>
      {forecastDays}
      {weatherDetailModal}
    </>
  );

};

export default NWSForecast;
