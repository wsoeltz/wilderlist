import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import Modal from '../../../sharedComponents/Modal';
import { NWSForecastDatum } from './NWSForecast';
import {
  ButtonWrapper,
  CancelButton,
  DetailPrecip,
  DetailTempHigh,
  DetailTempLow,
  ForecastContainer,
  ForecastContent,
  ForecastImg,
  ForecastImgContainer,
  ForecastText,
  ForecastTitle,
} from './Utils';

interface Props {
  onCancel: () => void;
  today: NWSForecastDatum | null;
  tonight: NWSForecastDatum | null;
}

const WeatherDetailNWSModal = (props: Props) => {
  const { onCancel, today, tonight } = props;

  const getString = useFluent();

  const todayPrecip = today !== null && today.precipitation ? (
    <DetailPrecip>
      {today.precipitation}% {getString('weather-forecast-chance-precip')}
    </DetailPrecip>
  ) : null;

  const todayContent = today === null ? null : (
    <ForecastContainer>
      <ForecastTitle>{today.name}</ForecastTitle>
      <ForecastImgContainer>
        <ForecastImg src={today.icon} />
      </ForecastImgContainer>
      <ForecastContent>
        <DetailTempHigh>{getString('weather-forecast-high')} {today.temperature}°F</DetailTempHigh>
        {todayPrecip}
        <ForecastText>{today.detailedForecast}</ForecastText>
      </ForecastContent>
    </ForecastContainer>
  );

  const tonightPrecip = tonight !== null && tonight.precipitation ? (
    <DetailPrecip>
      {tonight.precipitation}% {getString('weather-forecast-chance-precip')}
    </DetailPrecip>
  ) : null;

  const tonightContent = tonight === null ? null : (
    <ForecastContainer>
      <ForecastTitle>{tonight.name}</ForecastTitle>
      <ForecastImgContainer>
        <ForecastImg src={tonight.icon} />
      </ForecastImgContainer>
      <ForecastContent>
        <DetailTempLow>{getString('weather-forecast-low')} {tonight.temperature}°F</DetailTempLow>
        {tonightPrecip}
        <ForecastText>{tonight.detailedForecast}</ForecastText>
      </ForecastContent>
    </ForecastContainer>
  );

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={onCancel} mobileExtend={true}>
        {getString('global-text-value-modal-close')}
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
      {todayContent}
      {tonightContent}
    </Modal>
  );
};

export default WeatherDetailNWSModal;
