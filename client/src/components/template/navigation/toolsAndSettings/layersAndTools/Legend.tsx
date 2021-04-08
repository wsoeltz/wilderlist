import {
  faCloud,
  faCloudShowersHeavy,
  faExchangeAlt,
  faSnowflake,
  faThermometerEmpty,
  faTint,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {
  SimpleTitle,
} from '../../../../../styling/sharedContentStyles';
import {BasicIconInTextCompact} from '../../../../../styling/styleUtils';
import {
  lightBorderColor,
  Subtext,
} from '../../../../../styling/styleUtils';
import {WeatherOverlay} from '../../../globalMap/map/weather';

const Bar = styled.div`
  width: 100%;
  height: 0.75rem;
  margin: 0.3rem 0 0.64rem;
  border-radius: 400px;
  border: solid 1px ${lightBorderColor};
`;

interface Props {
  weatherType: WeatherOverlay;
}

const Legend = ({weatherType}: Props) => {
  if (weatherType === WeatherOverlay.precipitation) {
    return (
      <>
        <SimpleTitle>
          <Subtext>
            <BasicIconInTextCompact icon={faTint} />
            Rain
          </Subtext>
        </SimpleTitle>
        <Bar
          style={{
            background: `linear-gradient(90deg,
                rgba(255,255,255,1) 0%,
                rgba(180,255,185,1) 1.02%,
                rgba(0,244,47,1) 14.43%,
                rgba(5,177,24,1) 21.03%,
                rgba(0,112,0,1) 43.04%,
                rgba(255,236,0,1) 49.92%,
                rgba(240,133,0,1) 64.06%,
                rgba(228,0,0,1) 71.03%,
                rgba(104,0,6,1) 78.27%,
                rgba(20,20,20,1) 85.55%,
                rgba(167,167,167,1) 100%)`,
          }}
        />
        <SimpleTitle>
          <Subtext>
            <BasicIconInTextCompact icon={faCloudShowersHeavy} />
            Mixed
          </Subtext>
        </SimpleTitle>
        <Bar
          style={{
            background: `linear-gradient(90deg,
              rgba(254,205,219,1) 0%,
              rgba(255,241,245,1) .93%,
              rgba(255,205,219,1) 7.76%,
              rgba(255,141,176,1) 14.83%,
              rgba(238,74,167,1) 35.94%,
              rgba(206,0,184,1) 42.91%,
              rgba(132,0,178,1) 56.72%,
              rgba(82,0,102,1) 78.27%,
              rgba(246,225,255,1) 100%)`,
          }}
        />
        <SimpleTitle>
          <Subtext>
            <BasicIconInTextCompact icon={faSnowflake} />
            Snow
          </Subtext>
        </SimpleTitle>
        <Bar
          style={{
            background: `linear-gradient(90deg,
              rgba(96,209,254,1) 0%,
              rgba(204,255,255,1) .93%,
              rgba(115,232,255,1) 7.76%,
              rgba(21,171,254,1) 14.83%,
              rgba(24,111,254,1) 35.94%,
              rgba(0,60,213,1) 42.91%,
              rgba(0,44,125,1) 56.72%)`,
          }}
        />
      </>
    );
  } else if (weatherType === WeatherOverlay.pressure) {
    return (
      <>
        <SimpleTitle>
          <Subtext>
            <BasicIconInTextCompact icon={faExchangeAlt} />
            Pressure
          </Subtext>
        </SimpleTitle>
        <Bar
          style={{
            background: `linear-gradient(90deg,
              rgba(0,115,255,0.5) 0%,
              rgba(0,170,255,0.5) 12.5%,
              rgba(75,208,214,0.5) 25%,
              rgba(141,231,199,0.5) 37.5%,
              rgba(176,247,32,0.5) 50%,
              rgba(240,184,0,0.5) 62.5%,
              rgba(251,85,21,0.5) 75%,
              rgba(243,54,59,0.5) 87.5%,
              rgba(198,0,0,0.5) 100%)`,
          }}
        />
      </>
    );
  } else if (weatherType === WeatherOverlay.temp) {
    return (
      <>
        <SimpleTitle>
          <Subtext>
            <BasicIconInTextCompact icon={faThermometerEmpty} />
            Temperature
          </Subtext>
        </SimpleTitle>
        <Bar
          style={{
            background: `linear-gradient(90deg,
              rgba(130, 22, 146, 0.5) 0%,
              rgba(130, 22, 146, 0.5) 9%,
              rgba(130, 22, 146, 0.5) 18%,
              rgba(130, 22, 146, 0.5) 27%,
              rgba(130, 87, 219, 0.5) 36%,
              rgba(32, 140, 236, 0.5) 45%,
              rgba(32, 196, 232, 0.5) 54%,
              rgba(35, 221, 221, 0.5) 63%,
              rgba(194, 255, 40, 0.5) 72%,
              rgba(255, 240, 40, 0.5) 81%,
              rgba(255, 194, 40,0.5) 90%,
              rgba(252, 128, 20, 0.5) 100%)`,
          }}
        />
      </>
    );
  } else if (weatherType === WeatherOverlay.wind) {
    return (
      <>
        <SimpleTitle>
          <Subtext>
            <BasicIconInTextCompact icon={faWind} />
            Wind Speed
          </Subtext>
        </SimpleTitle>
        <Bar
          style={{
            background: `linear-gradient(90deg,
              rgba(255,255,255, 0) 0%,
              rgba(238,206,206, 0.4) 16%,
              rgba(179,100,188, 0.7) 32%,
              rgba(63,33,59, 0.8) 48%,
              rgba(116,76,172, 0.9) 64%,
              rgba(70,0,175,1) 80%,
              rgba(13,17,38,1) 100%)`,
          }}
        />
      </>
    );
  } else if (weatherType === WeatherOverlay.clouds) {
    return (
      <>
        <SimpleTitle>
          <Subtext>
            <BasicIconInTextCompact icon={faCloud} />
            Wind Speed
          </Subtext>
        </SimpleTitle>
        <Bar
          style={{
            background: `linear-gradient(90deg,
              rgba(255, 255, 255, 0.0) 0%,
              rgba(253, 253, 255, 0.1) 10%,
              rgba(252, 251, 255, 0.2) 20%,
              rgba(250, 250, 255, 0.3) 30%,
              rgba(249, 248, 255, 0.4) 40%,
              rgba(247, 247, 255, 0.5) 50%,
              rgba(246, 245, 255, 0.75) 60%,
              rgba(244, 244, 255, 1) 70%,
              rgba(243, 242, 255, 1) 80%,
              rgba(242, 241, 255, 1) 90%,
              rgba(240, 240, 255, 1) 100%)`,
          }}
        />
      </>
    );
  }
  return null;

};

export default Legend;
