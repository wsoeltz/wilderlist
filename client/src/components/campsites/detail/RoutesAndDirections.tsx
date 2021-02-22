import {
  faAlignLeft,
  faCar,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {Coordinate} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import PanelDirections from '../../sharedComponents/detailComponents/directions/PanelDirections';
import RoutesToPoint from '../../sharedComponents/detailComponents/routesToPoint';
import {tentNeutralSvg} from '../../sharedComponents/svgIcons';

interface Props {
  name: string;
  type: string;
  location: Coordinate;
}

const RoutesAndDirections = (props: Props) => {
  const {name, type, location} = props;
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: type + ' ' + getString('global-text-details'),
      reactNode: <div />,
      customIcon: false,
      icon: faAlignLeft,
      renderHiddenContent: true,
    },
    {
      title: getString('detail-nearby-camping'),
      reactNode: <RoutesToPoint coordinate={location} item={CoreItem.campsite} destination={'campsites'} />,
      customIcon: true,
      icon: tentNeutralSvg,
      renderHiddenContent: true,
    },
    {
      title: getString('global-text-value-directions'),
      reactNode: <PanelDirections destination={location} considerDirect={true} destinationName={name} />,
      customIcon: false,
      icon: faCar,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
      panelId={'routesAndDirectionsPanelId'}
    />
  );
};

export default RoutesAndDirections;
