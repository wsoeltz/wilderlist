import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../routing/routes';
import { HeaderContainer } from '../../styling/Grid';
import { PermissionTypes, User } from '../../types/graphQLTypes';
import { UserContext } from '../App';

const Header = () => {
  const renderProp = (user: User | null) => {
    if (user === null) {
      return null;
    } else if (user) {
      const adminPanel = user.permissions === PermissionTypes.admin
        ? <li><Link to={Routes.Admin}>Admin Panel</Link></li> : null;
      return (
        <>
          <a href='/api/logout'>Logout</a>
          <nav>
            <ul>
              <li><Link to={Routes.Dashboard}>Dashboard</Link></li>
              {adminPanel}
            </ul>
          </nav>
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
      <h1>Wilderlist Dev</h1>
      <UserContext.Consumer
        children={renderProp}
      />
    </HeaderContainer>
  );
};

export default Header;
