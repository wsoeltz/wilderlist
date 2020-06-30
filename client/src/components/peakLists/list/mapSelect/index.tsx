import { useQuery } from '@apollo/react-hooks';
import {
  scaleLinear,
} from 'd3-scale';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import max from 'lodash/max';
import min from 'lodash/min';
import {darken} from 'polished';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
import {
  baseColor,
  BasicIconInText,
  borderRadius,
  GhostButton,
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

interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const defaultBoundingBox: BoundingBox = {
  x1: 0,
  y1: 0,
  x2: 959,
  y2: 593,
};

const getZoomedBBox = (bbox: {x: number, y: number, width: number, height: number}) => {
  const newWidth = bbox.width < 120 ? 120 : bbox.width;

  // the current center of the viewBox
  const cx = defaultBoundingBox.x1 + defaultBoundingBox.x2 / 2;
  const cy = defaultBoundingBox.y1 + defaultBoundingBox.y2 / 2;

  // the new center
  const newx = (bbox.x + newWidth / 2);
  const newy = (bbox.y + bbox.height / 2);

  // the corresponding top left corner in the current scale
  const absolute_offset_x = defaultBoundingBox.x1 + newx - cx;
  const absolute_offset_y = defaultBoundingBox.y1 + newy - cy;

  // the new scale
  const scale = newWidth / defaultBoundingBox.x2 * 4;

  const scaled_offset_x = absolute_offset_x + defaultBoundingBox.x2 * (1 - scale) / 2;
  const scaled_offset_y = absolute_offset_y + defaultBoundingBox.y2 * (1 - scale) / 2;
  const scaled_width = defaultBoundingBox.x2 * scale;
  const scaled_height = defaultBoundingBox.y2 * scale;

  const newBoundingBox: BoundingBox = {
    x1: scaled_offset_x,
    y1: scaled_offset_y,
    x2: scaled_width,
    y2: scaled_height,
  };

  return newBoundingBox;
};

const Root = styled(PlaceholderText)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
`;

const Path = styled.path`
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
    stroke: ${darken(0.1, locationColor)};
    stroke-width: 4px;
  }

  &.selected-state {
    stroke: ${darken(0.1, locationColor)};
    stroke-width: 2px;
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
  border: solid 1px ${lightBorderColor};
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

const ReturnButton = styled(GhostButton)`
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

const SelectedState = styled.h1`
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  font-size: 1.5rem;
  margin: 0;
  font-style: normal;
  color: ${baseColor};
  pointer-events: none;
  background-color: rgba(245, 245, 245, 0.5);
`;

interface Props {
  selectedState: {id: string, name: string} | null;
  setSelectedState: (val: {id: string, name: string} | null) => void;
}

const ListMapSelect = (props: Props) => {
  const {
    setSelectedState, selectedState,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {data} = useQuery<SuccessResponse>(GET_STATES);

  const [boundingBox, setBoundingBox] = useState<BoundingBox>(defaultBoundingBox);
  const [hoveredState, setHoveredState] = useState<TooltipDatum | undefined>(undefined);

  useEffect(() => {
    if (selectedState === null &&
      boundingBox.x1 !== defaultBoundingBox.x1 &&
      boundingBox.x2 !== defaultBoundingBox.x2 &&
      boundingBox.y1 !== defaultBoundingBox.y1 &&
      boundingBox.y2 !== defaultBoundingBox.y2
      ) {
      setBoundingBox(defaultBoundingBox);
    }
  }, [selectedState, boundingBox]);

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
    const onClick = (e: React.MouseEvent<SVGPathElement>) => {
      if (targetState) {
        setSelectedState(targetState);
        if (e.target) {
          const bbox = (e.target as SVGPathElement).getBBox();
          setBoundingBox(getZoomedBBox(bbox));
        }
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
    const isSelected = targetState && selectedState && selectedState.id === targetState.id;
    return (
      <Path
        key={state.path}
        d={state.path}
        fill={fill}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHoveredState(undefined)}
        onClick={onClick}
        className={isSelected ? 'selected-state' : undefined}
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

  const mapDetails = selectedState ? (
    <>
      <ReturnButton
        onClick={() => setSelectedState(null)}
      >
        <BasicIconInText icon={'chevron-left'} />
        {getFluentString('map-search-back-to-map')}
      </ReturnButton>
      <SelectedState>
        {selectedState.name}
      </SelectedState>
    </>
  ) : null;

  return (
    <Root>
      {mapDetails}
      <Svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox={
        `${boundingBox.x1} ${boundingBox.y1} ${boundingBox.x2} ${boundingBox.y2}`
        }
      >
        <g>
          {paths}
        </g>
      </Svg>
      {tooltip}
    </Root>
  );
};

export default ListMapSelect;
