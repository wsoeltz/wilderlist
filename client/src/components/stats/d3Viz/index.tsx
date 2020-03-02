import React, {useEffect, useRef, useContext} from 'react';
import { select } from 'd3-selection';
import styled from 'styled-components';
import createBarGraph, {Datum} from './createBarGraph';
import { AppContext } from '../../App';
import { failIfValidOrNonExhaustive } from '../../../Utils';
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
}

interface BaseProps {
  id: string;
  vizType: VizType;
}

type Props = BaseProps & (
  {
    vizType: VizType.HorizontalBarChart;
    data: Datum[];
  }
);

const D3Viz = (props: Props) => {
  const { id, vizType, data } = props;
  const sizingNodeRef = useRef<HTMLDivElement | null>(null);
  const svgNodeRef = useRef<any>(null);
  const { windowWidth } = useContext(AppContext);

  useEffect(() => {
    if (svgNodeRef && svgNodeRef.current && sizingNodeRef && sizingNodeRef.current) {
      const sizingNode = sizingNodeRef.current;
      const svg = select(svgNodeRef.current);
      if (vizType === VizType.HorizontalBarChart) {
        createBarGraph({
          svg, data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          }
        });
      } else {
        failIfValidOrNonExhaustive(vizType, 'Invalid vizType ' + vizType);
      }
    }
  }, [svgNodeRef, sizingNodeRef, windowWidth, vizType, data])
 
  return (
    <Root ref={sizingNodeRef}>
      <svg ref={svgNodeRef}  key={id + windowWidth} />
    </Root>
  );

}

export default D3Viz;