import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Routes } from '../../routing/routes';
import {
  baseColor,
  lightBorderColor,
  lightFontWeight,
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
`;

const UserButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.15rem;
  padding: 1rem;
  font-weight: ${lightFontWeight};

  &:focus {
    outline: none;
  }
`;

const UserMenuListContainer = styled.div`
  position: absolute;
  z-index: 500;
  bottom: 0;
  transform: translateY(100%);
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 1.5rem;
  box-sizing: border-box;
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

const Caret = styled(FontAwesomeIcon)`
  margin-left: 0.6rem;
`;

interface UserMenuListProps {
  adminPanel: React.ReactElement<any> | null;
  closeUserMenu: () => void;
}

const UserMenuList = ({adminPanel, closeUserMenu}: UserMenuListProps) => {
  const node = useRef<HTMLDivElement | null>(null);

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
      {adminPanel}
      <UserMenuAnchor href='/api/logout'>Logout</UserMenuAnchor>
    </UserMenuListContainer>
  );
};

interface UserMenuComponentProps {
  userMenuOpen: boolean;
  setUserMenuOpen: (value: boolean) => void;
  user: User;
}

const UserMenuComponent = (props: UserMenuComponentProps) => {
  const {
    userMenuOpen, setUserMenuOpen, user,
  } = props;

  const adminPanel: React.ReactElement<any> | null = user.permissions === PermissionTypes.admin
    ? <UserMenuLink to={Routes.Admin}>Admin Panel</UserMenuLink> : null;
  const userMenuList = userMenuOpen === true
    ? <UserMenuList adminPanel={adminPanel} closeUserMenu={() => setUserMenuOpen(false)} /> : null;

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

  return (
    <UserMenu>
      <UserButton
        ref={userMenuButtonEl}
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        Kyle Soeltz
        <Caret icon={userMenuOpen === true ? 'caret-up' : 'caret-down'} />
      </UserButton>
      {userMenuList}
    </UserMenu>
  );
};

export default UserMenuComponent;
