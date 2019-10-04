import { GetString } from 'fluent-react';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  baseColor,
  ButtonSecondary,
  coolBlueColor,
  lightBaseColor,
  warmRedColor,
} from '../../../styling/styleUtils';
import Modal from '../../sharedComponents/Modal';
import { Forecast } from './WeatherReport';

const ForecastContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: 80px 1fr;
  grid-column-gap: 1rem;
  margin-bottom: 1rem;
`;

const ForecastImgContainer = styled.div`
  margin: auto;
  grid-column: 1;
  grid-row: 2;
`;
const ForecastImg = styled.img`
  max-width: 100%;
`;

const ForecastTitle = styled.h3`
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: ${baseColor};
  grid-column: span 2;
  grid-row: 1;
`;

const ForecastContent = styled.div`
  grid-row: 2;
  grid-column: 2;
`;

const ForecastText = styled.p`
  font-size: 0.8rem;
  margin: 0.45rem 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const TempHigh = styled.div`
  color: ${warmRedColor};
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
`;
const TempLow = styled.div`
  color: ${coolBlueColor};
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
`;

const WindSpeed = styled.div`
  font-size: 0.8rem;
  color: ${lightBaseColor};
`;

interface Props {
  onCancel: () => void;
  today: Forecast | null;
  tonight: Forecast | null;
}

const AreYouSureModal = (props: Props) => {
  const { onCancel, today, tonight } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const todayContent = today === null ? null : (
    <ForecastContainer>
      <ForecastTitle>{today.name}</ForecastTitle>
      <ForecastImgContainer>
        <ForecastImg src={today.icon} />
      </ForecastImgContainer>
      <ForecastContent>
        <TempHigh>{getFluentString('weather-forecast-high')} {today.temperature}°</TempHigh>
        <WindSpeed>{getFluentString('weather-forecast-wind')} {today.windSpeed} {today.windDirection}</WindSpeed>
        <ForecastText>{today.detailedForecast}</ForecastText>
      </ForecastContent>
    </ForecastContainer>
  );

  const tonightContent = tonight === null ? null : (
    <ForecastContainer>
      <ForecastTitle>{tonight.name}</ForecastTitle>
      <ForecastImgContainer>
        <ForecastImg src={tonight.icon} />
      </ForecastImgContainer>
      <ForecastContent>
        <TempLow>{getFluentString('weather-forecast-low')} {tonight.temperature}°</TempLow>
        <WindSpeed>{getFluentString('weather-forecast-wind')} {tonight.windSpeed} {tonight.windDirection}</WindSpeed>
        <ForecastText>{tonight.detailedForecast}</ForecastText>
      </ForecastContent>
    </ForecastContainer>
  );

  return (
    <Modal
      onClose={onCancel}
      width={'400px'}
      height={'auto'}
    >
      {todayContent}
      {tonightContent}
      <ButtonWrapper>
        <CancelButton onClick={onCancel}>
          {getFluentString('global-text-value-modal-close')}
        </CancelButton>
      </ButtonWrapper>
    </Modal>
  );
};

export default AreYouSureModal;
