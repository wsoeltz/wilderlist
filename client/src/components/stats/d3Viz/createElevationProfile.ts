import { extent, max, min } from 'd3-array';
import {
  axisBottom,
  axisLeft,
} from 'd3-axis';
import {
  scaleLinear,
} from 'd3-scale';
import {
  // mouse,
  Selection,
} from 'd3-selection';
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

  const margin = {top: 5, right: 0, bottom: 22, left: 37};
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
  y.domain([minElevation - 200, maxElevation + 200]);

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

  // const bisect = bisector(function(d: any) { return d.mile; }).left;
  // // Create the circle that travels along the curve of chart
  // const focusLineVertical = g
  //   .append('line')
  //     .style('fill', 'none')
  //     .attr('stroke', '#a7a7a7')
  //     .attr('stroke-width', '0.5px')
  //     .attr('x1', 0)
  //     .attr('x2', 0)
  //     .attr('y1', 0)
  //     .attr('y2', height)
  //     .style('opacity', 0);
  // const focusLineHorizontal = g
  //   .append('line')
  //     .style('fill', 'none')
  //     .attr('stroke', '#a7a7a7')
  //     .attr('stroke-width', '0.5px')
  //     .attr('x1', margin.left)
  //     .attr('x2', size.width)
  //     .attr('y1', 0)
  //     .attr('y2', 0)
  //     .style('opacity', 0);

  // // Create the text that travels along the curve of chart
  // const focusMileText = g
  //   .append('g')
  //   .append('text')
  //     .style('opacity', 0)
  //     .attr('y', height - 7)
  //     .attr('text-anchor', 'left')
  //     .attr('alignment-baseline', 'middle')
  //     .style('font-weight', '600')
  //     .style('font-size', '12px')
  //     .attr('fill', '#333')
  //     .attr('stroke', '#fff')
  //     .attr('stroke-width', '5px')
  //     .attr('paint-order', 'stroke');
  // const focusElevationText = g
  //   .append('g')
  //   .append('text')
  //     .style('opacity', 0)
  //     .attr('x', margin.left + 5)
  //     .attr('text-anchor', 'left')
  //     .attr('alignment-baseline', 'middle')
  //     .style('font-weight', '600')
  //     .style('font-size', '12px')
  //     .attr('fill', '#333')
  //     .attr('stroke', '#fff')
  //     .attr('stroke-width', '5px')
  //     .attr('paint-order', 'stroke');

  // // Create a rect on top of the svg area: this rectangle recovers mouse position
  // g
  //   .append('rect')
  //   .style('fill', 'none')
  //   .style('pointer-events', 'all')
  //   .attr('width', size.width * 2)
  //   .attr('height', size.height * 2)
  //   .attr('x', -margin.left)
  //   .attr('y', -margin.top * 2)
  //   .attr('transform', 'translate(' + margin.left + ', 0)')
  //   .on('mouseover', mouseover)
  //   .on('mousemove', mousemove)
  //   .on('mouseout', mouseout);

  //   // What happens when the mouse move -> show the annotations at the right positions.
  // function mouseover() {
  //   focusLineVertical.style('opacity', 1);
  //   focusLineHorizontal.style('opacity', 1);
  //   focusMileText.style('opacity', 1);
  //   focusElevationText.style('opacity', 1);
  // }

  // function mousemove() {
  //   // recover coordinate we need
  //   // @ts-expect-error this is correct
  //   const x0 = x.invert(mouse(this)[0]);
  //   const i = bisect(data, x0, 1);
  //   const selectedData = data[i];
  //   if (selectedData) {
  //     focusLineVertical
  //       .attr('x1', x(selectedData.mile) + margin.left)
  //       .attr('x2', x(selectedData.mile) + margin.left);
  //     focusLineHorizontal
  //       .attr('y1', y(selectedData.elevation))
  //       .attr('y2', y(selectedData.elevation));

  //     focusMileText
  //       .html(selectedData.mile.toFixed(2) + 'mi')
  //       .attr('x', x(selectedData.mile) + 5);
  //     focusElevationText
  //       .html(Math.round(selectedData.elevation).toString() + 'ft')
  //       .attr('y', y(selectedData.elevation) - 10);
  //   }
  // }
  // function mouseout() {
  //   focusMileText.style('opacity', 0);
  //   focusElevationText.style('opacity', 0);
  //   focusLineVertical.style('opacity', 0);
  //   focusLineHorizontal.style('opacity', 0);
  // }
};

export default createLineChart;
