import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Routes } from '../../routing/routes';
import { PreContentHeaderFull } from '../../styling/Grid';
import { standardContainerPadding } from '../../styling/styleUtils';

const Root = styled(PreContentHeaderFull)`
  padding: ${standardContainerPadding};
`;

const AdminNav = styled.nav`
  display: flex;
`;

const NavItem = styled(Link)`
  margin-right: 1rem;
`;

const AdminPanel = () => {
  return (
    <Root>
      <h2>Admin Panel</h2>
      <AdminNav>
        <NavItem to={Routes.AdminRegions}>Regions</NavItem>
        <NavItem to={Routes.AdminStates}>States</NavItem>
        <NavItem to={Routes.AdminMountains}>Mountains</NavItem>
        <NavItem to={Routes.AdminPeakLists}>Peak Lists</NavItem>
        <NavItem to={Routes.AdminUsers}>Users</NavItem>
      </AdminNav>
    </Root>
  );
};

export default withRouter(AdminPanel);
