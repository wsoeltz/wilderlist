import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
import Modal from '../../../sharedComponents/Modal';
import { WeatherReportDatum } from './OpenWeatherForecast';
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
`;

const ForecastContent = styled(ForecastContentBase)`
  grid-column: 1 / -1;
`;

interface Props {
  onCancel: () => void;
  data: WeatherReportDatum;
}

const WeatherDetailNWSModal = (props: Props) => {
  const { onCancel, data: {
    dt, temp, weather, wind_deg, wind_speed, feels_like,
    clouds, dew_point, humidity, uvi,
    rain, snow, wind_gust,
  } } = props;

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

  return (
    <Modal
      onClose={onCancel}
      width={'400px'}
      height={'auto'}
      actions={actions}
    >
      <ForecastContainer>
        <ForecastHeader>
          <ForecastImgContainer>
            <ForecastImg src={`http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`} />
          </ForecastImgContainer>
          <div>
            {getDayAsText(date)},
            {' '}
            {getFluentString('global-formatted-text-date', {
              day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear().toString(),
            })}
          </div>
        </ForecastHeader>
        <ForecastContent>
          <Temperatures>
            <TempHigh>{getFluentString('weather-forecast-high')} {Math.round(temp.max)}°F</TempHigh>
            /
            <TempLow>{getFluentString('weather-forecast-low')} {Math.round(temp.min)}°F</TempLow>
          </Temperatures>
          <Detail>
            {getFluentString('weather-forecast-feels-like')}
            {' '}{Math.round(feels_like.day)}°F/{Math.round(feels_like.night)}°F
          </Detail>
          <Detail>{description}{rainVolume}{snowVolume}</Detail>
          <Detail>
            {getFluentString('weather-forecast-cloud-coverage', {clouds})}
          </Detail>
          <Detail>
            {getFluentString('weather-forecast-wind')} {Math.round(wind_speed)} mph {degToCompass(wind_deg)}
            {' '}
            {windGusts}
          </Detail>
          <Detail>
            {getFluentString('weather-forecast-dewpoint', {dew_point})}
          </Detail>
          <Detail>
            {getFluentString('weather-forecast-humidity', {humidity})}
          </Detail>
          <Detail>
            {getFluentString('weather-forecast-sunrise', {sunrise})}
          </Detail>
          <Detail>
            {getFluentString('weather-forecast-sunset', {sunset})}
          </Detail>
          <Detail>
            {getFluentString('weather-forecast-uvi', {uvi})}
          </Detail>
        </ForecastContent>
      </ForecastContainer>
    </Modal>
  );
};

export default WeatherDetailNWSModal;
