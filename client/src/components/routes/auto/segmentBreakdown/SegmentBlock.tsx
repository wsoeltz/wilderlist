const along = require('@turf/along').default;
import {
  faChartLine,
  faShoePrints,
} from '@fortawesome/free-solid-svg-icons';
import upperFirst from 'lodash/upperFirst';
import {Types} from 'mongoose';
import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {SegmentFeature} from '../../../../hooks/servicesHooks/pathfinding/simpleCache';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import {trailDetailLink} from '../../../../routing/Utils';
import {CoreItem, MapItem} from '../../../../types/itemTypes';
import {slopeToSteepnessClass} from '../../../../utilities/trailUtils';
import {
  ContentRoot,
  IconBullet,
  ListItem,
  ListText,
  SegementLine,
  SegmentRoot,
} from './styleUtils';

interface Props {
  segment: SegmentFeature;
  minHeight: number;
}

const ParkingBlock = (props: Props) => {
  const {segment: {properties: {
    id, routeLength, name, type, avgSlope,
  }}, segment, minHeight} = props;

  const getString = useFluent();
  const mapContext = useMapContext();

  const isTrail =
    Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;

  let segmentName: string;
  const formattedType =
    getString('global-formatted-anything-type', {type});
  if (name) {
    segmentName = name;
  } else {
    segmentName = upperFirst(formattedType);
  }

  const segmentLengthText = routeLength < 0.1
    ? getString('distance-feet-formatted', {feet: Math.round(routeLength * 5280)}) // miles to feet conversion
    : getString('directions-driving-distance', {miles: parseFloat(routeLength.toFixed(1))});

  const onMouseLeave = () => {
    if (mapContext.intialized) {
      mapContext.clearExternalHoveredPopup();
    }
  };
  const onMouseEnter = () => {
    if (mapContext.intialized) {
    mapContext.setExternalHoveredPopup(
        segmentName,
        isTrail ? CoreItem.trail : MapItem.vehicleRoad,
        segmentLengthText,
        along(segment, routeLength / 2, {units: 'miles'}).geometry.coordinates,
      );
    }
  };
  useEffect(() => {
    return () => {
      if (mapContext.intialized) {
        mapContext.clearExternalHoveredPopup();
      }
    };
  }, [mapContext]);

  const title = isTrail
    ? (
      <Link
        to={trailDetailLink(id)}
      >
        {segmentName}
      </Link>
    ) : (<>{segmentName}</>);

  const incline = avgSlope !== undefined && avgSlope !== null && routeLength >= 0.1 ? (
    <ListItem>
      <IconBullet icon={faChartLine} />
        {upperFirst(slopeToSteepnessClass(avgSlope))},
        &nbsp;&nbsp;
        {parseFloat(avgSlope.toFixed(1))}°
    </ListItem>
  ) : null;

  const lengthEl = routeLength < 0.1 ? (
    <ListItem style={{fontSize: '0.75rem'}}>
      {segmentLengthText}
    </ListItem>
  ) : (
    <ListItem>
      <IconBullet icon={faShoePrints} />
      {segmentLengthText}
    </ListItem>
  );

  return (
    <SegmentRoot
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        minHeight,
        padding: routeLength < 0.1 ? '0.7rem 1rem' : undefined,
        fontSize: routeLength < 0.1 ? '0.875rem' : undefined,
      }}
    >
      <SegementLine />
      <div>
        <ContentRoot>
          <div>
            {title}
          </div>
        </ContentRoot>
        <ContentRoot>
          <ListText>
            {lengthEl}
            {incline}
          </ListText>
        </ContentRoot>
      </div>
    </SegmentRoot>
  );
};

export default ParkingBlock;
