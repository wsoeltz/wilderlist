import {
  faChartPie,
  // faClock,
  // faHeart,
  faPercentage,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../hooks/useFluent';
import DetailSegment, {Panel} from '../sharedComponents/detailComponents/DetailSegment';
import HeatMapRenderProp from './HeatMapRenderProp';
import Progress from './Progress';
import Totals from './Totals';

const RoutesAndDirections = () => {
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: getString('global-text-value-progress'),
      reactNode: <Progress />,
      customIcon: false,
      icon: faPercentage,
    },
    {
      title: getString('global-text-value-totals'),
      reactNode: <Totals />,
      customIcon: false,
      icon: faChartPie,
    },
    // {
    //   title: getString('global-text-value-contributions'),
    //   reactNode: <div>contributions</div>,
    //   customIcon: false,
    //   icon: faHeart,
    // },
    // {
    //   title: getString('global-text-value-timeline'),
    //   reactNode: <div>timeline</div>,
    //   customIcon: false,
    //   icon: faClock,
    // },
  ];

  return (
    <>
      <DetailSegment
        panels={panels}
        panelId={'userStatsPanel'}
      />
      <HeatMapRenderProp />
    </>
  );
};

export default RoutesAndDirections;
