import { extent, max, min } from 'd3-array';
import {
  axisBottom,
  axisLeft,
} from 'd3-axis';
import {
  scaleLinear,
} from 'd3-scale';
import { Selection } from 'd3-selection';
import { line } from 'd3-shape';
import {
  primaryColor,
} from '../../../styling/styleUtils';

export interface Datum {
  mile: number;
  elevation: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Input {
  svg: Selection<any, unknown, null, undefined>;
  data: Datum[];
  size: Dimensions;
}

const formatNumber = (n: number) => {
  return n.toString() + 'ft';
};

const formatMileage = (n: number) => {
  return n.toString() + 'mi';
};

const createLineChart = (input: Input) => {
  const { svg, data, size } = input;

  const margin = {top: 0, right: 0, bottom: 22, left: 37};
  const width = size.width - margin.left - margin.right;
  const height = size.height - margin.bottom - margin.top;

  // set the ranges
  const x = scaleLinear().range([0, width]);
  const y = scaleLinear().range([height, 0]);

  // define the line
  const elevationLine: any = line()
    .x((d: any) => x(d.mile))
    .y((d: any) => y(d.elevation));

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Add X axis --> it is a mile format
  const allMiles = data.map(({mile}) => mile);
  const allElevations = data.map(({elevation}) => elevation);
  const [rawMinMile, rawMaxMile] = extent(allMiles);
  const minMile = rawMinMile !== undefined ? rawMinMile : 0;
  const maxMile = rawMaxMile !== undefined ? rawMaxMile : 0;
  const rawMinElevation = min(allElevations);
  const rawMaxElevation = max(allElevations);
  const minElevation = rawMinElevation !== undefined ? rawMinElevation : 0;
  const maxElevation = rawMaxElevation !== undefined ? rawMaxElevation : 0;

  // Scale the range of the data
  x.domain([minMile, maxMile]);
  y.domain([minElevation, maxElevation]);

  // Add the elevationLine path.
  g.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', primaryColor)
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', elevationLine)
      .attr('transform', 'translate(' + margin.left + ', 0)');

  // Add the x Axis
  g.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + height + ')')
      .call(axisBottom(x).tickFormat(formatMileage as any).ticks(8));

  // Add the y Axis
  g.append('g')
      .call(axisLeft(y).tickFormat(formatNumber as any).ticks(8))
      .attr('transform', 'translate(' + margin.left + ', 0)');

  g.style('transform', 'scale(0.95) translateY(' + margin.top + 'px)')
   .style('transform-origin', 'center');
};

export default createLineChart;
