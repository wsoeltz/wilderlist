import {
  scaleTime,
  scaleLinear,
} from 'd3-scale';
import { Selection } from 'd3-selection';
import { line } from 'd3-shape'
import {
  axisBottom,
  axisLeft,
} from 'd3-axis';
import { max, extent } from 'd3-array';
import {
  primaryColor,
} from '../../../styling/styleUtils';

export interface Datum {
  date: Date;
  value: number;
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

const ranges = [
  { divider: 1e18 , suffix: 'E' },
  { divider: 1e15 , suffix: 'P' },
  { divider: 1e12 , suffix: 'T' },
  { divider: 1e9 , suffix: 'G' },
  { divider: 1e6 , suffix: 'M' },
  { divider: 1e3 , suffix: 'k' }
];

const formatNumber = (n: number) => {
  for (var i = 0; i < ranges.length; i++) {
    if (n >= ranges[i].divider) {
      return (n / ranges[i].divider).toString() + ranges[i].suffix + ' ft';
    }
  }
  return n.toString() + ' ft';
}

export default (input: Input) => {
  const { svg, data, size } = input;

  const margin = {top: 20, right: 15, bottom: 30, left: 40};
  const width = size.width - margin.left - margin.right;
  const height = size.height - margin.bottom - margin.top;

  // set the ranges
  var x = scaleTime().range([0, width]);
  var y = scaleLinear().range([height, 0]);

  // define the line
  var valueline: any = line()
    .x(function(d: any) { return x(d.date); })
    .y(function(d: any) { return y(d.value); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Add X axis --> it is a date format
  const allDates = data.map(({date}) => date);
  const allValues = data.map(({value}) => value);
  const [rawMinDate, rawMaxDate] = extent(allDates);
  const minDate = rawMinDate !== undefined ? rawMinDate : 0;
  const maxDate = rawMaxDate !== undefined ? rawMaxDate : 0;
  const rawMaxValue = max(allValues);
  const maxValue = rawMaxValue !== undefined ? rawMaxValue : 0;

  // Scale the range of the data
  x.domain([minDate, maxDate]);
  y.domain([0, maxValue]);

  // Add the valueline path.
  g.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", primaryColor)
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", valueline)
      .attr("transform", "translate(" + margin.left + ", 0)");

  // Add the x Axis
  g.append("g")
      .attr("transform", "translate(" + margin.left + "," + height + ")")
      .call(axisBottom(x))

  // Add the y Axis
  g.append("g")
      .call(axisLeft(y).tickFormat(formatNumber))
      .attr("transform", "translate(" + margin.left + ", 0)");

  g.style('transform', 'scale(0.95) translateY(' + margin.top + 'px)')
   .style('transform-origin', 'center');

}
