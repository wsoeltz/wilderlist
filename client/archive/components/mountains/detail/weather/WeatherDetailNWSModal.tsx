import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const todayPrecip = today !== null && today.precipitation ? (
    <DetailPrecip>
      {today.precipitation}% {getFluentString('weather-forecast-chance-precip')}
    </DetailPrecip>
  ) : null;

  const todayContent = today === null ? null : (
    <ForecastContainer>
      <ForecastTitle>{today.name}</ForecastTitle>
      <ForecastImgContainer>
        <ForecastImg src={today.icon} />
      </ForecastImgContainer>
      <ForecastContent>
        <DetailTempHigh>{getFluentString('weather-forecast-high')} {today.temperature}°F</DetailTempHigh>
        {todayPrecip}
        <ForecastText>{today.detailedForecast}</ForecastText>
      </ForecastContent>
    </ForecastContainer>
  );

  const tonightPrecip = tonight !== null && tonight.precipitation ? (
    <DetailPrecip>
      {tonight.precipitation}% {getFluentString('weather-forecast-chance-precip')}
    </DetailPrecip>
  ) : null;

  const tonightContent = tonight === null ? null : (
    <ForecastContainer>
      <ForecastTitle>{tonight.name}</ForecastTitle>
      <ForecastImgContainer>
        <ForecastImg src={tonight.icon} />
      </ForecastImgContainer>
      <ForecastContent>
        <DetailTempLow>{getFluentString('weather-forecast-low')} {tonight.temperature}°F</DetailTempLow>
        {tonightPrecip}
        <ForecastText>{tonight.detailedForecast}</ForecastText>
      </ForecastContent>
    </ForecastContainer>
  );

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
      {todayContent}
      {tonightContent}
    </Modal>
  );
};

export default WeatherDetailNWSModal;
