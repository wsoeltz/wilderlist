import React, {useEffect, useRef, useContext} from 'react';
import { select } from 'd3-selection';
import styled from 'styled-components';
import createBarGraph, {Datum as BarGraphDatum} from './createBarGraph';
import createBubbleChart, {Datum as BubbleChartDatum} from './createBubbleChart';
import createLineChart, {Datum as LineChartDatum} from './createLineChart';
import { AppContext } from '../../App';
import { lightBorderColor } from '../../../styling/styleUtils';

const Root = styled.div`
  height: 450px;
  width: 100%;
  border: solid 1px ${lightBorderColor};

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
  const { windowWidth } = useContext(AppContext);

  useEffect(() => {
    if (svgNodeRef && svgNodeRef.current && sizingNodeRef && sizingNodeRef.current) {
      const sizingNode = sizingNodeRef.current;
      const svg = select(svgNodeRef.current);
      if (props.vizType === VizType.HorizontalBarChart) {
        createBarGraph({
          svg, data: props.data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          }
        });
      } else if (props.vizType === VizType.BubbleChart) {
        createBubbleChart({
          svg, data: props.data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          }
        });
      } else if (props.vizType === VizType.LineChart) {
        createLineChart({
          svg, data: props.data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          }
        });
      }
    }
  }, [svgNodeRef, sizingNodeRef, windowWidth, props.vizType, props.data])

  return (
    <Root ref={sizingNodeRef}>
      <svg ref={svgNodeRef}  key={id + windowWidth} />
    </Root>
  );

}

export default D3Viz;