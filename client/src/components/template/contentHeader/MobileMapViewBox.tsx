import React, {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components/macro';

const Box = styled.div`
  pointer-events: none;
`;

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
     <Box
       style={{height: '5vh'}}
     />
     <Box
       ref={mobileMidViewboxRef}
       style={{height: '55vh'}}
     />
   </>
  );
};

export default MobileMapViewBox;
