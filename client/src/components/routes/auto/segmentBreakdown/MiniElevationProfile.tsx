const distance = require('@turf/distance').default;
const along = require('@turf/along').default;
const {point} = require('@turf/helpers');
import React, {useEffect} from 'react';
import styled from 'styled-components/macro';
import {SegmentFeature} from '../../../../hooks/servicesHooks/pathfinding/simpleCache';
import useMapContext from '../../../../hooks/useMapContext';
import {
  InlineColumns,
} from '../../../../styling/sharedContentStyles';
import {
  CompleteText,
  IncompleteText,
  SemiBold,
} from '../../../../styling/styleUtils';
import DataViz, {
  VizType,
} from '../../../stats/d3Viz';
import {Datum as ElevationDatum} from '../../../stats/d3Viz/createElevationProfile';

const Root = styled.div`
  width: 10rem;
  margin-left: 0.875rem;
  padding: 0 0.2rem;
  box-sizing: border-box;
`;

const ElevationText = styled(SemiBold)`
  font-size: 0.75rem;
  transform: translate(0, -1px);
`;

const LeftColumn = styled(InlineColumns)`
  margin-right: auto;
`;

interface Props {
  chartUniqueId: string;
  feature: SegmentFeature;
}

const MinElevationProfile = (props: Props) => {
  const {feature, chartUniqueId} = props;

  const mapContext = useMapContext();
  const onMouseLeave = () => {
    if (mapContext.intialized) {
      mapContext.clearHoveredPoints();
    }
  };
  const onMouseMove = (d: ElevationDatum) => {
    if (mapContext.intialized && feature) {
      mapContext.setHoveredPrimitivePoints(along(feature, d.mile, {units: 'miles'}));
    }
  };
  useEffect(() => {
    return () => {
      if (mapContext.intialized) {
        mapContext.clearHoveredPoints();
      }
    };
  }, [mapContext]);

  const { elevationGain, elevationLoss } = feature.properties;
  let totalMileage = 0;
  const chartData = feature.geometry.coordinates.map((d, i) => {
    const elevation = d[2];
    const distanceFromLastMarker: number = i > 0
      ? distance(point(d), feature.geometry.coordinates[i - 1], {units: 'miles'})
      : 0;
    totalMileage += distanceFromLastMarker;
    return {
      elevation,
      mile: totalMileage,
    };
  });

  const formattedElevationGain = elevationGain !== undefined && elevationGain !== null
    ? Math.round(elevationGain) + 'ft' : '---';
  const formattedElevationLoss = elevationLoss !== undefined && elevationLoss !== null
    ? Math.round(elevationLoss) + 'ft' : '---';
  return (
    <Root>
      <InlineColumns>
        <LeftColumn>
          <ElevationText>
            <IncompleteText>
              ↓{formattedElevationLoss}
            </IncompleteText>
          </ElevationText>
        </LeftColumn>
        <InlineColumns>
          <ElevationText>
            <CompleteText>
              ↑{formattedElevationGain}
            </CompleteText>
          </ElevationText>
        </InlineColumns>
      </InlineColumns>
      <DataViz
        key={'elevation-profile-' + chartUniqueId}
        id={'elevation-profile-' + chartUniqueId}
        vizType={VizType.ElevationProfile}
        data={chartData}
        height={70}
        onMouseOut={onMouseLeave}
        onMouseMove={onMouseMove}
        noAxis={true}
      />
    </Root>
  );

};

export default MinElevationProfile;
