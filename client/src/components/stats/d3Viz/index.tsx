import { select } from 'd3-selection';
import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/macro';
import useWindowWidth from '../../../hooks/useWindowWidth';
import createBarGraph, {Datum as BarGraphDatum} from './createBarGraph';
import createBubbleChart, {Datum as BubbleChartDatum} from './createBubbleChart';
import createElevationProfile, {Datum as ElevationProfileDatum} from './createElevationProfile';
import createLineChart, {Datum as LineChartDatum} from './createLineChart';

const Root = styled.div`
  height: 450px;
  width: 100%;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export enum VizType {
  HorizontalBarChart = 'HorizontalBarChart',
  BubbleChart = 'BubbleChart',
  LineChart = 'LineChart',
  ElevationProfile = 'ElevationProfile',
}

interface BaseProps {
  id: string;
  height?: number;
  vizType: VizType;
}

type Props = BaseProps & (
  {
    vizType: VizType.HorizontalBarChart;
    data: BarGraphDatum[];
  } |
  {
    vizType: VizType.BubbleChart;
    data: BubbleChartDatum[];
  } |
  {
    vizType: VizType.LineChart;
    data: LineChartDatum[];
  } |
  {
    vizType: VizType.ElevationProfile;
    data: ElevationProfileDatum[];
    onMouseMove: (d: ElevationProfileDatum) => void;
    onMouseOut: () => void;
  }
);

const D3Viz = (props: Props) => {
  const { id, height } = props;
  const sizingNodeRef = useRef<HTMLDivElement | null>(null);
  const svgNodeRef = useRef<any>(null);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    let svgNode: HTMLDivElement | null = null;
    if (svgNodeRef && svgNodeRef.current && sizingNodeRef && sizingNodeRef.current) {
      const sizingNode = sizingNodeRef.current;
      svgNode = svgNodeRef.current;
      const svg = select(svgNode);
      if (props.vizType === VizType.HorizontalBarChart) {
        createBarGraph({
          svg, data: props.data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          },
        });
      } else if (props.vizType === VizType.BubbleChart) {
        createBubbleChart({
          svg, data: props.data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          },
        });
      } else if (props.vizType === VizType.LineChart) {
        createLineChart({
          svg, data: props.data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          },
        });
      } else if (props.vizType === VizType.ElevationProfile) {
        createElevationProfile({
          svg, data: props.data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          },
          onMouseMove: props.onMouseMove,
          onMouseOut: props.onMouseOut,
        });
      }
    }
    return () => {
      if (svgNode) {
        svgNode.innerHTML = '';
      }
    };
  }, [svgNodeRef, sizingNodeRef, windowWidth, props]);

  return (
    <Root ref={sizingNodeRef} style={{height}}>
      <svg ref={svgNodeRef}  key={id + windowWidth} />
    </Root>
  );

};

export default D3Viz;
