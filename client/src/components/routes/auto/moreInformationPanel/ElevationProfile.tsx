const distance = require('@turf/distance').default;
const along = require('@turf/along').default;
const {point} = require('@turf/helpers');
import React, {useEffect} from 'react';
import styled from 'styled-components/macro';
import {Feature} from '../../../../hooks/servicesHooks/pathfinding/simpleCache';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import {
  CollapsedScrollContainer,
  EmptyBlock,
  InlineColumns,
  SimpleTitle,
} from '../../../../styling/sharedContentStyles';
import {
  CompleteText,
  IncompleteText,
  SemiBold,
  Subtext,
} from '../../../../styling/styleUtils';
import DataViz, {
  VizType,
} from '../../../stats/d3Viz';
import {Datum as ElevationDatum} from '../../../stats/d3Viz/createElevationProfile';

const ChartContainer = styled(EmptyBlock)`
  padding: 0;
`;

const ElevationRow = styled.div`
  padding: 0 0.4rem 0.5rem 0.7rem;
`;

const ElevationText = styled(SemiBold)`
  font-size: 0.8rem;
  transform: translate(0, -1px);
`;

const LeftColumn = styled(InlineColumns)`
  margin-right: 1rem;
`;

interface Props {
  chartUniqueId: string;
  feature: Feature;
}

const TrailDetails = (props: Props) => {
  const {feature, chartUniqueId} = props;
  const getString = useFluent();

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

  const { elevationMax, elevationGain, elevationLoss, elevationMin } = feature.properties;
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
  const minHeight = elevationMin !== undefined && elevationMin !== null
    ? Math.round(elevationMin) + 'ft' : '---';
  const maxHeight = elevationMax !== undefined && elevationMax !== null
    ? Math.round(elevationMax) + 'ft' : '---';
  const formattedElevationGain = elevationGain !== undefined && elevationGain !== null
    ? Math.round(elevationGain) + 'ft' : '---';
  const formattedElevationLoss = elevationLoss !== undefined && elevationLoss !== null
    ? Math.round(elevationLoss) + 'ft' : '---';
  return (
    <CollapsedScrollContainer hideScrollbars={false} $noScroll={true}>
      <ChartContainer>
        <ElevationRow>
          <InlineColumns>
            <InlineColumns>
              <LeftColumn>
                <SimpleTitle>
                  <Subtext>{getString('global-text-value-min')}:</Subtext>
                </SimpleTitle>
                <ElevationText>
                  {minHeight}
                </ElevationText>
              </LeftColumn>
              <InlineColumns>
                <SimpleTitle>
                  <Subtext>{getString('global-text-value-max')}:</Subtext>
                </SimpleTitle>
                <ElevationText>
                  {maxHeight}
                </ElevationText>
              </InlineColumns>
            </InlineColumns>
            <InlineColumns>
              <LeftColumn>
                <SimpleTitle>
                  <Subtext>{getString('global-text-value-loss')}:</Subtext>
                </SimpleTitle>
                <ElevationText>
                  <IncompleteText>
                    ↓{formattedElevationLoss}
                  </IncompleteText>
                </ElevationText>
              </LeftColumn>
              <InlineColumns>
                <SimpleTitle>
                  <Subtext>{getString('global-text-value-gain')}:</Subtext>
                </SimpleTitle>
                <ElevationText>
                  <CompleteText>
                    ↑{formattedElevationGain}
                  </CompleteText>
                </ElevationText>
              </InlineColumns>
            </InlineColumns>
          </InlineColumns>
        </ElevationRow>
        <DataViz
          key={'elevation-profile-' + chartUniqueId}
          id={'elevation-profile-' + chartUniqueId}
          vizType={VizType.ElevationProfile}
          data={chartData}
          height={180}
          onMouseOut={onMouseLeave}
          onMouseMove={onMouseMove}
        />
      </ChartContainer>
    </CollapsedScrollContainer>
  );

};

export default TrailDetails;
