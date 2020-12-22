import {
  faCampground,
  faChartLine,
  faList,
  faMap,
  faMapSigns,
  faMountain,
  faStar,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, Props as FaProps } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import { Routes } from '../../../routing/routes';
import {
  listDetailLink,
  mountainDetailLink,
  userProfileLink,
} from '../../../routing/Utils';
import {
  HeaderContainer as HeaderContainerBase,
  headerHeight,
} from '../../../styling/Grid';
import {
  baseColor,
  lightBaseColor,
  lightFontWeight,
  primaryBlue,
  regularFontWeight,
  tertiaryColor,
} from '../../../styling/styleUtils';
import {mobileSize} from '../../../Utils';
import { AppContext } from '../../App';
import NotificationBar from './NotificationBar';
import UserMenu from './UserMenu';

const HeaderContainer = styled(HeaderContainerBase)`
  box-shadow: 0 1px 3px 1px #d1d1d1;
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 450;

  @media(max-width: ${mobileSize}px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    position: fixed;
    top: 0;
  }
`;

const SideContent = styled.div`
  box-sizing: border-box;

  @media(min-width: ${mobileSize + 1}px) {
    position: fixed;
    right: 0;
    top: ${headerHeight}rem;
    max-width: 200px;
    padding: 1rem;
  }
`;

const SemanticLogoContainer = styled.h1`
  margin: 0;
  overflow: hidden;
  font-size: 0;
  color: rgba(0, 0, 0, 0);
`;

const LogoContainer = styled(Link)`
  text-indent: -10000px;
  overflow: hidden;
  font-size: 0;
  color: rgba(0, 0, 0, 0);
`;

const Logo = styled.img`
  max-width: 100%;

  @media(max-width: ${mobileSize}px) {
    box-sizing: border-box;
    padding: 0.4rem 0.65rem;
    width: 150px;
  }
`;

const CoreNav = styled.nav`
  display: flex;

  @media(max-width: ${mobileSize}px) {
    margin-right: 0;
  }
`;

const UserNav = styled.nav`
  display: flex;
  margin-left: 1rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  text-transform: uppercase;
  padding: 0 0.75rem;
  white-space: nowrap;
  font-size: 0.9rem;

  @media(max-width: ${mobileSize}px) {
    flex-grow: 1;
    min-height: 45px;
  }
`;

const InactiveNavLink = styled(NavLink)`
  font-weight: ${lightFontWeight};
  color: ${baseColor};

  &:hover {
    color: ${baseColor};
    background-color: ${tertiaryColor};
  }
`;

const ActiveNavLink = styled(NavLink)`
  color: #fff;
  font-weight: ${regularFontWeight};
  background-color: ${primaryBlue};

  &:hover {
    color: #fff;
  }
`;

const IconContainerBase = styled.div`
  margin-right: 0.25rem;
  margin-top: 0.1em;
  font-size: 0.85em;

  @media(max-width: ${mobileSize}px) {
    margin-top: 0;
  }
`;

const ActiveIconContainer = styled(IconContainerBase)`
  color: #fff;
`;

const InactiveIconContainer = styled(IconContainerBase)`
  color: ${lightBaseColor};
`;

const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  z-index: 10;
`;

const BottomContent = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 450;
`;

const BottomNav = styled.div`
  background-color: #fff;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  display: flex;
  justify-content: space-between;
`;

const Copyright = styled.div`
  background-color: ${tertiaryColor};
  color: ${lightBaseColor};
  font-size: 0.75rem;
  padding: 0.35rem;
  text-align: center;

  a {
    color: ${lightBaseColor};
  }
`;

const Header = () => {
  const user = useCurrentUser();
  const { pathname } = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  const { windowWidth } = useContext(AppContext);
  const getString = useFluent();

  const peakListsPath = listDetailLink('search');
  const usersPath = userProfileLink('search');
  const mountainPath = mountainDetailLink('search');

  const createLink = (route: string, label: string, icon: FaProps['icon']) => {
    let normalizedPathname: string;
    if (pathname.includes('dashboard')) {
      normalizedPathname = '/dashboard';
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
    const className = route === Routes.Dashboard ? 'header-dashboard-link' : undefined;
    const Container = route === normalizedPathname ? ActiveNavLink : InactiveNavLink;
    const IconContainer = route === normalizedPathname ? ActiveIconContainer : InactiveIconContainer;
    return (
      <Container className={className} to={route}>
        <IconContainer>
          <FontAwesomeIcon icon={icon} />
        </IconContainer>
        {label}
      </Container>
    );
  };

  const hikingListsText = windowWidth > 530
    ? getString('header-text-menu-item-lists')
    : getString('header-text-menu-item-lists-short');
  const yourStatsText = windowWidth > 530
    ? getString('header-text-menu-item-your-stats')
    : getString('header-text-menu-item-your-stats-short');

  let notifications: React.ReactElement<any> | null;
  let userLinks: React.ReactElement<any> | null;
  if (user) {
    notifications = <NotificationBar userId={user._id} />;
    const mapLink = windowWidth > mobileSize
      ? null : createLink(Routes.Landing, getString('map-generic-title'), faMap);
    userLinks = (
      <>
        {mapLink}
        {createLink(Routes.Dashboard, getString('header-text-menu-item-dashboard'), faStar)}
        {createLink(Routes.YourStats, yourStatsText, faChartLine)}
        {createLink(usersPath, getString('header-text-menu-item-friends'), faUserFriends)}
      </>
    );
  } else {
    notifications = null;
    userLinks = null;
  }

  if (windowWidth > mobileSize) {
    return (
      <>
        <HeaderContainer>
          <SideContent>
            <SemanticLogoContainer>
              <LogoContainer to={Routes.Landing}>
                {getString('global-text-value-wilderlist-name')}
                <Logo
                  src={require('../../../assets/logo/logo.png').default}
                  alt={getString('global-text-value-wilderlist-name')}
                  title={getString('global-text-value-wilderlist-name')}
                />
              </LogoContainer>
            </SemanticLogoContainer>
          </SideContent>
          <CoreNav>
            {createLink(peakListsPath, hikingListsText, faList)}
            {createLink(mountainPath, getString('header-text-menu-item-mountains'), faMountain)}
            {createLink('#', getString('header-text-menu-item-trails'), faMapSigns)}
            {createLink('#', getString('header-text-menu-item-camping'), faCampground)}
          </CoreNav>
          <UserNav>
            {userLinks}
            <UserMenu
              userMenuOpen={userMenuOpen}
              setUserMenuOpen={setUserMenuOpen}
              user={user}
            />
          </UserNav>
        </HeaderContainer>
        {notifications}
      </>
    );
  } else {
    return (
      <>
        <HeaderContainer>
          <TopNav>
            <SemanticLogoContainer>
              <LogoContainer to={Routes.Landing}>
                {getString('global-text-value-wilderlist-name')}
                <Logo
                  src={require('../../../assets/logo/logo.png').default}
                  alt={getString('global-text-value-wilderlist-name')}
                  title={getString('global-text-value-wilderlist-name')}
                />
              </LogoContainer>
            </SemanticLogoContainer>
            <UserNav>
              <UserMenu
                userMenuOpen={userMenuOpen}
                setUserMenuOpen={setUserMenuOpen}
                user={user}
              />
            </UserNav>
          </TopNav>
          <CoreNav>
            {createLink(peakListsPath, hikingListsText, faList)}
            {createLink(mountainPath, getString('header-text-menu-item-mountains'), faMountain)}
            {createLink('#', getString('header-text-menu-item-trails'), faMapSigns)}
            {createLink('#', getString('header-text-menu-item-camping'), faCampground)}
          </CoreNav>
        </HeaderContainer>
        {notifications}
        <BottomContent>
          <SideContent>
          </SideContent>
          <BottomNav>
            {userLinks}
          </BottomNav>
          <Copyright>
            {' © '}
            <Link to={Routes.About}>
              {getString('global-text-value-wilderlist-name')}
            </Link>
            {' | '}
            {' © '}
            <a href='https://www.mapbox.com/about/maps/' target='_blank' rel='noreferrer'>
              MapBox
            </a>
            {' | '}
            {' © '}
            <a href='http://www.openstreetmap.org/copyright' target='_blank' rel='noreferrer'>
              OSM
            </a>
            {' | '}
            <a href='https://www.mapbox.com/map-feedback/' target='_blank' rel='noreferrer'>
              Improve this map
            </a>
            {' | '}
            <Link to={Routes.TermsOfUse}>
              {getString('header-text-menu-terms-of-use')}
            </Link>
            {' | '}
            <Link to={Routes.PrivacyPolicy}>
              {getString('header-text-menu-privacy-policy')}
            </Link>
          </Copyright>
        </BottomContent>
      </>
    );
  }

};

export default Header;
