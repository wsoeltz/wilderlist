import React, {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components/macro';
import MapBoxLogoSVG from '../../../assets/images/mapbox-logo.svg';
import {mobileTopPadding} from '../../../styling/Grid';
import MobileTab from './MobileTab';

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

  return (
    <>
     <div
       style={{height: '20vh'}}
     />
     <ViewBox
       id={viewBoxId}
       ref={mobileMidViewboxRef}
       style={{height: `calc(80vh - ${mobileTopPadding * 2.1}px)`}}
     >
       <LogoImg src={MapBoxLogoSVG} />
     </ViewBox>
     <MobileTab />
   </>
  );
};

export default MobileMapViewBox;
