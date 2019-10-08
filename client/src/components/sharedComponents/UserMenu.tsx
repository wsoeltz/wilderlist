import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import raw from 'raw.macro';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Routes } from '../../routing/routes';
import { comparePeakListLink } from '../../routing/Utils';
import { smallHeaderBreakpoint } from '../../styling/Grid';
import {
  baseColor,
  lightBaseColor,
  lightBorderColor,
  lightFontWeight,
  semiBoldFontBoldWeight,
  tertiaryColor,
} from '../../styling/styleUtils';
import { PermissionTypes, User } from '../../types/graphQLTypes';

const UserMenu = styled.div`
  min-width: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 1rem;
    bottom: 1rem;
    width: 1px;
    background-color: ${lightBorderColor};
  }

  @media(max-width: ${smallHeaderBreakpoint}px) {
    min-width: 50px;
  }
`;

const UserButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.15rem;
  padding: 1rem;
  font-weight: ${lightFontWeight};
  display: flex;
  align-items: center;

  &:focus {
    outline: none;
  }
`;

const UserName = styled.span`
  @media(max-width: ${smallHeaderBreakpoint}px) {
    display: none;
  }
`;

const UserMenuListContainer = styled.div`
  position: absolute;
  z-index: 500;
  bottom: 0;
  right: 0;
  transform: translateY(100%);
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 1.5rem;
  box-sizing: border-box;
  min-width: 200px;
`;

const userMenuLinkStyles = `
  width: 100%;
  background-color: #fff;
  border: solid 1px ${lightBorderColor};
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: ${baseColor};
  font-size: 0.9rem;

  &:hover {
    color: ${baseColor};
    background-color: ${tertiaryColor};
  }

  &:not(:first-child) {
    border-top: none;
  }
`;

const UserMenuLink = styled(Link)`
  ${userMenuLinkStyles}
`;

const UserMenuAnchor = styled.a`
  ${userMenuLinkStyles}
`;

const UserImage = styled.img`
  display: inline-block;
  margin-right: 1rem;
  border-radius: 1000px;
  max-width: 30px;

  @media(max-width: ${smallHeaderBreakpoint}px) {
    margin-right: 0;
  }
`;

export const LoginWithGoogleButton = styled.a`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  grid-area: google-btn;
  margin: auto 20px;
  max-height: 40px;
  max-width: 200px;
  text-decoration: none;

  &:hover {
    background-color: #efefef;
  }

  svg {

    rect {
      fill: none;
    }
    text {
      fill: ${lightBaseColor};
      font-size: 14px;
      font-weight: ${semiBoldFontBoldWeight};
    }
  }

`;

const Caret = styled(FontAwesomeIcon)`
  margin-left: 0.6rem;
`;

interface UserMenuListProps {
  user: User;
  adminPanel: React.ReactElement<any> | null;
  closeUserMenu: () => void;
  getFluentString: GetString;
}

const UserMenuList = ({user, adminPanel, closeUserMenu, getFluentString}: UserMenuListProps) => {
  const node = useRef<HTMLDivElement | null>(null);
  const userId = user !== null ? user._id : 'none';
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      if (!(node !== null && node.current !== null && node.current.contains(element))) {
        closeUserMenu();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });
  return (
    <UserMenuListContainer ref={node} onClick={closeUserMenu}>
      <UserMenuLink to={comparePeakListLink(userId, 'none')}>
        {getFluentString('header-text-menu-my-profile')}
      </UserMenuLink>
      <UserMenuLink to={Routes.UserSettings}>
        {getFluentString('header-text-menu-settings')}
      </UserMenuLink>
      <UserMenuLink to={Routes.PrivacyPolicy}>
        {getFluentString('header-text-menu-privacy-policy')}
      </UserMenuLink>
      {adminPanel}
      <UserMenuAnchor href='/api/logout'>
        {getFluentString('header-text-menu-item-logout')}
      </UserMenuAnchor>
    </UserMenuListContainer>
  );
};

interface UserMenuComponentProps {
  userMenuOpen: boolean;
  setUserMenuOpen: (value: boolean) => void;
  user: User;
  getFluentString: GetString;
}

type Props = UserMenuComponentProps |
  { user: null,  getFluentString: GetString };

const UserMenuComponent = (props: Props) => {
  const userMenuButtonEl = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (userMenuButtonEl.current !== null) {
      const el = userMenuButtonEl.current;
      const preventClickFromPropagating = (e: MouseEvent) => {
        e.stopPropagation();
      };
      el.addEventListener('mousedown', preventClickFromPropagating);
      return () => el.removeEventListener('mousedown', preventClickFromPropagating);
    }
  }, [userMenuButtonEl]);

  if (props.user) {
    const {
      userMenuOpen, setUserMenuOpen, user, getFluentString,
    } = props;

    const adminPanel: React.ReactElement<any> | null = user.permissions === PermissionTypes.admin
      ? (
          <UserMenuLink to={Routes.Admin}>
            {getFluentString('header-text-menu-item-admin-panel')}
          </UserMenuLink>
        )
      : null;
    const userMenuList = userMenuOpen === true
      ? (
          <UserMenuList
            user={user}
            adminPanel={adminPanel}
            closeUserMenu={() => setUserMenuOpen(false)}
            getFluentString={getFluentString} />
          )
      : null;

    return (
      <UserMenu>
        <UserButton
          ref={userMenuButtonEl}
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <UserImage src={user.profilePictureUrl} />
          <UserName>
            {user.name}
          </UserName>
          <Caret icon={userMenuOpen === true ? 'caret-up' : 'caret-down'} />
        </UserButton>
        {userMenuList}
      </UserMenu>
    );
  } else {

    return (
      <UserMenu>
        <LoginWithGoogleButton href='/auth/google'
          dangerouslySetInnerHTML={{
            __html: raw('../../assets/images/google-signin-button/btn_google_light_normal_ios.svg'),
            }}
            title={props.getFluentString('header-text-login-with-google')}
        />
      </UserMenu>
    );
  }
};

export default UserMenuComponent;
