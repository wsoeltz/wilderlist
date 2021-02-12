import {
  faCar,
  faRoute,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {Coordinate} from '../../../types/graphQLTypes';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import RoutesToMe from '../../sharedComponents/detailComponents/routesToMe';
import {tentNeutralSvg} from '../../sharedComponents/svgIcons';

interface Props {
  location: Coordinate;
}

const RoutesAndDirections = (props: Props) => {
  const {location} = props;
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: getString('detail-route-to-summit'),
      reactNode: <RoutesToMe coordinate={location} />,
      customIcon: false,
      icon: faRoute,
    },
    {
      title: getString('detail-nearby-camping'),
      reactNode: <div>Camping</div>,
      customIcon: true,
      icon: tentNeutralSvg,
    },
    {
      title: getString('global-text-value-directions'),
      reactNode: <div>{location}</div>,
      customIcon: false,
      icon: faCar,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
      panelId={'tripsNotesAndReportsPanelId'}
    />
  );
};

export default RoutesAndDirections;
