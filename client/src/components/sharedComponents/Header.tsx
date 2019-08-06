import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../routing/routes';
import { User } from '../../types/graphQLTypes';
import { UserContext } from '../App';

const Header = () => {
  const renderProp = (user: User | null) => {
    if (user === null) {
      return null;
    } else if (user) {
      return (
        <>
          <a href='/api/logout'>Logout</a>
          <nav>
            <ul>
              <li><Link to={Routes.Dashboard}>Dashboard</Link></li>
              <li><Link to={Routes.Admin}>Admin Panel</Link></li>
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
    <div>
      <h1>Wilderlist</h1>
      <UserContext.Consumer
        children={renderProp}
      />
    </div>
  );
};

export default Header;
