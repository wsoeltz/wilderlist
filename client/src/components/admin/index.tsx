import {faList, faUser} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import { PermissionTypes } from '../../types/graphQLTypes';
import PageNotFound from '../sharedComponents/404';
import DetailSegment, {Panel} from '../sharedComponents/detailComponents/DetailSegment';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../sharedComponents/svgIcons';
import AdminCampsites from './campsites';
import AdminLists from './lists';
import AdminMountains from './mountains';
import AdminTrails from './trails';
import AdminUsers from './users';

const AdminPanel = () => {
  const user = useCurrentUser();

  if (!user || user.permissions !== PermissionTypes.admin) {
    return <PageNotFound />;
  }

  const panels: Panel[] = [
    {
      title: 'Users',
      reactNode: (
        <AdminUsers
        />
      ),
      icon: faUser,
      customIcon: false,
    },
    {
      title: 'Lists',
      reactNode: (
        <AdminLists
        />
      ),
      icon: faList,
      customIcon: false,
    },
    {
      title: 'Mountains',
      reactNode: (
        <AdminMountains
        />
      ),
      icon: mountainNeutralSvg,
      customIcon: true,
    },
    {
      title: 'Trails',
      reactNode: (
        <AdminTrails
        />
      ),
      icon: trailDefaultSvg,
      customIcon: true,
    },
    {
      title: 'Campsites',
      reactNode: (
        <AdminCampsites
        />
      ),
      icon: tentNeutralSvg,
      customIcon: true,
    },
  ];

  return (
    <>
      <h1>Admin Panel</h1>
      <DetailSegment
        panels={panels}
        panelId={'AdminPanelPanels'}
      />
    </>
  );

};

export default AdminPanel;
