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
import MoreInformationPanel from './moreInformationPanel';

interface Props {
  id: string;
  name: string;
  location: Coordinate;
}

const RoutesAndDirections = (props: Props) => {
  const {id, name, location} = props;
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: getString('global-text-details'),
      reactNode: <MoreInformationPanel id={id} />,
      customIcon: false,
      icon: faAlignLeft,
      renderHiddenContent: true,
    },
    {
      title: getString('detail-nearby-camping'),
      reactNode: (
        <RoutesToPoint
          id={id}
          coordinate={location}
          item={CoreItem.campsite}
          sourceType={CoreItem.campsite}
          destination={'campsites'}
        />
      ),
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
      panelId={'campsiteRoutesAndDirectionsPanelId'}
    />
  );
};

export default RoutesAndDirections;
