import {
  faBolt,
  faCloud,
  faCloudRain,
  faCloudShowersHeavy,
  faCloudSun,
  faSmog,
  faSnowflake,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/macro';
import {
  baseColor,
  ButtonSecondary,
  coolBlueColor,
  lightBaseColor,
  lightBorderColor,
  LinkButton,
  warmRedColor,
} from '../../../../styling/styleUtils';
import {mobileWidth} from '../../../sharedComponents/Modal';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getDayAsText = (date: Date) => new Date().getDate() === date.getDate() ? 'Today' : days[date.getDay()];

export function degToCompass(num: number) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[(val % 16)];
}

export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const getFaIcon = (id: number) => {
  if (id >= 200 && id < 300) {
    return faBolt;
  }
  if (id >= 300 && id < 400) {
    return faCloudRain;
  }
  if (id >= 500 && id < 600) {
    return faCloudShowersHeavy;
  }
  if (id >= 600 && id < 700) {
    return faSnowflake;
  }
  if (id >= 700 && id < 800) {
    return faSmog;
  }
  if (id === 800) {
    return faSun;
  }
  if (id === 801 || id === 802) {
    return faCloudSun;
  }
  if (id === 803 || id === 804) {
    return faCloud;
  }
  return faCloudSun;
};

export const ForecastBlock = styled.div`
  flex-shrink: 0;
  font-size: 0.9rem;
  padding-right: 2rem;
  max-width: 150px;
  display: flex;
  flex-direction: column;

  &:not(:first-child) {
    padding-left: 2rem;
  }

  &:not(:last-child) {
    border-right: solid 1px ${lightBorderColor};
  }
`;

export const Temperatures = styled.div`
  display: flex;
  margin: 0.4rem 0;
  align-items: flex-end;
`;
export const TempHigh = styled.div`
  color: ${warmRedColor};
  margin-right: 2px;
  font-size: 1.1rem;
`;
export const TempLow = styled.div`
  color: ${coolBlueColor};
  margin-left: 2px;
  font-size: 0.8rem;
`;
export const WindSpeed = styled.div`
  color: ${lightBaseColor};
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
`;
export const ForecastShort = styled.div`
  margin-top: 0.4rem;
  font-size: 0.8rem;
  font-style: italic;
  color: ${lightBaseColor};
`;

export const DetailModalButton = styled(LinkButton)`
  margin-top: auto;
  font-size: 0.8rem;
  padding-top: 0.4rem;
  outline: none;
`;

export const ForecastContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: 80px 1fr;
  grid-column-gap: 1rem;
  margin-bottom: 1rem;
`;

export const ForecastImgContainer = styled.div`
  margin: auto;
  grid-column: 1;
  grid-row: 2;
`;
export const ForecastImg = styled.img`
  max-width: 100%;
`;

export const ForecastTitle = styled.h3`
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: ${baseColor};
  grid-column: span 2;
  grid-row: 1;
`;

export const ForecastContent = styled.div`
  grid-row: 2;
  grid-column: 2;
`;

export const ForecastText = styled.p`
  font-size: 0.8rem;
  margin: 0.45rem 0;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;

  @media (max-width: ${mobileWidth}px) {
    margin-right: 0;
  }
`;

export const DetailTempHigh = styled.div`
  color: ${warmRedColor};
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
`;
export const DetailTempLow = styled.div`
  color: ${coolBlueColor};
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
`;

export const Detail = styled.div`
  font-size: 0.8rem;
  margin: 0.5rem 0;
`;

export const DetailWindSpeed = styled.div`
  font-size: 0.8rem;
  color: ${lightBaseColor};
`;
