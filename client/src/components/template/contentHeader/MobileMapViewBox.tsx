import React, {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components/macro';
import MapBoxLogoSVG from '../../../assets/images/mapbox-logo.svg';
import {mobileTopPadding} from '../../../styling/Grid';
import MobileTab from './MobileTab';
import ScrollDownIcon from './ScrollDownIcon';

const LogoImg = styled.img`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  width: 5rem;
  pointer-events: none;
`;

const ViewBox = styled.div`
  position: relative;
`;

const viewBoxId = 'mobile-map-viewbox-id';
let windowHeight = window.innerHeight;

export const useMapViewBoxScroll = (dependency: any) => {
  useEffect(() => {
    const node = document.getElementById(viewBoxId);
    if (node) {
      window.scrollTo(0, node.offsetTop);
    }
  }, [dependency]);
};

const MobileMapViewBox = () => {
  const mobileMidViewboxRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const node = mobileMidViewboxRef.current;
    if (node) {
      window.scrollTo(0, node.offsetTop);
    }
  }, [mobileMidViewboxRef, location.pathname]);

  useEffect(() => {
    windowHeight = window.innerHeight;
  }, []);

  return (
    <>
     <div
       style={{height: windowHeight * 0.08}}
     />
     <ViewBox
       id={viewBoxId}
       ref={mobileMidViewboxRef}
       style={{height: (windowHeight * 0.8) - (mobileTopPadding * 2.1)}}
     >
       <LogoImg src={MapBoxLogoSVG} alt={'Mapbox'} title={'Mapbox'} />
     </ViewBox>
     <MobileTab />
     <ScrollDownIcon windowHeight={windowHeight} />
   </>
  );
};

export default MobileMapViewBox;
