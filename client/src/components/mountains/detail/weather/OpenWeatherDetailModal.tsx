import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
import {
  DetailBoxTitle,
  DetailBoxWithMargin,
  lightBorderColor,

} from '../../../../styling/styleUtils';
import Modal from '../../../sharedComponents/Modal';
import { WeatherDetailDatum, WeatherReportDatum } from './OpenWeatherForecast';
import {
  ButtonWrapper,
  CancelButton,
  degToCompass,
  Detail,
  ForecastContainer,
  ForecastContent as ForecastContentBase,
  ForecastImg,
  ForecastImgContainer as ForecastImgContainerBase,
  ForecastTitle,
  formatAMPM,
  getDayAsText,
  Temperatures,
  TempHigh,
  TempLow,
} from './Utils';

const ForecastHeader = styled(ForecastTitle)`
  display: flex;
  align-items: center;
`;

const ForecastImgContainer = styled(ForecastImgContainerBase)`
  width: 80px;
  height: 80px;
  margin-right: 1rem;
  margin-left: 0;
`;

const ForecastContent = styled(ForecastContentBase)`
  grid-column: 1 / -1;
  width: 400px;
  max-width: 100%;
`;

const Hr = styled.hr`
  border-bottom: none;
  border-top: solid 1px ${lightBorderColor};
`;

interface Props {
  onCancel: () => void;
  data: WeatherReportDatum;
  hourly: WeatherDetailDatum[];
}

const WeatherDetailNWSModal = (props: Props) => {
  const { onCancel, data: {
    dt, temp, weather, wind_deg, wind_speed, feels_like,
    clouds, dew_point, humidity, uvi,
    rain, snow, wind_gust,
  }, hourly } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const date = new Date(dt * 1000);
  const description = weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);
  const windGusts = wind_gust !== undefined ? ', ' + getFluentString('weather-forecast-wind-gust', {wind_gust}) : null;
  const rainVolume = rain !== undefined ? ', ' + getFluentString('weather-forecast-rain-volume', {rain}) : null;
  const snowVolume = snow !== undefined ? ', ' + getFluentString('weather-forecast-snow-volume', {snow}) : null;

  const sunrise = formatAMPM(new Date(props.data.sunrise * 1000));
  const sunset = formatAMPM(new Date(props.data.sunset * 1000));

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={onCancel} mobileExtend={true}>
        {getFluentString('global-text-value-modal-close')}
      </CancelButton>
    </ButtonWrapper>
  );

  const hourSections = hourly.map(report => {
    const hour = formatAMPM(new Date(report.dt * 1000));
    const hourlyDescription =
      report.weather[0].description.charAt(0).toUpperCase() + report.weather[0].description.slice(1);

    const hourlyWindGusts = report.wind_gust !== undefined
      ? ', ' + getFluentString('weather-forecast-wind-gust', {wind_gust: report.wind_gust}) : null;
    const hourlyRainVolume = report.rain !== undefined
      ? ', ' + getFluentString('weather-forecast-rain-volume', {rain: report.rain['1h']}) : null;
    const hourlySnowVolume = report.snow !== undefined
      ? ', ' + getFluentString('weather-forecast-snow-volume', {snow: report.snow['1h']}) : null;
    return (
      <React.Fragment key={report.dt}>
        <Detail>
          <strong>{hour}</strong>
        </Detail>
        <Detail>
          {getFluentString('weather-forecast-temperature')}:{' '}{Math.round(report.temp)}°F
        </Detail>
        <Detail>
          {getFluentString('weather-forecast-feels-like')}{' '}{Math.round(report.feels_like)}°F
        </Detail>
        <Detail>{hourlyDescription}{hourlyRainVolume}{hourlySnowVolume}</Detail>
        <Detail>
          {getFluentString('weather-forecast-cloud-coverage', {clouds})}
        </Detail>
        <Detail>
          {getFluentString('weather-forecast-wind')} {Math.round(report.wind_speed)} mph
          {' '}
          {degToCompass(report.wind_deg)}
          {' '}
          {hourlyWindGusts}
        </Detail>
          <Hr />
      </React.Fragment>
    );
  });

  const details = hourly.length ? (
    <>
      <DetailBoxTitle>{getFluentString('weather-forecast-hourly')}</DetailBoxTitle>
      <DetailBoxWithMargin>
        {hourSections}
      </DetailBoxWithMargin>
    </>
  ) : null;

  return (
    <Modal
      onClose={onCancel}
      width={'400px'}
      height={'500px'}
      actions={actions}
    >
      <ForecastContainer>
        <ForecastHeader>
          <ForecastImgContainer>
            <ForecastImg src={require(`./icons/${weather[0].id}.svg`).default} />
          </ForecastImgContainer>
          <div>
            {getDayAsText(date)},
            {' '}
            {getFluentString('global-formatted-text-date', {
              day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear().toString(),
            })}
            <Temperatures>
              <TempHigh>{getFluentString('weather-forecast-high')} {Math.round(temp.max)}°F</TempHigh>
              /
              <TempLow>{getFluentString('weather-forecast-low')} {Math.round(temp.min)}°F</TempLow>
            </Temperatures>
            <Detail>
              {getFluentString('weather-forecast-feels-like')}
              {' '}{Math.round(feels_like.day)}°F/{Math.round(feels_like.night)}°F
            </Detail>
          </div>
        </ForecastHeader>
        <ForecastContent>
          <DetailBoxTitle>Overview</DetailBoxTitle>
          <DetailBoxWithMargin>
            <Detail>{description}{rainVolume}{snowVolume}</Detail>
            <Detail>
              {getFluentString('weather-forecast-cloud-coverage', {clouds})}
            </Detail>
            <Detail>
              {getFluentString('weather-forecast-wind')} {Math.round(wind_speed)} mph {degToCompass(wind_deg)}
              {' '}
              {windGusts}
            </Detail>
            <Hr />
            <Detail>
              {getFluentString('weather-forecast-dewpoint', {dew_point})}
            </Detail>
            <Detail>
              {getFluentString('weather-forecast-humidity', {humidity})}
            </Detail>
            <Detail>
              {getFluentString('weather-forecast-uvi', {uvi})}
            </Detail>
            <Hr />
            <Detail>
              {getFluentString('weather-forecast-sunrise', {sunrise})}
            </Detail>
            <Detail>
              {getFluentString('weather-forecast-sunset', {sunset})}
            </Detail>
          </DetailBoxWithMargin>
         {details}
        </ForecastContent>
      </ForecastContainer>
    </Modal>
  );
};

export default WeatherDetailNWSModal;
