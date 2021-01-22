const {lineString, point, featureCollection} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
const centroid = require('@turf/centroid').default;
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  PeakListVariants,
  Trail,
} from '../../../types/graphQLTypes';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {CoreItem} from '../../../types/itemTypes';
import TripsNotesAndReports from '../../sharedComponents/detailComponents/TripsNotesAndReports';
import Weather from '../../sharedComponents/detailComponents/weather';

interface Props {
  id: Trail['id'];
  name: string;
  trails: Array<{
    id: Trail['id'];
    name: Trail['name'];
    type: Trail['type'];
    center: Trail['center'];
    line: Trail['line'];
  }>;
  stateAbbreviation: string;
}

const Content = (props: Props) => {
  const  {
    id, trails, stateAbbreviation, name,
  } = props;

  const getString = useFluent();

  const allPoints: any = [];
  const allLines: any = [];
  const trailsWithHikedCount: any[] = [];
  trails.forEach(t => {
    allPoints.push(point(t.center));
    allLines.push(lineString(t.line));
    trailsWithHikedCount.push({...t, hikedCount: 0});
  });

  const center = centroid(featureCollection(allPoints));
  const bbox = getBbox(featureCollection(allLines));

  const location = center.geometry.coordinates;

  return (
    <>
      <Weather
        forecastTabs={[
          {title: getString('weather-forecast-weather'), location},
        ]}
        snowReport={{location, stateAbbr: stateAbbreviation}}
      />
      <TripsNotesAndReports
        id={id}
        name={name}
        item={CoreItem.trail}
      />
      <MapRenderProp
        id={id}
        type={PeakListVariants.standard}
        bbox={bbox}
        trails={trailsWithHikedCount}
      />
    </>
  );
};

export default Content;
