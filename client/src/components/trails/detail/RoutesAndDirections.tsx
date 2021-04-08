import {
  faCar,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {Coordinate} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import PanelDirections from '../../sharedComponents/detailComponents/directions/PanelDirections';
import RoutesToPoint from '../../sharedComponents/detailComponents/routesToPoint';
import {mountainNeutralSvg, tentNeutralSvg} from '../../sharedComponents/svgIcons';

interface Props {
  id: string;
  start: Coordinate;
  center: Coordinate;
  end: Coordinate;
}

const RoutesAndDirections = (props: Props) => {
  const {start, center, end, id} = props;
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: getString('detail-nearby-mountains'),
      reactNode: (
        <RoutesToPoint
          id={id}
          coordinate={start}
          altCoordinate={end}
          item={CoreItem.trail}
          sourceType={CoreItem.trail}
          destination={'mountains'}
        />
      ),
      customIcon: true,
      icon: mountainNeutralSvg,
      renderHiddenContent: true,
    },
    {
      title: getString('detail-nearby-camping'),
      reactNode: (
        <RoutesToPoint
          id={id}
          coordinate={start}
          altCoordinate={end}
          item={CoreItem.campsite}
          sourceType={CoreItem.trail}
          destination={'campsites'}
        />
      ),
      customIcon: true,
      icon: tentNeutralSvg,
      renderHiddenContent: true,
    },
    {
      title: getString('global-text-value-directions'),
      reactNode: <PanelDirections destination={center} />,
      customIcon: false,
      icon: faCar,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
      panelId={'trailRoutesAndDirectionsPanelId'}
    />
  );
};

export default RoutesAndDirections;
