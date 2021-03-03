const distance = require('@turf/distance').default;
const along = require('@turf/along').default;
const {point, lineString} = require('@turf/helpers');
import React, {useEffect} from 'react';
import styled from 'styled-components/macro';
import useLineStringElevation from '../../../../hooks/servicesHooks/elevation/useLineStringElevation';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import {useBasicTrailDetail} from '../../../../queries/trails/useBasicTrailDetail';
import {
  CenteredHeader,
  CollapsedScrollContainer,
  EmptyBlock,
  HorizontalScrollContainer,
  InlineColumns,
  SimpleTitle,
} from '../../../../styling/sharedContentStyles';
import {
  CompleteText,
  IncompleteText,
  SemiBold,
  Subtext,
} from '../../../../styling/styleUtils';
import LoadingSimple from '../../../sharedComponents/LoadingSimple';
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
  id: string;
}

const TrailDetails = (props: Props) => {
  const {id} = props;
  const getString = useFluent();
  const {loading, error, data} = useBasicTrailDetail(id);
  const elevationData = useLineStringElevation({
    lineId: id,
    line: data && data.trail && data.trail.line ? data.trail.line : null,
    includeIncline: true,
    includeMinMax: true,
  });
  const mapContext = useMapContext();
  const onMouseLeave = () => {
    if (mapContext.intialized) {
      mapContext.clearHoveredPoints();
    }
  };
  const onMouseMove = (d: ElevationDatum) => {
    if (mapContext.intialized && data && data.trail && data.trail.line) {
      mapContext.setHoveredPrimitivePoints(along(lineString(data.trail.line), d.mile, {units: 'miles'}));
    }
  };
  useEffect(() => {
    return () => {
      if (mapContext.intialized) {
        mapContext.clearHoveredPoints();
      }
    };
  }, [mapContext]);
  if (loading || elevationData.loading) {
    return (
        <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
          <EmptyBlock>
            <CenteredHeader>
              <LoadingSimple />
              {getString('global-text-value-loading')}...
            </CenteredHeader>
          </EmptyBlock>
        </HorizontalScrollContainer>
    );
  } else if (error !== undefined) {
    console.error(error);
    return (
      <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
        <EmptyBlock>
          <CenteredHeader>
            {getString('global-error-retrieving-data')}
          </CenteredHeader>
        </EmptyBlock>
      </HorizontalScrollContainer>
    );
  } else if (data !== undefined && data.trail && elevationData.data) {
    const { line, elevation_max, elevation_gain, elevation_loss, elevation_min } = elevationData.data;
    let totalMileage = 0;
    const chartData = line.map((d, i) => {
      const elevation = d[2];
      const distanceFromLastMarker: number = i > 0
        ? distance(point(d), line[i - 1], {units: 'miles'})
        : 0;
      totalMileage += distanceFromLastMarker;
      return {
        elevation,
        mile: totalMileage,
      };
    });
    const minHeight = elevation_min !== undefined ? Math.round(elevation_min) + 'ft' : '---';
    const maxHeight = elevation_max !== undefined ? Math.round(elevation_max) + 'ft' : '---';
    const elevationGain = elevation_gain !== undefined ? Math.round(elevation_gain) + 'ft' : '---';
    const elevationLoss = elevation_loss !== undefined ? Math.round(elevation_loss) + 'ft' : '---';
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
                      ↓{elevationLoss}
                    </IncompleteText>
                  </ElevationText>
                </LeftColumn>
                <InlineColumns>
                  <SimpleTitle>
                    <Subtext>{getString('global-text-value-gain')}:</Subtext>
                  </SimpleTitle>
                  <ElevationText>
                    <CompleteText>
                      ↑{elevationGain}
                    </CompleteText>
                  </ElevationText>
                </InlineColumns>
              </InlineColumns>
            </InlineColumns>
          </ElevationRow>
          <DataViz
            key={'elevation-profile-' + id}
            id={'elevation-profile-' + id}
            vizType={VizType.ElevationProfile}
            data={chartData}
            height={180}
            onMouseOut={onMouseLeave}
            onMouseMove={onMouseMove}
          />
        </ChartContainer>
      </CollapsedScrollContainer>
    );
  } else {
    return null;
  }

};

export default TrailDetails;
