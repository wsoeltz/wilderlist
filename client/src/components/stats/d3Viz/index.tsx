import { select } from 'd3-selection';
import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import useWindowWidth from '../../../hooks/useWindowWidth';
import createBarGraph, {Datum as BarGraphDatum} from './createBarGraph';
import createBubbleChart, {Datum as BubbleChartDatum} from './createBubbleChart';
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
}

interface BaseProps {
  id: string;
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
  }
);

const D3Viz = (props: Props) => {
  const { id } = props;
  const sizingNodeRef = useRef<HTMLDivElement | null>(null);
  const svgNodeRef = useRef<any>(null);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (svgNodeRef && svgNodeRef.current && sizingNodeRef && sizingNodeRef.current) {
      const sizingNode = sizingNodeRef.current;
      const svg = select(svgNodeRef.current);
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
      }
    }
  }, [svgNodeRef, sizingNodeRef, windowWidth, props.vizType, props.data]);

  return (
    <Root ref={sizingNodeRef}>
      <svg ref={svgNodeRef}  key={id + windowWidth} />
    </Root>
  );

};

export default D3Viz;
