import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import useMapCenterAtScreenPoint from '../../../../hooks/useMapCenterAtScreenPoint';
import {
  contentColumnIdeal,
  contentColumnMax,
  contentColumnMin,
} from '../../../../styling/Grid';
import {
  baseColor,
  BasicIconInText,
  ButtonPrimary,
} from '../../../../styling/styleUtils';
import {Coordinate} from '../../../../types/graphQLTypes';
import {mobileSize} from '../../../../Utils';

const CenterLine = styled.div`
  width: 100%;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;

  @media(min-width: ${mobileSize + 1}px) {
    width: calc(100vw - clamp(${contentColumnMin}px, ${contentColumnIdeal}vw, ${contentColumnMax}px));

    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 100%;
      margin: auto;
      border-right: solid 1px ${baseColor};
    }

    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 0;
      border-bottom: solid 1px ${baseColor};
    }
  }

`;

const MapCenterButton = styled(ButtonPrimary)`
  width: 100%;
  margin: 0.75rem 0 2rem;
  font-size: 1rem;
  padding: 0.75rem 1rem;
`;

interface Props {
  getCenter: (coord: Coordinate) => void;
}

const Crosshairs = ({getCenter}: Props) => {
  const [point, setPoint] = useState<{x: number, y: number}>({x: 0, y: 0});
  const mapCenter = useMapCenterAtScreenPoint(point.x, point.y);
  const getString = useFluent();

  const crosshairsRef = useRef<HTMLDivElement | null>(null);

  useEffect (() => {
    const node = crosshairsRef.current;
    if (node) {
      const {offsetLeft, offsetWidth} = node;
      setPoint({
        x: offsetLeft + (offsetWidth / 2),
        y: window.innerHeight / 2,
      });
    }
  }, [crosshairsRef]);

  const onClick = () => getCenter(mapCenter);

  return (
    <>
      <MapCenterButton onClick={onClick}>
        <BasicIconInText icon={faCrosshairs} />
        {getString('map-set-lat-long-value')}
      </MapCenterButton>
      <CenterLine ref={crosshairsRef} />
    </>
  );
};

export default Crosshairs;
