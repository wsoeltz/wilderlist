import {
  faChartArea,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {Feature} from '../../../../hooks/servicesHooks/pathfinding/simpleCache';
import useFluent from '../../../../hooks/useFluent';
import DetailSegment, {Panel} from '../../../sharedComponents/detailComponents/DetailSegment';
import DownloadGPX from './DownloadGPX';
import ElevationProfile from './ElevationProfile';

interface Props {
  id: string;
  title: string;
  feature: Feature;
}

const RoutesAndDirections = (props: Props) => {
  const {id, title, feature} = props;
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: getString('trail-detail-elevation-profile'),
      reactNode: <ElevationProfile chartUniqueId={id} feature={feature} />,
      customIcon: false,
      icon: faChartArea,
    },
    {
      title: getString('trail-detail-download-route'),
      reactNode: <DownloadGPX title={title} line={feature.geometry.coordinates} />,
      customIcon: false,
      icon: faDownload,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
      panelId={'routeElevationProfilePanelId'}
    />
  );
};

export default RoutesAndDirections;
