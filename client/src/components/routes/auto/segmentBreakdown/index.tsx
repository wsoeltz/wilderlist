import {faRoute} from '@fortawesome/free-solid-svg-icons';
import {scaleLinear} from 'd3-scale';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {Destination, SegmentFeature} from '../../../../hooks/servicesHooks/pathfinding/simpleCache';
import useFluent from '../../../../hooks/useFluent';
import {Routes} from '../../../../routing/routes';
import {Coordinate} from '../../../../types/graphQLTypes';
import {CoreItem} from '../../../../types/itemTypes';
import DetailSegment, {Panel} from '../../../sharedComponents/detailComponents/DetailSegment';
import ItemBlock from './ItemBlock';
import ParkingBlock from './ParkingBlock';
import SegmentBlock from './SegmentBlock';

interface Props {
  sourceDatum: {
    id: string;
    name: string;
    elevation?: number;
    location: Coordinate;
    itemType: CoreItem;
  };
  sourceRoute: Routes;
  segments: SegmentFeature[];
  destination: Destination;
}

const SegmentBreakdown = (props: Props) => {
  const {sourceRoute, destination, sourceDatum, segments} = props;
  const getString = useFluent();

  let startingBlock: React.ReactElement<any> | null;
  let endingBlock: React.ReactElement<any> | null;
  if (sourceRoute === Routes.AutoRouteDetailParkingToMountain) {
    startingBlock = (
      <ParkingBlock
        destination={destination}
      />
    );
    endingBlock = (
      <ItemBlock
        destination={sourceDatum}
        end={true}
      />
    );
  } else {
    const startDatum = sourceDatum.itemType === CoreItem.trail ? {
      ...sourceDatum,
      location: segments[0].geometry.coordinates[0] as any as Coordinate,
    } : sourceDatum;

    startingBlock = (
      <ItemBlock
        destination={startDatum}
        end={false}
      />
    );

    let destinationName: string;
    const formattedType =
      upperFirst(getString('global-formatted-anything-type', {type: destination.type}));
    if (destination.name) {
      destinationName = destination.name;
    } else {
      destinationName = formattedType;
    }
    let elevation: number;
    if (destination.elevation !== undefined && destination.elevation !== null) {
      elevation = destination.elevation;
    } else {
      elevation = segments[segments.length - 1]
        .geometry.coordinates[segments[segments.length - 1]
        .geometry.coordinates.length - 1][2];
    }
    const itemType = sourceRoute === Routes.AutoRouteDetailTrailToMountain ? CoreItem.mountain : CoreItem.campsite;
    const endDatum = {
      id: sourceDatum.id,
      name: destinationName,
      elevation,
      itemType,
      location: destination.location,
    };
    endingBlock = (
      <ItemBlock
        destination={endDatum}
        end={true}
      />
    );
  }

  const max = Math.max(...segments.map(s => s.properties.routeLength));
  const lengthScale = scaleLinear().domain([0.1, max]).range([0, 300]);
  const segmentBlocks = segments.map((s, i) => (
    <SegmentBlock
      key={sourceRoute + sourceDatum.id + s.properties.id + i}
      segment={s}
      minHeight={lengthScale(s.properties.routeLength)}
    />
  ));

  const panel: Panel = {
    title: getString('global-text-details'),
    reactNode: (
      <>
        {startingBlock}
        {segmentBlocks}
        {endingBlock}
      </>
    ),
    customIcon: false,
    icon: faRoute,
  };

  return (
    <DetailSegment
      panelId={'auto-route-detail-panel'}
      panels={[panel]}
    />
  );
};

export default SegmentBreakdown;
