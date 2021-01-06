const {lineString, point, featureCollection} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
const centroid = require('@turf/centroid').default;
import { faCloudSun } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  DetailBox,
  InlineSectionContainer,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  DetailBoxTitle,
} from '../../../styling/styleUtils';
import {
  PeakListVariants,
  Trail,
} from '../../../types/graphQLTypes';
import WeatherReport from '../../mountains/detail/WeatherReport';
import MapRenderProp from '../../sharedComponents/MapRenderProp';

interface Props {
  id: Trail['id'];
  trails: Array<{
    id: Trail['id'];
    name: Trail['name'];
    type: Trail['type'];
    center: Trail['center'];
    line: Trail['line'];
  }>;
}

const Content = (props: Props) => {
  const  {
    id, trails,
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

  const [longitude, latitude] = center.geometry.coordinates;

  return (
    <>
      <DetailBoxTitle>
        <BasicIconInText icon={faCloudSun} />
        {getString('weather-forecast-weather')}
      </DetailBoxTitle>
      <DetailBox>
        <InlineSectionContainer>
          <WeatherReport
            latitude={latitude}
            longitude={longitude}
          />
        </InlineSectionContainer>
      </DetailBox>
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
