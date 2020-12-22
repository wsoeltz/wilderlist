import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faFacebook,
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { Routes } from '../../../routing/routes';
import { userProfileLink } from '../../../routing/Utils';
import {
  baseColor,
  ButtonPrimary,
  lightBorderColor,
  lightFontWeight,
  tertiaryColor,
} from '../../../styling/styleUtils';
import { User } from '../../../types/graphQLTypes';
import {mobileSize} from '../../../Utils';
import { AppContext } from '../../App';
import {
  BrandIcon as BrandIconBase,
  facebookBlue,
  googleBlue,
  LoginButtonBase,
  LoginText as LoginTextBase,
  redditRed,
} from '../../sharedComponents/SignUpModal';
import AddAscentButton from './toolsAndSettings/AddAscentButton';

const UserMenu = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

const UserMenuListContainer = styled.div`
  position: absolute;
  z-index: 500;
  bottom: 0;
  right: 0;
  transform: translateY(100%);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  min-width: 200px;
  box-shadow: 0 1px 3px 1px #d1d1d1;

  @media(max-width: ${mobileSize}px) {
    width: 100vw;
  }
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


  @media(max-width: ${mobileSize}px) {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    min-height: 45px;
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
  border-radius: 1000px;
  max-width: 28px;
`;

const LoginOrSignUpMenuButton = styled(ButtonPrimary)`
  padding: 0.45rem 0.75rem;
  margin-right: 0.75rem;
`;

const LoginButton = styled(LoginButtonBase)`
  min-width: 0;
  height: 100%;
  border-radius: 0;
  border: none;
  margin: 0;
`;

const LoginButtonListItem = styled(LoginButtonBase)`
  margin: 0;
  border-radius: 0;
  width: 160px;

  @media(max-width: ${mobileSize}px) {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    min-height: 45px;
    width: 100%;
    max-width: 100%;
  }
`;

const BrandIcon = styled(BrandIconBase)`
  font-size: 0.9rem;

  @media(max-width: ${mobileSize}px) {
    padding: 8px 0;
    font-size: 1.5rem;
  }
`;
const LoginText = styled(LoginTextBase)`
  font-size: 0.9em;
`;

const Caret = styled(FontAwesomeIcon)`
  margin-left: 0.5rem;
`;

const AddAscentButtonContainer = styled.div`
  height: 100%;
  border-left: solid 1px ${lightBorderColor};
  border-right: solid 1px ${lightBorderColor};
  display: flex;
  align-items: center;
`;

interface UserMenuListProps {
  user: User | null;
  closeUserMenu: () => void;
}

const UserMenuList = ({user, closeUserMenu}: UserMenuListProps) => {
  const node = useRef<HTMLDivElement | null>(null);
  const userId = user !== null ? user._id : 'none';
  const getString = useFluent();
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
  if (user) {
    return (
      <UserMenuListContainer ref={node} onClick={closeUserMenu}>
        <UserMenuLink to={userProfileLink(userId)}>
          {getString('header-text-menu-my-profile')}
        </UserMenuLink>
        <UserMenuLink to={Routes.UserSettings}>
          {getString('header-text-menu-settings')}
        </UserMenuLink>
        <UserMenuLink to={Routes.About}>
          {getString('header-text-menu-item-about')}
        </UserMenuLink>
        <UserMenuLink to={Routes.PrivacyPolicy}>
          {getString('header-text-menu-privacy-policy')}
        </UserMenuLink>
        <UserMenuLink to={Routes.TermsOfUse}>
          {getString('header-text-menu-terms-of-use')}
        </UserMenuLink>
        <UserMenuAnchor href='/api/logout'>
          {getString('header-text-menu-item-logout')}
        </UserMenuAnchor>
      </UserMenuListContainer>
    );
  } else {
    return (
      <UserMenuListContainer ref={node} onClick={closeUserMenu}>
        <LoginButtonListItem href='/auth/google'>
          <BrandIcon
            icon={faGoogle as IconDefinition}
            style={{color: googleBlue}}
          />
          <LoginText>
            {getString('header-text-login-with-google')}
          </LoginText>
        </LoginButtonListItem>
        <LoginButtonListItem href='/auth/facebook'>
          <BrandIcon
            icon={faFacebook as IconDefinition}
            style={{color: facebookBlue}}
          />
          <LoginText>
            {getString('header-text-login-with-facebook')}
          </LoginText>
        </LoginButtonListItem>
        <LoginButtonListItem href='/auth/reddit'>
          <BrandIcon
            icon={faReddit as IconDefinition}
            style={{color: redditRed}}
          />
          <LoginText>
            {getString('header-text-login-with-reddit')}
          </LoginText>
        </LoginButtonListItem>
      </UserMenuListContainer>
    );
  }
};

interface Props {
  userMenuOpen: boolean;
  setUserMenuOpen: (value: boolean | ((curr: boolean) => boolean)) => void;
  user: User | null;
}

const UserMenuComponent = (props: Props) => {
  const {
    userMenuOpen, setUserMenuOpen, user,
  } = props;

  const userMenuButtonEl = useRef<HTMLDivElement | null>(null);
  const { windowWidth } = useContext(AppContext);
  const getString = useFluent();
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

  const closeUserMenu = useCallback(() => setUserMenuOpen(false), [setUserMenuOpen]);
  const toggleUserMenu = useCallback(() => setUserMenuOpen(curr => !curr), [setUserMenuOpen]);

  let output: React.ReactElement<any> | null;
  if (user) {
    const userMenuList = userMenuOpen === true
      ? (
        <UserMenuList
          user={user}
          closeUserMenu={closeUserMenu}
         />
      ) : null;

    const addAscentButton = windowWidth < mobileSize ? (
      <AddAscentButtonContainer>
        <AddAscentButton />
      </AddAscentButtonContainer>
    ) : null;
    output = (
      <UserMenu>
        {addAscentButton}
        <UserButton
          onClick={toggleUserMenu}
        >
          <UserImage src={user.profilePictureUrl} />
          <Caret icon={userMenuOpen === true ? 'caret-up' : 'caret-down'} />
        </UserButton>
        {userMenuList}
      </UserMenu>
    );
  } else if (user === '') {
    if (windowWidth > mobileSize) {
      output = (
        <UserMenu>
          <LoginButton href='/auth/google'>
            <BrandIcon
              icon={faGoogle as IconDefinition}
              style={{color: googleBlue}}
            />
            <LoginText>
              {getString('header-text-login-with-google')}
            </LoginText>
          </LoginButton>
          <LoginButton href='/auth/facebook'>
            <BrandIcon
              icon={faFacebook as IconDefinition}
              style={{color: facebookBlue}}
            />
            <LoginText>
              {getString('header-text-login-with-facebook')}
            </LoginText>
          </LoginButton>
          <LoginButton href='/auth/reddit'>
            <BrandIcon
              icon={faReddit as IconDefinition}
              style={{color: redditRed}}
            />
            <LoginText>
              {getString('header-text-login-with-reddit')}
            </LoginText>
          </LoginButton>
        </UserMenu>
      );
    } else {
      const userMenuList = userMenuOpen === true
        ? (
          <UserMenuList
            user={null}
            closeUserMenu={() => setUserMenuOpen(false)}
           />
        ) : null;

      output = (
        <UserMenu>
          <LoginOrSignUpMenuButton
            onClick={toggleUserMenu}
          >
            {getString('header-text-login-or-sign-up')}
          </LoginOrSignUpMenuButton>
          {userMenuList}
        </UserMenu>
      );
    }

  } else {
    output = null;
  }
  return (
    <div ref={userMenuButtonEl}>
      {output}
    </div>
  );
};

export default UserMenuComponent;
