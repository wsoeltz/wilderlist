import {
  faCar,
  faRoute,
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
  id: string;
  location: Coordinate;
}

const RoutesAndDirections = (props: Props) => {
  const {id, location} = props;
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: getString('detail-route-to-summit'),
      reactNode: (
        <RoutesToPoint
          id={id}
          coordinate={location}
          item={CoreItem.mountain}
          sourceType={CoreItem.mountain}
        />
      ),
      customIcon: false,
      icon: faRoute,
      renderHiddenContent: true,
    },
    {
      title: getString('detail-nearby-camping'),
      reactNode: (
        <RoutesToPoint
          id={id}
          coordinate={location}
          item={CoreItem.campsite}
          sourceType={CoreItem.mountain}
          destination={'campsites'}
        />
      ),
      customIcon: true,
      icon: tentNeutralSvg,
      renderHiddenContent: true,
    },
    {
      title: getString('global-text-value-directions'),
      reactNode: <PanelDirections destination={location} />,
      customIcon: false,
      icon: faCar,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
      panelId={'mountainRoutesAndDirectionsPanelId'}
    />
  );
};

export default RoutesAndDirections;
