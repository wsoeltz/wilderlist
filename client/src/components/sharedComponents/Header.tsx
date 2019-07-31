import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../routing/routes';

const Header = () => {
  return (
    <>
      <h1>Wilderlist Dev</h1>
      <a href='/auth/google'>Login With Google</a>
      <nav>
        <ul>
          <li><Link to={Routes.Dashboard}>Dashboard</Link></li>
          <li><Link to={Routes.Admin}>Admin Panel</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
