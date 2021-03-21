import {
  faCar,
  faCloudSun,
  faCrosshairs,
} from '@fortawesome/free-solid-svg-icons';
import {rgba} from 'polished';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useMapContext from '../../../../../hooks/useMapContext';
import {
  BasicIconInText,
  lightBaseColor,
  lightBorderColor,
  primaryColor,
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {Coordinate} from '../../../../../types/graphQLTypes';
import {mobileSize} from '../../../../../Utils';
import WeatherModal from '../../../../sharedComponents/detailComponents/weather/WeatherModal';
import DrivingDirectionsModal from './toolModals/DrivingDirections';
import PointInfoModal from './toolModals/PointInfo';

const Root = styled.div`
  padding: 0 0.35rem 0.35rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;

  @media (max-width: ${mobileSize}px) {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    grid-column-gap: 1rem;
    margin: auto 0;
  }
`;

const Title = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  font-weight: 600;

  @media (max-width: ${mobileSize}px) {
    padding-top: 0.25rem;
  }
`;

const Button = styled.button<{$highlighted: boolean}>`
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 1rem;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  color: ${lightBaseColor};
  background-color: ${tertiaryColor};
  border: solid 3px ${lightBorderColor};
  border-radius: 8px;
  padding: 0.25rem 0.25rem;

  @media (max-width: ${mobileSize}px) {
    grid-row: 2;
  }

  ${({$highlighted}) => $highlighted ? `
    color: ${primaryColor};
    font-weight: 700;
    border-color: ${primaryColor};
    text-align: center;
    background-color: ${rgba(primaryColor, 0.2)};
  ` : ''}
`;

enum Tool {
  point,
  weather,
  directions,
}

interface ModalState {
  type: Tool;
  coord: Coordinate;
}

const MapTools = () => {
  const [active, setActive] = useState<Tool | null>(null);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const mapContext = useMapContext();

  const forcePointer = useCallback(() => {
    if (mapContext.intialized) {
      mapContext.map.getCanvas().style.cursor = 'pointer';
    }
  }, [mapContext]);

  const onMapClickPointInfo = useCallback((e: any) => {
    if (mapContext.intialized) {
      const center = e.lngLat;
      setModalState({type: Tool.point, coord: [center.lng, center.lat]});
      mapContext.map.getCanvas().style.cursor = '';
      mapContext.map.off('click', onMapClickPointInfo);
      mapContext.map.off('mousemove', forcePointer);
      setActive(null);
    }
  }, [mapContext, forcePointer]);
  const onMapClickWeather = useCallback((e: any) => {
    if (mapContext.intialized) {
      const center = e.lngLat;
      setModalState({type: Tool.weather, coord: [center.lng, center.lat]});
      mapContext.map.getCanvas().style.cursor = '';
      mapContext.map.off('click', onMapClickWeather);
      mapContext.map.off('mousemove', forcePointer);
      setActive(null);
    }
  }, [mapContext, forcePointer]);
  const onMapClickDirections = useCallback((e: any) => {
    if (mapContext.intialized) {
      const center = e.lngLat;
      setModalState({type: Tool.directions, coord: [center.lng, center.lat]});
      mapContext.map.getCanvas().style.cursor = '';
      mapContext.map.off('click', onMapClickDirections);
      mapContext.map.off('mousemove', forcePointer);
      setActive(null);
    }
  }, [mapContext, forcePointer]);
  const closeModal = useCallback(() => setModalState(null), [setModalState]);

  const getPointInfo = () => {
    if (mapContext.intialized) {
      if (active === Tool.point) {
        setActive(null);
        mapContext.map.getCanvas().style.cursor = '';
        mapContext.map.off('mousemove', forcePointer);
        mapContext.map.off('click', onMapClickPointInfo);
      } else {
        setActive(Tool.point);
        mapContext.map.on('mousemove', forcePointer);
        mapContext.map.on('click', onMapClickPointInfo);
      }
    }
  };
  const getWeather = () => {
    if (mapContext.intialized) {
      if (active === Tool.weather) {
        setActive(null);
        mapContext.map.getCanvas().style.cursor = '';
        mapContext.map.off('mousemove', forcePointer);
        mapContext.map.off('click', onMapClickWeather);
      } else {
        setActive(Tool.weather);
        mapContext.map.on('mousemove', forcePointer);
        mapContext.map.on('click', onMapClickWeather);
      }
    }
  };
  const getDirections = () => {
    if (mapContext.intialized) {
      if (active === Tool.directions) {
        setActive(null);
        mapContext.map.getCanvas().style.cursor = '';
        mapContext.map.off('mousemove', forcePointer);
        mapContext.map.off('click', onMapClickDirections);
      } else {
        setActive(Tool.directions);
        mapContext.map.on('mousemove', forcePointer);
        mapContext.map.on('click', onMapClickDirections);
      }
    }
  };

  let modal: React.ReactElement<any> | null;
  if (modalState && modalState.type === Tool.point) {
    modal = (
      <PointInfoModal
        latitude={modalState.coord[1]}
        longitude={modalState.coord[0]}
        onClose={closeModal}
      />
    );
  } else if (modalState && modalState.type === Tool.directions) {
    modal = (
      <DrivingDirectionsModal
        latitude={modalState.coord[1]}
        longitude={modalState.coord[0]}
        onClose={closeModal}
      />
    );
  } else if (modalState && modalState.type === Tool.weather) {
    modal = (
      <WeatherModal
        latitude={modalState.coord[1]}
        longitude={modalState.coord[0]}
        onClose={closeModal}
      />
    );
  } else {
    modal = null;
  }

  return (
    <Root>
      <Title>Map Tools</Title>
      <Button
        onClick={getPointInfo}
        $highlighted={active === Tool.point}
      >
        {
          active === Tool.point
            ? 'Click anywhere on the map'
            :  (
              <>
                <BasicIconInText icon={faCrosshairs} />
                Get point information
              </>
            )
        }
      </Button>
      <Button
        onClick={getWeather}
        $highlighted={active === Tool.weather}
      >
        {
          active === Tool.weather
            ? 'Click anywhere on the map'
            :  (
              <>
                <BasicIconInText icon={faCloudSun} />
                Get weather at point
              </>
            )
        }
      </Button>
      <Button
        onClick={getDirections}
        $highlighted={active === Tool.directions}
      >
        {
          active === Tool.directions
            ? 'Click anywhere on the map'
            :  (
              <>
                <BasicIconInText icon={faCar} />
                Get directions to point
              </>
            )
        }
      </Button>
      {modal}
    </Root>
  );
};

export default MapTools;
