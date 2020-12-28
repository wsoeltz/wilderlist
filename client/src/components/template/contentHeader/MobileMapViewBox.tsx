import React, {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {mobileTopPadding} from '../../../styling/Grid';

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
       ref={mobileMidViewboxRef}
       style={{height: `calc(80vh - ${mobileTopPadding * 2.1}px)`}}
     />
   </>
  );
};

export default MobileMapViewBox;
