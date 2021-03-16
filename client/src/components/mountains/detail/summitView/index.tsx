import {
  faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {scaleLinear} from 'd3-scale';
import React, {useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components/macro';
import useMapContext from '../../../../hooks/useMapContext';
import {degToCompass} from '../../../sharedComponents/detailComponents/weather/pointForecast/Utils';
import Content from './Content';

const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(12, 56, 76, 0.1);
  pointer-events: all;
  cursor: crosshair;
`;

const CompassContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  margin: auto;

  top: 3rem;
`;

const Compass = styled.div`
  font-size: 1.5rem;
  color: #fff;
`;

const SummitView = () => {
  const {lat, lng, altitude, id}: any = useParams();
  const mapContext = useMapContext();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const compassRef = useRef<HTMLDivElement | null>(null);
  const degreeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let bearing: number = 0;
    let pitch: number = 90;
    if (mapContext.intialized && overlayRef.current) {
      mapContext.enableSummitView(parseFloat(lat), parseFloat(lng), parseFloat(altitude));
      overlayRef.current.addEventListener('mousemove', e => {
        const bearingScale = scaleLinear().domain([window.innerWidth, 0]).range([180, -180]);
        const mouseX = e.pageX;
        bearing = bearingScale(mouseX);
        if (compassRef.current && degreeRef.current) {
          compassRef.current.innerText = degToCompass(bearing + 360);
          const visualDegree = bearing <= 0 ? bearing + 360 : bearing;
          degreeRef.current.innerText = Math.round(visualDegree) + '°';
        }
        const mouseY = e.pageY;
        const pitchScale = scaleLinear().domain([0., window.innerHeight]).range([150, 0]);
        pitch = pitchScale(mouseY);
      });
      const setCameraPosition = () => {
        const map = mapContext.map;
        map.setZoom(14);
        map.setBearing(bearing);
        map.setPitch(pitch);
        map.setCenter([lng, lat]);
      };
      const rotate = () => {
        if (mounted) {
          setCameraPosition();
        }
        setTimeout(() => {
          if (mounted) {
            rotate();
          }
        }, 10);
      };
      rotate();
    }
    return () => {
      if (mapContext.intialized) {
        mounted = false;
        mapContext.disableSummitView();
      }
    };
  }, [mapContext, lat, lng, altitude]);

  const content = id ? <Content id={id} /> : null;

  return (
    <Overlay ref={overlayRef}>
      {content}
      <CompassContainer>
        <Compass>
          <FontAwesomeIcon icon={faAngleUp} />
          <div><small ref={compassRef}></small></div>
          <div><small><small ref={degreeRef}></small></small></div>
        </Compass>
      </CompassContainer>
    </Overlay>
  );
};

export default SummitView;
