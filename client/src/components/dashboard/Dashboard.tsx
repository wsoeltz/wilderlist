import { faList, faStar } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../hooks/useFluent';
import {HighlightedIconInText} from '../../styling/styleUtils';
import DetailSegment, {Panel} from '../sharedComponents/detailComponents/DetailSegment';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../sharedComponents/svgIcons';
import SavedCampsites from './SavedCampsites';
import SavedLists from './SavedLists';
import SavedMountains from './SavedMountains';
import SavedTrails from './SavedTrails';

interface Props {
  userId: string;
}

const Dashboard = ({userId}: Props) => {
  const getString = useFluent();

  const panels: Panel[] = [
    {
      title: getString('header-text-menu-item-lists'),
      reactNode: <SavedLists userId={userId} />,
      customIcon: false,
      icon: faList,
    },
    {
      title: getString('global-text-value-mountains'),
      reactNode: <SavedMountains />,
      customIcon: true,
      icon: mountainNeutralSvg,
    },
    {
      title: getString('global-text-value-trails'),
      reactNode: <SavedTrails />,
      customIcon: true,
      icon: trailDefaultSvg,
    },
    {
      title: getString('global-text-value-campsites'),
      reactNode: <SavedCampsites />,
      customIcon: true,
      icon: tentNeutralSvg,
    },
  ];
  return (
    <>
      <Helmet>
        <title>{getString('meta-data-dashboard-default-title')}</title>
      </Helmet>
      <h1>
        <HighlightedIconInText icon={faStar} /> &nbsp;{getString('dashboard-title')}
      </h1>
      <br />
      <DetailSegment
        panels={panels}
        panelId={'userDashboardPanel'}
      />
    </>
  );
};

export default Dashboard;
