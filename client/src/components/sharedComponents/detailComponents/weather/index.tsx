import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import {Coordinate} from '../../../../types/graphQLTypes';
import DetailSegment, {Panel} from '../DetailSegment';
import PointForecast from './pointForecast';
import SnowDepth from './pointForecast/snowDepth';

interface Props {
  forecastTabs: Array<{
    title: string;
    location: Coordinate;
  }>;
  snowReport?: {
    stateAbbr: string;
    location: Coordinate;
  };
}

const WeatherSegment = (props: Props) => {
  const {forecastTabs, snowReport} = props;
  const getString = useFluent();
  const panels: Panel[] = forecastTabs.map(f => {
    return {
      title: f.title,
      reactNode: <PointForecast latitude={f.location[1]} longitude={f.location[0]} />,
    };
  });

  if (snowReport) {
    panels.push({
      title: getString('snow-report-title'),
      reactNode: (
        <SnowDepth
          latitude={snowReport.location[1]}
          longitude={snowReport.location[0]}
          stateAbbr={snowReport.stateAbbr}
        />
      ),
    });
  }

  return (
    <DetailSegment
      panels={panels}
      panelId={'weatherSegmentPanelId'}
    />
  );
};

export default WeatherSegment;
