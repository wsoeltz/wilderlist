import {
  faCloud,
  faExchangeAlt,
  faThermometerEmpty,
  faTint,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import debounce from 'lodash/debounce';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import SatelliteMapLayerBG from '../../../../../assets/images/satellite-map-layer-icon-bg.jpg';
import StandardMapLayerBG from '../../../../../assets/images/standard-map-layer-icon-bg.jpg';
import useMapContext from '../../../../../hooks/useMapContext';
import {
  lightBaseColor,
  lightBorderColor,
  primaryColor,
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {mobileSize} from '../../../../../Utils';
import {formatAMPM} from '../../../../sharedComponents/detailComponents/weather/pointForecast/Utils';
import {MapStyle} from '../../../globalMap/map';
import {getWeatherState, WeatherOverlay, WeatherState} from '../../../globalMap/map/weather';
import Legend from './Legend';

const Grid = styled.div`
  padding: 0 0.35rem 0.35rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;

  &:not(:last-of-type) {
    border-bottom: solid 1px ${lightBorderColor};
  }

  @media (max-width: ${mobileSize}px) {
    grid-template-columns: unset;
    grid-auto-flow: column;
    grid-auto-columns: 5rem;
    grid-template-rows: auto 1fr auto;
    grid-column-gap: 1rem;
    margin: auto 0;

    &:last-of-type {
      padding-left: 1rem;
    }
    &:not(:last-of-type) {
      border-bottom: none;
      border-right: solid 1px ${lightBorderColor};
      padding-right: 1rem;
    }
  }
`;

const Button = styled.button<{$highlighted: boolean}>`
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  text-transform: uppercase;
  font-size: 0.7rem;
  margin-bottom: 0.4rem;
  outline: none;

  @media (max-width: ${mobileSize}px) {
    grid-row: 2;
  }

  ${({$highlighted}) => $highlighted ? `
    color: ${primaryColor};
    font-weight: 700;

    div {
      border-color: ${primaryColor};
    }
  ` : ''}
`;

const Thumnbail = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 2.75rem;
  border: solid 3px transparent;
  border-radius: 8px;
  background-position: center;
  background-size: cover;
  margin-bottom: 0.25rem;

  @media (max-width: ${mobileSize}px) {
    height: 4rem;
  }
`;

const IconThumbnail = styled(Thumnbail)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${lightBaseColor};
  height: 2.25rem;
  background-color: ${tertiaryColor};
  border-color: ${lightBorderColor};

  @media (max-width: ${mobileSize}px) {
    height: 4rem;
  }
`;

const Title = styled.div`
  grid-column: 1 / 3;
  grid-row: 1;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  font-weight: 600;

  @media (max-width: ${mobileSize}px) {
    padding-top: 0.25rem;
  }
`;

const DateSliderContainer = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1rem;
  padding: 0.35rem;
  width: 140px;
  background-color: #fff;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  input[type="range"] {
   -webkit-appearance: none;
  }

  input[type="range"]:focus {
   outline: none;
  }

  input[type="range"]::-webkit-slider-runnable-track {
   background: ${lightBorderColor};
   height: 5px;
  }

  input[type="range"]::-moz-range-track {
   background: ${lightBorderColor};
   height: 5px;
  }

  input[type="range"]::-webkit-slider-thumb {
   -webkit-appearance: none;
   height: 15px;
   width: 15px;
   background: ${primaryColor};
   margin-top: -5px;
   border-radius: 50%;
  }

  input[type="range"]::-moz-range-thumb {
   height: 15px;
   width: 15px;
   background: ${primaryColor};
   margin-top: -5px;
   border-radius: 50%;
  }


  @media (max-width: ${mobileSize}px) {
    position: sticky;
    bottom: unset;
    left: 0;
    width: 100%;
    grid-row: 3;
    grid-column: 1 /3;
  }
`;

const DateText = styled.div`
  font-size: 0.875rem;
  text-transform: uppercase;
  font-weight: 600;
`;

interface Props {
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
}

const MapLayers = ({mapStyle, setMapStyle}: Props) => {
  const [mapWeather, setMapWeather] = useState<WeatherState | null>(getWeatherState());
  const mapContext = useMapContext();

  const setToStandardStyle = () => {
    if (mapContext.intialized) {
      mapContext.setBaseMap(MapStyle.standard);
      setMapStyle(MapStyle.standard);
    }
  };

  const setToSatelliteStyle = () => {
    if (mapContext.intialized) {
      mapContext.setBaseMap(MapStyle.satellite);
      setMapStyle(MapStyle.satellite);
    }
  };

  const setWeather = async (value: WeatherOverlay | null) => {
    if (mapContext.intialized) {
      const newWeatherState = await mapContext.setWeatherOverlay(value);
      setMapWeather(newWeatherState);
    }
  };

  const timeOptions = mapWeather && mapWeather.allTimes ? mapWeather.allTimes.map(t => (
    <option
      key={t.toString()}
      value={t.toString()}
      defaultValue={mapWeather.activeTime.toString()}
    >
      {t.toString()}
    </option>
  )) : [];

  const onSlideChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    if (mapWeather && mapWeather.setTime) {
      const newMapWeather = mapWeather.setTime(mapWeather.allTimes[parseInt(e.target.value, 10)]);
      if (newMapWeather) {
        setMapWeather({...newMapWeather});
      } else {
        setMapWeather(null);
      }
    }
  }, 250);
  const indexOfTime = mapWeather
    ? mapWeather.allTimes.findIndex(t => t.toString() === mapWeather.activeTime.toString())
    : 0;
  const dateSlider = timeOptions.length > 1 ? (
    <>
      <input
        type='range'
        min='0'
        max={timeOptions.length - 1}
        step='1'
        list='weather-time-options'
        onChange={onSlideChange}
        defaultValue={indexOfTime !== -1 ? indexOfTime.toString() : '0'}
      />
      <datalist id='weather-time-options'>
        {timeOptions}
      </datalist>
    </>
  ) : null;
  const timeSelect = mapWeather
    ? (
      <DateSliderContainer>
        <DateText>
          {formatAMPM(mapWeather.activeTime)}
        </DateText>
        {dateSlider}
        <Legend weatherType={mapWeather.type} />
      </DateSliderContainer>
    ) : null;

  return (
    <>
      <Grid>
        <Title>Base Maps</Title>
        <Button
          $highlighted={mapStyle === MapStyle.standard}
          onClick={setToStandardStyle}
        >
          <Thumnbail style={{backgroundImage: `url("${StandardMapLayerBG}")`}} />
          {'Standard'}
        </Button>
        <Button
          $highlighted={mapStyle === MapStyle.satellite}
          onClick={setToSatelliteStyle}
        >
          <Thumnbail style={{backgroundImage: `url("${SatelliteMapLayerBG}")`}} />
          {'Satellite'}
        </Button>
      </Grid>
      <Grid>
        <Title>Weather Overlays</Title>
        <Button
          $highlighted={!mapWeather}
          onClick={() => setWeather(null)}
        >
          <IconThumbnail />
          {'None'}
        </Button>
        <Button
          $highlighted={Boolean(mapWeather && mapWeather.type === WeatherOverlay.precipitation)}
          onClick={() => setWeather(WeatherOverlay.precipitation)}
        >
          <IconThumbnail>
            <FontAwesomeIcon icon={faTint} />
          </IconThumbnail>
          {'Precip.'}
        </Button>
        <Button
          $highlighted={Boolean(mapWeather && mapWeather.type === WeatherOverlay.pressure)}
          onClick={() => setWeather(WeatherOverlay.pressure)}
        >
          <IconThumbnail>
            <FontAwesomeIcon icon={faExchangeAlt} />
          </IconThumbnail>
          {'Pressure'}
        </Button>
        <Button
          $highlighted={Boolean(mapWeather && mapWeather.type === WeatherOverlay.temp)}
          onClick={() => setWeather(WeatherOverlay.temp)}
        >
          <IconThumbnail>
            <FontAwesomeIcon icon={faThermometerEmpty} />
          </IconThumbnail>
          {'Temp.'}
        </Button>
        <Button
          $highlighted={Boolean(mapWeather && mapWeather.type === WeatherOverlay.wind)}
          onClick={() => setWeather(WeatherOverlay.wind)}
        >
          <IconThumbnail>
            <FontAwesomeIcon icon={faWind} />
          </IconThumbnail>
          {'Wind'}
        </Button>
        <Button
          $highlighted={Boolean(mapWeather && mapWeather.type === WeatherOverlay.clouds)}
          onClick={() => setWeather(WeatherOverlay.clouds)}
        >
          <IconThumbnail>
            <FontAwesomeIcon icon={faCloud} />
          </IconThumbnail>
          {'Clouds'}
        </Button>
        {timeSelect}
      </Grid>
    </>
  );
};

export default MapLayers;
