import { GetString } from 'fluent-react';
import React, { useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../assets/logo/Logo';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { Routes } from '../../routing/routes';
import { friendsWithUserProfileLink, searchListDetailLink } from '../../routing/Utils';
import { HeaderContainer as HeaderContainerBase, smallHeaderBreakpoint } from '../../styling/Grid';
import {
  baseColor,
  lightFontWeight,
  regularFontWeight,
  tertiaryColor,
} from '../../styling/styleUtils';
import { User } from '../../types/graphQLTypes';
import { UserContext } from '../App';
import UserMenu from './UserMenu';

const HeaderContainer = styled(HeaderContainerBase)`
  box-shadow: 0 1px 3px 1px #d1d1d1;
  display: flex;
  justify-content: flex-end;
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

    @media(max-width: 600px) {
      transform: scale(0.55);
    }
    @media(max-width: 450px) {
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
  min-width: 90px;
  padding: 0 1rem;

  @media(max-width: ${smallHeaderBreakpoint}px) {
    min-width: 20px;
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

  const createLink = (route: string, label: string) => {
    let normalizedPathname: string;
    if (pathname.includes(Routes.UserProfile.split(':id')[0])
      || pathname.includes(Routes.FriendsWithProfile.split(':id')[0])) {
      normalizedPathname = Routes.FriendsWithProfile;
    } else if (pathname.includes(Routes.ListDetail.split(':id')[0])
      || pathname.includes(Routes.MountainDetail.split(':id')[0])
      || pathname.includes(Routes.ListsWithDetail.split(':id')[0])) {
      normalizedPathname = Routes.ListsWithDetail;
    } else {
      normalizedPathname = pathname;
    }
    const Container = route === normalizedPathname ? ActiveNavLink : InactiveNavLink;
    return <Container to={route}>{label}</Container>;
  };

  const renderProp = (user: User | null) => {
    if (user === null) {
      return null;
    } else if (user) {
      return (
        <>
          <MainNav>
            {createLink(Routes.Dashboard, getFluentString('header-text-menu-item-dashboard'))}
            {createLink(searchListDetailLink('search'), getFluentString('header-text-menu-item-lists'))}
            {createLink(friendsWithUserProfileLink('search'), getFluentString('header-text-menu-item-friends'))}
          </MainNav>
          <UserMenu
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            user={user}
            getFluentString={getFluentString}
          />
        </>
      );
    } else {
      return (
        <>
          <a href='/auth/google'>{getFluentString('header-text-login-with-google')}</a>
        </>
      );
    }
  };
  return (
    <HeaderContainer>
      <LogoContainer to={Routes.Dashboard}>
        {getFluentString('global-text-value-wilderlist-name')}
        <Logo />
      </LogoContainer>
      <UserContext.Consumer
        children={renderProp}
      />
    </HeaderContainer>
  );
};

export default withRouter(Header);
