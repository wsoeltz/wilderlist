import {
  faChartLine,
  faHiking,
  faHome,
  faInfoCircle,
  faMountain,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, Props as FaProps } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import Logo from '../../assets/logo/Logo';
import useFluent from '../../hooks/useFluent';
import { Routes } from '../../routing/routes';
import {
  friendsWithUserProfileLink,
  searchListDetailLink,
  searchMountainsDetailLink,
} from '../../routing/Utils';
import { HeaderContainer as HeaderContainerBase, smallHeaderBreakpoint } from '../../styling/Grid';
import {
  baseColor,
  lightBaseColor,
  lightFontWeight,
  regularFontWeight,
  tertiaryColor,
} from '../../styling/styleUtils';
import { UserContext } from '../App';
import { AppContext } from '../App';
import NotificationBar from './NotificationBar';
import UserMenu from './UserMenu';

const HeaderContainer = styled(HeaderContainerBase)`
  box-shadow: 0 1px 3px 1px #d1d1d1;
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 450;
`;

const SemanticLogoContainer = styled.h1`
  margin: 0;
  text-indent: -10000px;
  overflow: hidden;
  font-size: 0;
  color: rgba(0, 0, 0, 0);
  margin-right: auto;
`;

const LogoContainer = styled(Link)`
  text-indent: -10000px;
  overflow: hidden;
  font-size: 0;
  color: rgba(0, 0, 0, 0);
  margin-right: auto;

  svg {
    display: block;
    width: 100%;
    padding: 0.6rem;
    transform-origin: top left;
    transform: scale(0.73);

    @media(max-width: ${smallHeaderBreakpoint}px) {
      transform: scale(0.6);
      width: 200%;
    }

    @media(max-width: 850px) {
      transform: scale(0.55);
    }
    @media(max-width: 720px) {
      transform: scale(0.5);
    }
  }
`;

const MainNav = styled.nav`
  display: flex;
  margin-right: 1rem;
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  text-transform: uppercase;
  padding: 0 0.75rem;
  white-space: nowrap;

  @media(max-width: 850px) {
    padding: 0 0.5rem;
    font-size: 0.9rem;
  }

  @media(max-width: 690px) {
    font-size: 0.8rem;
  }

  @media(max-width: 390px) {
    &.header-dashboard-link {
      display: none;
    }
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
  background-image: url('${require('../../assets/logo/header-bg-texture.jpg').default}');

  &:hover {
    color: #fff;
  }
`;

const IconContainerBase = styled.div`
  margin-bottom: 0.1rem;
  font-size: 0.9rem;
`;

const ActiveIconContainer = styled(IconContainerBase)`
  color: #fff;
`;

const InactiveIconContainer = styled(IconContainerBase)`
  color: ${lightBaseColor};
`;

const Header = () => {
  const user = useContext(UserContext);
  const { pathname } = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  const { windowWidth } = useContext(AppContext);
  const getString = useFluent();

  const peakListsPath = searchListDetailLink('search');
  const usersPath = friendsWithUserProfileLink('search');
  const mountainPath = searchMountainsDetailLink('search');

  const createLink = (route: string, label: string, icon: FaProps['icon']) => {
    let normalizedPathname: string;
    if (pathname.includes('dashboard')) {
      normalizedPathname = '/';
    } else if  (pathname === Routes.About) {
      normalizedPathname = Routes.About;
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
  if (user) {
    return (
      <>
        <HeaderContainer>
          <SemanticLogoContainer>
            <LogoContainer to={Routes.Dashboard}>
              {getString('global-text-value-wilderlist-name')}
              <Logo />
            </LogoContainer>
          </SemanticLogoContainer>
          <MainNav>
            {createLink(Routes.Dashboard, getString('header-text-menu-item-dashboard'), faHome)}
            {createLink(peakListsPath, hikingListsText, faHiking)}
            {createLink(mountainPath, getString('header-text-menu-item-mountains'), faMountain)}
            {createLink(Routes.YourStats, yourStatsText, faChartLine)}
            {createLink(usersPath, getString('header-text-menu-item-friends'), faUserFriends)}
            {createLink(Routes.About, getString('header-text-menu-item-about'), faInfoCircle)}
          </MainNav>
          <UserMenu
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            user={user}
          />
        </HeaderContainer>
        <NotificationBar userId={user._id} />
      </>
    );
  } else {
    return (
      <>
        <HeaderContainer>
          <LogoContainer to={Routes.Dashboard}>
            {getString('global-text-value-wilderlist-name')}
            <Logo />
          </LogoContainer>
          <MainNav>
            {createLink(peakListsPath, getString('header-text-menu-item-lists'), faHiking)}
            {createLink(mountainPath, getString('header-text-menu-item-mountains'), faMountain)}
            {createLink(Routes.About, getString('header-text-menu-item-about'), faInfoCircle)}
          </MainNav>
          <UserMenu
            user={user}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
          />
        </HeaderContainer>
      </>
    );
  }
};

export default Header;
