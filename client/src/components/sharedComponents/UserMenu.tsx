import {
  faFacebook,
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
// import raw from 'raw.macro';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Routes } from '../../routing/routes';
import { comparePeakListLink } from '../../routing/Utils';
import { smallHeaderBreakpoint } from '../../styling/Grid';
import {
  baseColor,
  lightBorderColor,
  lightFontWeight,
  tertiaryColor,
} from '../../styling/styleUtils';
import { PermissionTypes, User } from '../../types/graphQLTypes';
import {
  BrandIcon as BrandIconBase,
  facebookBlue,
  googleBlue,
  LoginButtonBase,
  LoginText as LoginTextBase,
  redditRed,
} from '../login';

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

const loginButtonMediumSmallScreen = 850; // in px
const loginButtonSmallScreen = 630; // in px

const LoginButton = styled(LoginButtonBase)`
  &:not(:last-child) {
    margin-right: 0;
  }

  @media(max-width: ${loginButtonMediumSmallScreen}px) {
    margin: auto 10px;
    min-width: 122px;
  }

  @media(max-width: ${loginButtonSmallScreen}px) {
    margin: auto 5px;
    min-width: 65px;
  }
`;
const BrandIcon = styled(BrandIconBase)`
  @media(max-width: ${loginButtonMediumSmallScreen}px) {
    font-size: 16px;
    margin-left: 4px;
  }

  @media(max-width: ${loginButtonSmallScreen}px) {
    font-size: 14px;
    padding: 4px 0;
  }
`;
const LoginText = styled(LoginTextBase)`
  @media(max-width: ${loginButtonMediumSmallScreen}px) {
    font-size: 10px;
    padding: 6px;
  }

  @media(max-width: ${loginButtonSmallScreen}px) {
    font-size: 0;
    padding: 0;

    &:after {
      content: 'Sign in';
      font-size: 10px;
      padding: 6px;
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
  const userMenuButtonEl = useRef<HTMLDivElement | null>(null);

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

  let output: React.ReactElement<any>;
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

    output = (
      <UserMenu>
        <UserButton

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

    output = (
      <UserMenu>
        <LoginButton href='/auth/google'>
          <BrandIcon
            icon={faGoogle}
            style={{color: googleBlue}}
          />
          <LoginText>
            {props.getFluentString('header-text-login-with-google')}
          </LoginText>
        </LoginButton>
        <LoginButton href='/auth/facebook'>
          <BrandIcon
            icon={faFacebook}
            style={{color: facebookBlue}}
          />
          <LoginText>
            {props.getFluentString('header-text-login-with-facebook')}
          </LoginText>
        </LoginButton>
        <LoginButton href='/auth/reddit'>
          <BrandIcon
            icon={faReddit}
            style={{color: redditRed}}
          />
          <LoginText>
            {props.getFluentString('header-text-login-with-reddit')}
          </LoginText>
        </LoginButton>
      </UserMenu>
    );
  }
  return (
    <div ref={userMenuButtonEl}>
      {output}
    </div>
  );
};

export default UserMenuComponent;
