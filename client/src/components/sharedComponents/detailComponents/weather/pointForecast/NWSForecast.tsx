import React, {useState} from 'react';
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
import getIcon from './getIcon';
import {
  ForecastShort,
  formatAMPM,
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
  latitude: number;
  longitude: number;
}

const NWSForecast = (props: Props) => {
  const {
    forecast, latitude, longitude,
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
  const date = new Date();

  const start = forecast[0].isDaytime === true ? 0 : -1;
  const forecastDays: Array<React.ReactElement<any>> = [];
  let i = start;
  while (i < forecast.length) {
    let name: string | undefined;
    let shortForecast: string | undefined;
    let high: string | number | undefined;
    let low: string | number | undefined;
    let precip: number | undefined;
    let onClick: (() => void) | undefined;
    if (i === -1) {
      const tonight = forecast[i + 1];
      name = tonight.name;
      shortForecast = tonight.shortForecast;
      high = '--';
      low = tonight.temperature;
      precip = tonight.precipitation;
      onClick = () => setWeatherDetail({today: null, tonight});
    } else {
      const today = forecast[i];
      const tonight = forecast[i + 1];
      if (today && tonight) {
        name = today.name;
        shortForecast = today.shortForecast;
        high = today.temperature;
        low = tonight.temperature;
        precip = today.precipitation;
        onClick = () => setWeatherDetail({today, tonight});
      } else if (today) {
        name = today.name;
        shortForecast = today.shortForecast;
        high = today.temperature;
        low = '--';
        precip = today.precipitation;
        onClick = () => setWeatherDetail({today, tonight: null});
      }
    }
    if (name !== undefined && shortForecast !== undefined && high !== undefined && low !== undefined &&
        precip !== undefined && onClick !== undefined) {
      const sunTimes = SunCalc.getTimes(date, latitude, longitude);
      // const sunriseStr = sunTimes.sunrise.getHours() + ':' + sunTimes.sunrise.getMinutes();
      // const sunsetStr = sunTimes.sunset.getHours() + ':' + sunTimes.sunset.getMinutes();
      const sunriseStr = formatAMPM(sunTimes.sunrise);
      const sunsetStr = formatAMPM(sunTimes.sunset);

      forecastDays.push(
        <HorizontalBlock key={name}>
          <CenteredHeader>
            <div>
              <strong>
                <BasicIconInText icon={getIcon(shortForecast)} />
                {name}
              </strong>
              <ForecastShort>{shortForecast}</ForecastShort>
            </div>
          </CenteredHeader>
          <Temperatures>
            <TempHigh>{high}°F</TempHigh>
            <TempLow>{low}°F</TempLow>
          </Temperatures>
          <InlineColumns>
            <Subtext>
              <SimpleTitle>precipitation:</SimpleTitle>
            </Subtext>
            <Subtext>
              {precip}% chance
            </Subtext>
          </InlineColumns>
          <InlineColumns>
            <Subtext>
              <SimpleTitle>Sunrise &amp; set:</SimpleTitle>
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
        </HorizontalBlock>,
      );
    }
    date.setDate(date.getDate() + 1);
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
