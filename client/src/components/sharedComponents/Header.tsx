import { GetString } from 'fluent-react';
import React, { useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import Logo from '../../assets/logo/Logo';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { Routes } from '../../routing/routes';
import { friendsWithUserProfileLink, searchListDetailLink, searchMountainsDetailLink } from '../../routing/Utils';
import { HeaderContainer as HeaderContainerBase, smallHeaderBreakpoint } from '../../styling/Grid';
import {
  baseColor,
  lightFontWeight,
  regularFontWeight,
  tertiaryColor,
} from '../../styling/styleUtils';
import { User } from '../../types/graphQLTypes';
import { UserContext } from '../App';
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

    @media(max-width: ${smallHeaderBreakpoint}px) {
      transform: scale(0.6);
      transform-origin: top left;
      width: 200%;
    }

    @media(max-width: 650px) {
      transform: scale(0.55);
    }
    @media(max-width: 560px) {
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
  align-items: center;
  justify-content: center;
  text-decoration: none;
  text-transform: uppercase;
  padding: 0 0.75rem;
  white-space: nowrap;

  @media(max-width: 670px) {
    padding: 0 0.5rem;
  }

  @media(max-width: 470px) {
    padding: 0 0.4rem;
  }

  @media(max-width: 350px) {
    padding: 0 0.2rem;
  }

  @media(max-width: 630px) {
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
  background-image: url('${require('../../assets/logo/header-bg-texture.jpg')}');

  &:hover {
    color: #fff;
  }
`;

const Header = (props: RouteComponentProps) => {
  const {location: { pathname }} = props;

  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const peakListsPath = searchListDetailLink('search');
  const usersPath = friendsWithUserProfileLink('search');
  const mountainPath = searchMountainsDetailLink('search');

  const createLink = (route: string, label: string) => {
    let normalizedPathname: string;
    if (pathname.includes('dashboard')) {
      normalizedPathname = '/';
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
    return <Container className={className} to={route}>{label}</Container>;
  };

  const renderProp = (user: User | null) => {
    if (user) {
      return (
        <>
          <HeaderContainer>
            <SemanticLogoContainer>
              <LogoContainer to={Routes.Dashboard}>
                {getFluentString('global-text-value-wilderlist-name')}
                <Logo />
              </LogoContainer>
            </SemanticLogoContainer>
            <MainNav>
              {createLink(Routes.Dashboard, getFluentString('header-text-menu-item-dashboard'))}
              {createLink(peakListsPath, getFluentString('header-text-menu-item-lists'))}
              {createLink(mountainPath, getFluentString('header-text-menu-item-mountains'))}
              {createLink(usersPath, getFluentString('header-text-menu-item-friends'))}
            </MainNav>
            <UserMenu
              userMenuOpen={userMenuOpen}
              setUserMenuOpen={setUserMenuOpen}
              user={user}
              getFluentString={getFluentString}
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
              {getFluentString('global-text-value-wilderlist-name')}
              <Logo />
            </LogoContainer>
            <MainNav>
              {createLink(peakListsPath, getFluentString('header-text-menu-item-lists'))}
              {createLink(mountainPath, getFluentString('header-text-menu-item-mountains'))}
            </MainNav>
            <UserMenu
              user={user}
              userMenuOpen={userMenuOpen}
              setUserMenuOpen={setUserMenuOpen}
              getFluentString={getFluentString}
            />
          </HeaderContainer>
        </>
      );
    }
  };
  return (
    <>
      <UserContext.Consumer
        children={renderProp}
      />
    </>
  );
};

export default withRouter(Header);
