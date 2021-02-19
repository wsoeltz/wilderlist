import React, {useCallback, useState} from 'react';
import SunCalc from 'suncalc';
import useFluent from '../../../../../hooks/useFluent';
import {
  CenteredHeader,
  Details,
  HorizontalBlock,
  InlineColumns,
  SimpleTitle,
} from '../../../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  LinkButtonCompact,
  Subtext,
} from '../../../../../styling/styleUtils';
import OpenWeatherDetailModal from './OpenWeatherDetailModal';
import {
  degToCompass,
  ForecastShort,
  formatAMPM,
  getDayAsText,
  getFaIcon,
  Temperatures,
  TempHigh,
  TempLow,
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
  latitude: number;
  longitude: number;
}

const OpenWeatherForecast = (props: Props) => {
  const {forecast: {daily, hourly}, latitude, longitude} = props;

  const [weatherDetail, setWeatherDetail] = useState<WeatherReportDatum | null>(null);
  const closeWeatherDetail = useCallback(() => setWeatherDetail(null), []);

  const hourlyDetails = weatherDetail
    ? hourly.filter((hour) => new Date(hour.dt * 1000 ).getDate() === new Date(weatherDetail.dt * 1000).getDate())
    : [];
  const weatherDetailModal = weatherDetail === null ? null : (
    <OpenWeatherDetailModal
      onCancel={closeWeatherDetail}
      data={weatherDetail}
      hourly={hourlyDetails}
    />
  );

  const getString = useFluent();

  const forecastDays = daily.map(report => {
    const { dt, temp, wind_deg, wind_speed, weather } = report;
    const date = new Date(dt * 1000);
    const dateText = getDayAsText(date);
    const description = weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);
    const onClick = () => setWeatherDetail(report);

    const sunTimes = SunCalc.getTimes(date, latitude, longitude);
    const sunriseStr = formatAMPM(sunTimes.sunrise);
    const sunsetStr = formatAMPM(sunTimes.sunset);
    return (
      <HorizontalBlock key={dt}>
        <CenteredHeader>
          <div>
            <strong>
              <BasicIconInText icon={getFaIcon(weather[0].id)} />
              {dateText}
            </strong>
            <ForecastShort>{description}</ForecastShort>
          </div>
        </CenteredHeader>
        <Temperatures>
          <TempHigh>{Math.round(temp.max)}°F</TempHigh>
          <TempLow>{Math.round(temp.min)}°F</TempLow>
        </Temperatures>
        <InlineColumns>
          <Subtext>
            <SimpleTitle>{getString('weather-forecast-wind')}:</SimpleTitle>
          </Subtext>
          <Subtext>
            {Math.round(wind_speed)} mph {degToCompass(wind_deg)}
          </Subtext>
        </InlineColumns>
        <InlineColumns>
          <Subtext>
            <SimpleTitle>{getString('weather-forecast-sunrise-and-set')}:</SimpleTitle>
          </Subtext>
          <Subtext>
            <strong>↑</strong> {sunriseStr}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <strong>↓</strong> {sunsetStr}
          </Subtext>
        </InlineColumns>
        <Details>
          <LinkButtonCompact onClick={onClick}>
            {getString('weather-forecast-detailed-report')}
          </LinkButtonCompact>
        </Details>
      </HorizontalBlock>
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
