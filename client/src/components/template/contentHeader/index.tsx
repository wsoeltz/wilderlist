import React, {useContext, useEffect, useMemo} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components/macro';
import {Routes} from '../../../routing/routes';
import {
  listDetailLink,
  mountainDetailLink,
  userProfileLink,
} from '../../../routing/Utils';
import {mobileSize} from '../../../Utils';
import { AppContext } from '../../App';
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

const Buffer = styled.div`
  height: 5rem;
  background-color: #fff;
`;

const peakListsPath = listDetailLink('search');
const usersPath = userProfileLink('search');
const mountainPath = mountainDetailLink('search');

const Header = () => {
  const { pathname } = useLocation();
  const {windowWidth} = useContext(AppContext);

  let normalizedPathname: string;
  if (pathname.includes('dashboard')) {
    normalizedPathname = Routes.Dashboard;
  } else if  (pathname.includes('your-stats')) {
    normalizedPathname = Routes.YourStats;
  } else if (pathname.includes('user') && !pathname.includes('settings')) {
    normalizedPathname = usersPath;
  } else if (pathname.includes('list')) {
    normalizedPathname = peakListsPath;
  } else if (pathname.includes('mountain')) {
    normalizedPathname = mountainPath;
  } else {
    normalizedPathname = pathname;
  }

  const showBackground = useMemo(
    () => (windowWidth > mobileSize && normalizedPathname !== Routes.Landing) ||
                         (normalizedPathname !== Routes.Landing &&
                          normalizedPathname !== peakListsPath  &&
                          normalizedPathname !== mountainPath),
   [windowWidth, normalizedPathname],
  );

  const showMobileMapViewBox = useMemo(
    () => windowWidth <= mobileSize && !showBackground && normalizedPathname !== Routes.Landing,
    [windowWidth, showBackground, normalizedPathname],
  );

  const mobileMapViewbox = showMobileMapViewBox ? <MobileMapViewBox key={pathname} /> : null;
  const mobileBuffer = windowWidth <= mobileSize && showBackground ? <Buffer /> : null;

  useEffect(() => {
    if (!showMobileMapViewBox) {
      window.scrollTo(0, 0);
    }
  }, [showMobileMapViewBox, pathname]);

  return (
    <>
    <Root style={{backgroundColor: showBackground && !mobileBuffer ? '#fff' : undefined}}>
      <Search />
    </Root>
    {mobileBuffer}
    {mobileMapViewbox}
    </>
  );
};

export default Header;