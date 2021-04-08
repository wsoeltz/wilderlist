import {
  faAlignLeft,
  faChartArea,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import DetailSegment, {Panel} from '../../../sharedComponents/detailComponents/DetailSegment';
import DownloadGPX from './DownloadGPX';
import ElevationProfile from './ElevationProfile';
import TrailDetails from './TrailDetails';

interface Props {
  id: string;
}

const RoutesAndDirections = (props: Props) => {
  const {id} = props;
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: getString('trail-detail-elevation-profile'),
      reactNode: <ElevationProfile id={id} />,
      customIcon: false,
      icon: faChartArea,
    },
    {
      title: getString('global-text-details'),
      reactNode: <TrailDetails id={id} />,
      customIcon: false,
      icon: faAlignLeft,
      renderHiddenContent: true,
    },
    {
      title: getString('trail-detail-download-trail'),
      reactNode: <DownloadGPX id={id} />,
      customIcon: false,
      icon: faDownload,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
      panelId={'trailElevationProfilePanelId'}
    />
  );
};

export default RoutesAndDirections;
