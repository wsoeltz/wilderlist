import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../assets/logo/Logo';
import { Routes } from '../../routing/routes';
import { HeaderContainer as HeaderContainerBase } from '../../styling/Grid';
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
  padding: 0.6rem;

  svg {
    display: block;
    width: 100%;
    height: 100%;
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

  const createLink = (route: Routes, label: string) => {
    let normalizedPathname: string;
    if (pathname.includes(Routes.UserProfile.split(':id')[0])) {
      normalizedPathname = Routes.Friends;
    } else if (pathname.includes(Routes.ListDetail.split(':id')[0])
      || pathname.includes(Routes.MountainDetail.split(':id')[0])) {
      normalizedPathname = Routes.Lists;
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
            {createLink(Routes.Dashboard, 'Dashboard')}
            {createLink(Routes.Lists, 'Lists')}
            {createLink(Routes.Friends, 'Friends')}
          </MainNav>
          <UserMenu
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            user={user}
          />
        </>
      );
    } else {
      return (
        <>
          <a href='/auth/google'>Login With Google</a>
        </>
      );
    }
  };
  return (
    <HeaderContainer>
      <LogoContainer to={Routes.Dashboard}>
        Wilderlist
        <Logo />
      </LogoContainer>
      <UserContext.Consumer
        children={renderProp}
      />
    </HeaderContainer>
  );
};

export default withRouter(Header);
