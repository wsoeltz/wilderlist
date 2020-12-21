import React from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
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
      <Helmet>
        <title>{'Admin Panel - Wilderlist'}</title>
      </Helmet>
      <h2>Admin Panel</h2>
      <AdminNav>
        <NavItem to={'/admin-regions'}>Regions</NavItem>
        <NavItem to={'/admin-states'}>States</NavItem>
        <NavItem to={'/admin-mountains'}>Mountains</NavItem>
        <NavItem to={'/admin-lists'}>Peak Lists</NavItem>
        <NavItem to={'/admin-users'}>Users</NavItem>
      </AdminNav>
    </Root>
  );
};

export default withRouter(AdminPanel);
