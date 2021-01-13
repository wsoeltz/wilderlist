import {
  faChartLine,
  faList,
  faMap,
  faStar,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, Props as FaProps } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import LogoPng from '../../../assets/logo/logo.png';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import useWindowWidth from '../../../hooks/useWindowWidth';
import { Routes } from '../../../routing/routes';
import {
  HeaderContainer as HeaderContainerBase,
  headerHeight,
} from '../../../styling/Grid';
import {
  baseColor,
  lightBaseColor,
  lightBorderColor,
  lightFontWeight,
  primaryColor,
  regularFontWeight,
  tertiaryColor,
} from '../../../styling/styleUtils';
import {mobileSize} from '../../../Utils';
import {
  mountainNeutralSvg,
  tentNeutralSvg,
  trailDefaultSvg,
} from '../../sharedComponents/svgIcons';
import Search from '../contentHeader/search';
import NotificationBar from './NotificationBar';
import AddAscentButton from './toolsAndSettings/AddAscentButton';
import CreateItineraryButton from './toolsAndSettings/CreateItineraryButton';
import CreateRouteButton from './toolsAndSettings/CreateRouteButton';
import MapLayersButton from './toolsAndSettings/MapLayersButton';
import Toggle3dModeButton from './toolsAndSettings/Toggle3dModeButton';
import ToolsAndSettingsButton from './toolsAndSettings/ToolsAndSettingsButton';
import UserMenu from './UserMenu';

const HeaderContainer = styled(HeaderContainerBase)`
  box-shadow: 0 1px 3px 1px #d1d1d1;
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 450;
  background-color: #fff;

  @media(max-width: ${mobileSize}px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    position: fixed;
    top: 0;
  }
`;

export const sideContentWidth = 200;

const SideContent = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  pointer-events: none;

  > * {
    pointer-events: all;
  }

  @media(min-width: ${mobileSize + 1}px) {
    position: fixed;
    right: 0;
    top: ${headerHeight}rem;
    max-width: ${sideContentWidth}px;
    padding: 1rem;
    display: block;
  }
`;

const SemanticLogoContainer = styled.h1`
  margin: 0;
  overflow: hidden;
  font-size: 0;
  color: rgba(0, 0, 0, 0);

  @media(min-width: ${mobileSize + 1}px) {
    margin-bottom: 1.5rem;
  }
`;

const LogoContainer = styled(Link)`
  text-indent: -10000px;
  overflow: hidden;
  font-size: 0;
  color: rgba(0, 0, 0, 0);
`;

export const logoSmallWindoWidth = 1080;
export const logoSmallWidth = 120;

const Logo = styled.img`
  max-width: 100%;

  @media(max-width: ${logoSmallWindoWidth}px) {
    max-width: ${logoSmallWidth}px;
  }
  @media(max-width: ${mobileSize}px) {
    box-sizing: border-box;
    padding: 0.4rem 0.65rem;
    height: 45px;
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

  @media(max-width: ${mobileSize}px) {
    margin-left: auto;
  }
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
    flex-direction: column;
    font-size: 1.1rem;
  }

  @media(max-width: 310px) {
    font-size: 0.85rem;
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
  background-color: ${primaryColor};

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
    margin-right: 0;
    margin-bottom: 0.25rem;

  }
`;

const ActiveIconContainer = styled(IconContainerBase)`
  color: #fff;
`;

const InactiveIconContainer = styled(IconContainerBase)`
  color: ${primaryColor};
`;

const TopNav = styled.div`
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
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
  box-shadow: 0 1px 3px 1px #d1d1d1;
`;

const BottomNav = styled.div`
  background-color: #fff;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  height: 45px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  position: relative;
`;

const Copyright = styled.div`
  background-color: ${tertiaryColor};
  color: ${lightBaseColor};
  font-size: 0.75rem;
  padding: 0.35rem;
  text-align: center;
  position: relative;

  a {
    color: ${lightBaseColor};
  }
`;

const CustomIconInTextBase = styled(IconContainerBase)`
  svg {
    width: 0.9rem;
  }
`;
const CustomIconInTextActive = styled(CustomIconInTextBase)`
  svg {
    .fill-path {
      fill: #fff;
    }
    .stroke-path {
      fill: ${primaryColor};
    }
  }
`;
const CustomIconInTextInactive = styled(CustomIconInTextBase)`
  svg {
    .fill-path {
      fill: ${primaryColor};
    }
    .stroke-path {
      fill: #fff;
    }
  }
`;
const MobileAddAscentButtonContainer = styled.div`
  height: 100%;
  border-left: solid 1px ${lightBorderColor};
  border-right: solid 1px ${lightBorderColor};
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const LineBreak = styled.hr`
  border: solid 1px #fff;
`;

type LinkInput = {
  route: string,
  label: string,
} & (
  {
    customIcon: true,
    icon: string,
  } | {
    customIcon: false,
    icon: FaProps['icon'],
  }
);

const Header = () => {
  const user = useCurrentUser();
  const { pathname } = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  const windowWidth = useWindowWidth();
  const getString = useFluent();

  const createLink = useCallback((input: LinkInput) => {
    const {route, label} = input;
    let normalizedPathname: string;
    if (pathname.includes('dashboard')) {
      normalizedPathname = Routes.Dashboard;
    } else if  (pathname.includes('your-stats')) {
      normalizedPathname = Routes.YourStats;
    } else if (pathname.includes('user') && !pathname.includes('settings')) {
      normalizedPathname = Routes.SearchUsers;
    } else if (pathname.includes('list')) {
      normalizedPathname = Routes.SearchLists;
    } else if (pathname.includes('mountain')) {
      normalizedPathname = Routes.SearchMountains;
    } else if (pathname.includes('campsite')) {
      normalizedPathname = Routes.SearchCampsites;
    } else if (pathname.includes('trail')) {
      normalizedPathname = Routes.SearchTrails;
    } else {
      normalizedPathname = pathname;
    }
    const className = route === Routes.Dashboard ? 'header-dashboard-link' : undefined;
    const Container = route === normalizedPathname ? ActiveNavLink : InactiveNavLink;
    let icon: React.ReactElement<any>;
    if (input.customIcon === true) {
      const IconContainer = route === normalizedPathname ? CustomIconInTextActive : CustomIconInTextInactive;
      icon = (
        <IconContainer
          dangerouslySetInnerHTML={{__html: input.icon}}
        />
      );
    } else {
      const IconContainer = route === normalizedPathname ? ActiveIconContainer : InactiveIconContainer;
      icon = (
        <IconContainer>
          <FontAwesomeIcon icon={input.icon} />
        </IconContainer>
      );
    }
    return (
      <Container className={className} to={route}>
        {icon}
        {label}
      </Container>
    );
  }, [pathname]);

  const hikingListsText = windowWidth > 530
    ? getString('header-text-menu-item-lists')
    : getString('header-text-menu-item-lists-short');
  const yourStatsText = windowWidth > 530
    ? getString('header-text-menu-item-your-stats')
    : getString('header-text-menu-item-your-stats-short');

  const dashboardLink = createLink({
    route: Routes.Dashboard,
    label: getString('header-text-menu-item-dashboard'),
    customIcon: false,
    icon: faStar,
  });
  const statsLink = createLink({
    route: Routes.YourStats,
    label: yourStatsText,
    customIcon: false,
    icon: faChartLine,
  });
  const friendsLink = createLink({
    route: Routes.SearchUsers,
    label: getString('header-text-menu-item-friends'),
    customIcon: false,
    icon: faUserFriends,
  });
  const listsLink = createLink({
    route: Routes.SearchLists,
    label: hikingListsText,
    customIcon: false,
    icon: faList,
  });
  const mountainsLink = createLink({
    route: Routes.SearchMountains,
    label: getString('header-text-menu-item-mountains'),
    customIcon: true,
    icon: mountainNeutralSvg,
  });
  const trailsLink = createLink({
    route: Routes.SearchTrails,
    label: getString('header-text-menu-item-trails'),
    customIcon: true,
    icon: trailDefaultSvg,
  });
  const campsitesLink = createLink({
    route: Routes.SearchCampsites,
    label: getString('header-text-menu-item-camping'),
    customIcon: true,
    icon: tentNeutralSvg,
  });

  let notifications: React.ReactElement<any> | null;
  let userLinks: React.ReactElement<any> | null;
  let addAscentButton: React.ReactElement<any> | null;
  if (user) {
    notifications = <NotificationBar userId={user._id} />;
    const mapLink = windowWidth > mobileSize
      ? null : createLink({
        route: Routes.Landing,
        label: getString('map-generic-title'),
        customIcon: false,
        icon: faMap,
    });
    userLinks = (
      <>
        {mapLink}
        {dashboardLink}
        {statsLink}
        {friendsLink}
      </>
    );
    addAscentButton = windowWidth > mobileSize ? (
      <AddAscentButton />
    ) : (
      <MobileAddAscentButtonContainer>
        <AddAscentButton />
      </MobileAddAscentButtonContainer>
    );
  } else {
    notifications = null;
    userLinks = null;
    addAscentButton = null;
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
                  src={LogoPng}
                  alt={getString('global-text-value-wilderlist-name')}
                  title={getString('global-text-value-wilderlist-name')}
                />
              </LogoContainer>
            </SemanticLogoContainer>
            {addAscentButton}
            <CreateRouteButton />
            <CreateItineraryButton />
            <LineBreak />
            <Toggle3dModeButton />
            <MapLayersButton />
            <ToolsAndSettingsButton />
          </SideContent>
          <CoreNav>
            {listsLink}
            {mountainsLink}
            {trailsLink}
            {campsitesLink}
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
    const utiltyButtons = pathname === Routes.Landing ? (
      <SideContent>
        <CreateRouteButton />
        <CreateItineraryButton />
        <Toggle3dModeButton />
        <MapLayersButton />
        <ToolsAndSettingsButton />
      </SideContent>
    ) : null;

    const bottomNav = user ? (
      <BottomNav>
        {userLinks}
        <UserNav>
          <UserMenu
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            user={user}
          />
        </UserNav>
      </BottomNav>
    ) : null;

    const loginMenu = !user ? (
      <UserNav>
        <UserMenu
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
          user={user}
        />
      </UserNav>
    ) : null;

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
            {addAscentButton}
            {loginMenu}
            <Search />
          </TopNav>
          <CoreNav>
            {listsLink}
            {mountainsLink}
            {trailsLink}
            {campsitesLink}
          </CoreNav>
        </HeaderContainer>
        {notifications}
        <BottomContent>
          {utiltyButtons}
          {bottomNav}
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
