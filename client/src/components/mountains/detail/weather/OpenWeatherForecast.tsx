import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
} from '../../../../styling/styleUtils';
import OpenWeatherDetailModal from './OpenWeatherDetailModal';
import {
  degToCompass,
  DetailModalButton,
  ForecastBlock,
  ForecastShort,
  getDayAsText,
  getFaIcon,
  Temperatures,
  TempHigh,
  TempLow,
  WindSpeed,
} from './Utils';

export interface WeatherReportDatum {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: {
    day: number,
    eve: number,
    morn: number,
    night: number,
  };
  humidity: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number,
    eve: number,
    max: number,
    min: number,
    morn: number,
    night: number,
  };
  uvi: number;
  weather: Array<{
    description: string,
    icon: string,
    id: number,
    main: string,
  }>;
  wind_deg: number;
  wind_speed: number;
  wind_gust?: number;
  rain?: number;
  snow?: number;
}

export interface WeatherDetailDatum {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  temp: number;
  weather: Array<{
    description: string,
    icon: string,
    id: number,
    main: string,
  }>;
  wind_deg: number;
  wind_speed: number;
  wind_gust?: number;
  rain?: {'1h': number};
  snow?: {'1h': number};
}

export interface OpenWeatherForecastDatum {
  daily: WeatherReportDatum[];
  hourly: WeatherDetailDatum[];
}

interface Props {
  forecast: OpenWeatherForecastDatum;
}

const OpenWeatherForecast = (props: Props) => {
  const {forecast: {daily, hourly}} = props;

  const [weatherDetail, setWeatherDetail] = useState<WeatherReportDatum | null>(null);

  const hourlyDetails = weatherDetail
    ? hourly.filter((hour) => new Date(hour.dt * 1000 ).getDate() === new Date(weatherDetail.dt * 1000).getDate())
    : [];
  const weatherDetailModal = weatherDetail === null ? null : (
    <OpenWeatherDetailModal
      onCancel={() => setWeatherDetail(null)}
      data={weatherDetail}
      hourly={hourlyDetails}
    />
  );

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const forecastDays = daily.map(report => {
    const { dt, temp, wind_deg, wind_speed, weather } = report;
    const date = new Date(dt * 1000);
    const dateText = getDayAsText(date);
    const description = weather[0].main.charAt(0).toUpperCase() + weather[0].main.slice(1);
    return (
      <ForecastBlock key={dt}>
        <strong>{dateText}</strong>
        <ForecastShort>
          <BasicIconInText icon={getFaIcon(weather[0].id)} />
          {description}
        </ForecastShort>
        <Temperatures>
          <TempHigh>{Math.round(temp.max)}°F</TempHigh>
          /
          <TempLow>{Math.round(temp.min)}°F</TempLow>
        </Temperatures>
        <WindSpeed>
          {getFluentString('weather-forecast-wind')} {Math.round(wind_speed)} mph {degToCompass(wind_deg)}
        </WindSpeed>
        <DetailModalButton
          onClick={() => setWeatherDetail(report)}
        >
          {getFluentString('weather-forecast-detailed-report')}
        </DetailModalButton>
      </ForecastBlock>
    );
  });

  return (
     <>
       {forecastDays}
       {weatherDetailModal}
     </>
  );
};

export default OpenWeatherForecast;
