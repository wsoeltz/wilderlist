import { useQuery } from '@apollo/react-hooks';
import {
  scaleLinear,
} from 'd3-scale';
import gql from 'graphql-tag';
import max from 'lodash/max';
import min from 'lodash/min';
import {darken} from 'polished';
import React, {
  useState,
} from 'react';
import styled from 'styled-components/macro';
import {
  baseColor,
  borderRadius,
  lightBorderColor,
  locationColor,
  PlaceholderText,
  secondaryColor,
} from '../../../../styling/styleUtils';
import { State } from '../../../../types/graphQLTypes';
import statePaths from './statePaths';

const GET_STATES = gql`
  query ListStates {
    states {
      id
      name
      abbreviation
      numPeakLists
    }
  }
`;

interface StateDatum {
  id: State['id'];
  name: State['name'];
  abbreviation: State['abbreviation'];
  numPeakLists: State['numPeakLists'];
}

interface SuccessResponse {
  states: StateDatum[];
}

interface TooltipDatum extends StateDatum {
  mouseX: number;
  mouseY: number;
}

const Root = styled(PlaceholderText)`
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const Svg = styled.svg`
  width: 100%;
`;

const Path = styled.path`
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
    stroke: ${darken(0.1, locationColor)};
    stroke-width: 4px;
  }
`;

const Tooltip = styled.div`
  position: fixed;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10000;
  pointer-events: none;
  padding: 0.5rem;
  transform: translate(-50%, calc(-100% - 1rem));
  color: ${secondaryColor};
  border-radius: ${borderRadius};
  display: flex;
  flex-direction: column;
  font-style: normal;
`;

const TooltipTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0;
  color: ${baseColor};
`;

const TooltipListCount = styled.h3`
  font-size: 1.2rem;
  margin: 0.4rem 0 0.2rem;
  color: ${locationColor};
`;

const TooltipClickText = styled.small`
  margin: 0.5rem 0;
  font-size: 0.7rem;
  font-style: italic;
`;

interface Props {
  setSelectedState: (val: {id: string, name: string} | null) => void;
}

const ListMapSelect = (props: Props) => {
  const {
    setSelectedState,
  } = props;
  const {data} = useQuery<SuccessResponse>(GET_STATES);

  const [hoveredState, setHoveredState] = useState<TooltipDatum | undefined>(undefined);

  const allValues = data && data.states
    ? data.states.map(({numPeakLists}) => numPeakLists)
    : [0, 0];
  const minVal = min(allValues) as number;
  const maxVal = max(allValues) as number;

  const colorScale = scaleLinear<string>().domain([minVal, maxVal]).range([lightBorderColor, locationColor]);

  const paths = statePaths.map(state => {
    const targetState = data && data.states
      ? data.states.find(s => s.abbreviation === state.abbr)
      : undefined;
    const fill = targetState ? colorScale(targetState.numPeakLists) : lightBorderColor;
    const onClick = () => {
      if (targetState) {
        setSelectedState(targetState);
      }
    };
    const onMouseMove = (e: React.MouseEvent) => {
      if (targetState) {
        setHoveredState({
          ...targetState,
          mouseX: e.clientX,
          mouseY: e.clientY,
        });
      }
    };
    return (
      <Path
        key={state.path}
        d={state.path}
        fill={fill}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHoveredState(undefined)}
        onClick={onClick}
      />
    );
  });

  const tooltip = hoveredState ? (
    <Tooltip
      style={{
        top: hoveredState.mouseY,
        left: hoveredState.mouseX,
      }}
    >
      <TooltipTitle>
        {hoveredState.name}
      </TooltipTitle>
      <TooltipListCount>
        {hoveredState.numPeakLists}
      </TooltipListCount>
      <small>
        lists
      </small>
      <TooltipClickText>
        click to filter lists  in {hoveredState.abbreviation}
      </TooltipClickText>
    </Tooltip>
  ) : null;

  return (
    <Root>
      <Svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 959 593'>
        <g>
          {paths}
        </g>
      </Svg>
      {tooltip}
    </Root>
  );
};

export default ListMapSelect;
