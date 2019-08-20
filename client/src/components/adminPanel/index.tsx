import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../routing/routes';
import { PreContentHeaderFull } from '../../styling/Grid';

const AdminPanel = () => {
  return (
    <PreContentHeaderFull>
      <h2>Admin Panel - Dev</h2>
      <p>Please select an option</p>
      <nav>
        <ul>
          <li><Link to={Routes.AdminStates}>States</Link></li>
          <li><Link to={Routes.AdminPeakLists}>Peak Lists</Link></li>
          <li><Link to={Routes.AdminMountains}>Mountains</Link></li>
          <li><Link to={Routes.AdminRegions}>Regions</Link></li>
          <li><Link to={Routes.AdminUsers}>Users</Link></li>
        </ul>
      </nav>
    </PreContentHeaderFull>
  );
};

export default AdminPanel;
