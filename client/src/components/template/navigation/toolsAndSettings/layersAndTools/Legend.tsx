import {
  faCloudShowersHeavy,
  faSnowflake,
  faTint,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {
  SimpleTitle,
} from '../../../../../styling/sharedContentStyles';
import {BasicIconInTextCompact} from '../../../../../styling/styleUtils';
import {
  Subtext,
} from '../../../../../styling/styleUtils';
import {WeatherOverlay} from '../../../globalMap/map/weather';

const Bar = styled.div`
  width: 100%;
  height: 0.75rem;
  margin: 0.3rem 0 0.64rem;
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
  }
  return null;

};

export default Legend;
