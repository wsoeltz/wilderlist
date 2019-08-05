import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../routing/routes';

const AdminPanel = () => {
  return (
    <div>
      <h2>Admin Panel - Master</h2>
      <p>Please select an option</p>
      <nav>
        <ul>
          <li><Link to={Routes.AdminStates}>Admin States</Link></li>
          <li><Link to={Routes.AdminLists}>Admin Lists</Link></li>
          <li><Link to={Routes.AdminMountains}>Admin Mountains</Link></li>
          <li><Link to={Routes.AdminRegions}>Admin Regions</Link></li>
          <li><Link to={Routes.AdminUsers}>Admin Users</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminPanel;
