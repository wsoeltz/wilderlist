import {
  faCar,
  faRoute,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {Coordinate} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import RoutesToPoint from '../../sharedComponents/detailComponents/routesToPoint';
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
      reactNode: <RoutesToPoint coordinate={location} item={CoreItem.mountain} />,
      customIcon: false,
      icon: faRoute,
    },
    {
      title: getString('detail-nearby-camping'),
      reactNode: <RoutesToPoint coordinate={location} item={CoreItem.campsite} destination={'campsites'} />,
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
