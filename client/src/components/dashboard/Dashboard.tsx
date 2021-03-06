import { faList, faStar } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../hooks/useFluent';
import {HighlightedIconInText} from '../../styling/styleUtils';
import DetailSegment, {Panel} from '../sharedComponents/detailComponents/DetailSegment';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../sharedComponents/svgIcons';
import SavedLists from './SavedLists';
import SavedMountains from './SavedMountains';

interface Props {
  userId: string;
}

const Dashboard = ({userId}: Props) => {
  const getString = useFluent ();

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
      reactNode: <div>Trails</div>,
      customIcon: true,
      icon: trailDefaultSvg,
    },
    {
      title: getString('global-text-value-campsites'),
      reactNode: <div>Campsites</div>,
      customIcon: true,
      icon: tentNeutralSvg,
    },
  ];
  return (
    <>
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
