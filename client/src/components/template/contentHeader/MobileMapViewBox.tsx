import React, {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {mobileTopPadding} from '../../../styling/Grid';

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
     <div
       id={viewBoxId}
       ref={mobileMidViewboxRef}
       style={{height: `calc(80vh - ${mobileTopPadding * 2.1}px)`}}
     />
   </>
  );
};

export default MobileMapViewBox;
