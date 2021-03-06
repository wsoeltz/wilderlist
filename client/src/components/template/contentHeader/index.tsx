import React, {useEffect, useMemo} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components/macro';
import useWindowWidth from '../../../hooks/useWindowWidth';
import {Routes} from '../../../routing/routes';
import {lightBorderColor} from '../../../styling/styleUtils';
import {mobileSize} from '../../../Utils';
import MobileMapViewBox from './MobileMapViewBox';
import Search from './search';

const Root = styled.div`
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  z-index: 100;

  @media (max-width: ${mobileSize}px) {
    position: fixed;
  }
`;

const Header = () => {
  const { pathname } = useLocation();
  const windowWidth = useWindowWidth();

  let normalizedPathname: string;
  if (pathname.includes('saved')) {
    normalizedPathname = Routes.Dashboard;
  } else if  (pathname.includes('your-stats')) {
    normalizedPathname = Routes.YourStats;
  } else if (pathname.includes('user') && !pathname.includes('settings') && !pathname.includes('list')) {
    normalizedPathname = Routes.SearchUsers;
  } else if (pathname.includes('list')) {
    normalizedPathname = Routes.SearchLists;
  } else if (pathname.includes('mountain')) {
    normalizedPathname = Routes.SearchMountains;
  } else if (pathname.includes('campsite')) {
    normalizedPathname = Routes.SearchCampsites;
  } else if (pathname.includes('trail')) {
    normalizedPathname = Routes.SearchTrails;
  } else if (pathname.includes('summit-view')) {
    normalizedPathname = Routes.SummitView;
  } else if (pathname.includes(Routes.YourStats)) {
    normalizedPathname = Routes.YourStats;
  } else {
    normalizedPathname = pathname;
  }

  const showBackground = useMemo(
    () => (windowWidth > mobileSize && normalizedPathname !== Routes.Landing ) ||
                         (normalizedPathname !== Routes.Landing &&
                          normalizedPathname !== Routes.SearchLists  &&
                          normalizedPathname !== Routes.SearchTrails  &&
                          normalizedPathname !== Routes.SearchCampsites  &&
                          normalizedPathname !== Routes.SearchCampsites  &&
                          normalizedPathname !== Routes.SearchMountains &&
                          normalizedPathname !== Routes.AddTripReport &&
                          normalizedPathname !== Routes.YourStats &&
                          normalizedPathname !== Routes.EditTripReport),
   [windowWidth, normalizedPathname],
  );

  const showMobileMapViewBox = useMemo(
    () => windowWidth <= mobileSize && !showBackground && normalizedPathname !== Routes.Landing,
    [windowWidth, showBackground, normalizedPathname],
  );

  const mobileMapViewbox = showMobileMapViewBox ? <MobileMapViewBox key={pathname} /> : null;
  const searchBar = windowWidth > mobileSize ? (
    <Root style={{
      backgroundColor: showBackground ? '#fff' : undefined,
      borderRight: showBackground ? `solid 1px ${lightBorderColor}` : undefined,
      display: normalizedPathname === Routes.SummitView ? 'none' : undefined,
    }}>
      <Search />
    </Root>
  ) : null;

  useEffect(() => {
    if (!showMobileMapViewBox) {
      window.scrollTo(0, 0);
    }
  }, [showMobileMapViewBox, pathname]);

  return (
    <>
      {searchBar}
      {mobileMapViewbox}
    </>
  );
};

export default Header;
