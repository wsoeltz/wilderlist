import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import debounce from 'lodash/debounce';
import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components/macro';
import MapBoxLogoSVG from '../../../assets/images/mapbox-logo.svg';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {mobileTopPadding} from '../../../styling/Grid';
import {primaryColor} from '../../../styling/styleUtils';
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

const removedScrollIconClassName = 'scroll-down-icon-scrolled-past-mid';

const ScrollDownIcon = styled.button`
  position: fixed;
  bottom: 4.5rem;
  left: 0;
  right: 0;
  z-index: 1000;
  margin: 0 auto 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1000px;
  background-color: ${primaryColor};
  color: #fff;
  box-shadow: 0px 0px 5px 0px #525252;
  pointer-events: all;
  transition: opacity 0.1s ease-in-out;

  &.${removedScrollIconClassName} {
    opacity: 0;
    pointer-events: none;
  }
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
  const contentTopRef = useRef<HTMLDivElement | null>(null);
  const user = useCurrentUser();
  const location = useLocation();
  const [scrollButtonVisible, setScrollButtonVisible] = useState<boolean>(true);

  useEffect(() => {
    const node = mobileMidViewboxRef.current;
    if (node) {
      window.scrollTo(0, node.offsetTop);
    }
  }, [mobileMidViewboxRef, location.pathname]);

  useEffect(() => {
    const node = contentTopRef.current;
    const windowScrollFn = debounce(() => {
      if (node) {
        const pageScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const nodeTop = node.offsetTop;
        if (pageScroll > nodeTop - 200) {
          setScrollButtonVisible(false);
          document.removeEventListener('scroll', windowScrollFn);
        }
      }
    }, 250);
    document.addEventListener('scroll', windowScrollFn);
    return () => document.removeEventListener('scroll', windowScrollFn);
  }, [contentTopRef]);

  useEffect(() => {
    windowHeight = window.innerHeight;
  }, []);

  const onScrollButtonClick = () => {
    const node = contentTopRef.current;
    if (node) {
      window.scrollTo({
        top: node.offsetTop - 100,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

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
     <div ref={contentTopRef} />
     <MobileTab />
      <ScrollDownIcon
        style={user ? undefined : {bottom: '1.5rem'}}
        onClick={onScrollButtonClick}
        className={scrollButtonVisible ? undefined : removedScrollIconClassName}
      >
       <FontAwesomeIcon icon={faAngleDoubleDown} />
      </ScrollDownIcon>
   </>
  );
};

export default MobileMapViewBox;
