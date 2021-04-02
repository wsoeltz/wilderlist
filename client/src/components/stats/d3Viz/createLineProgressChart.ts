import { bisector, extent, max } from 'd3-array';
import {
  axisBottom,
  axisLeft,
} from 'd3-axis';
import {
  scaleLinear,
  scaleTime,
} from 'd3-scale';
import {
  // @ts-expect-error d3 typing is inaccurate, mouse is in fact exported from this module
  mouse,
  Selection,
} from 'd3-selection';
import { line } from 'd3-shape';
import sortBy from 'lodash/sortBy';
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

export interface Goal {
  name: string;
  value: number;
}

type GoalDatum = Goal & Datum;

interface Input {
  svg: Selection<any, unknown, null, undefined>;
  data: Datum[];
  size: Dimensions;
  units: string;
  goals: Goal[];
}
const ranges = [
  { divider: 1e18 , suffix: 'E' },
  { divider: 1e15 , suffix: 'P' },
  { divider: 1e12 , suffix: 'T' },
  { divider: 1e9 , suffix: 'B' },
  { divider: 1e6 , suffix: 'M' },
  { divider: 1e3 , suffix: 'k' },
];

const createLineChart = (input: Input) => {
  const { svg, data, size, units, goals } = input;

  const margin = {top: 15, right: 40, bottom: 22, left: 37};
  const width = size.width - margin.left - margin.right;
  const height = size.height - margin.bottom - margin.top;

  const formatNumber = (n: number) => {
    for (const range of ranges) {
      if (n >= range.divider) {
        return (n / range.divider).toString() + range.suffix + ' ' + units;
      }
    }
    return n.toString() + ' ' + units;
  };

  // set the ranges
  const x = scaleTime().range([0, width]);
  const y = scaleLinear().range([height, 0]);

  // define the line
  const valueLine: any = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.value));

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Add X axis --> it is a date format
  const allDates = data.map(({date}) => date);
  const allValues = data.map(({value}) => value);
  const [rawMinDate, rawMaxDate] = extent(allDates);
  const minDate = rawMinDate !== undefined ? rawMinDate : 0;
  const maxDate = rawMaxDate !== undefined ? rawMaxDate : 0;
  // const rawMinValue = min(allValues);
  const rawMaxValue = max(allValues);
  // const minValue = rawMinValue !== undefined ? rawMinValue : 0;
  const maxValue = rawMaxValue !== undefined ? rawMaxValue : 0;

  // Scale the range of the data
  x.domain([minDate, maxDate]);
  y.domain([0, maxValue + 200]);

   //  Plot goals onto line
  const goalsWithInterpolatedDates: GoalDatum[] = [];
  goals.forEach(goal => {
     // first find the index of the date at which the goal was met
     const indexOfMetGoal = data.findIndex((d, i) =>
       d.value > goal.value && data[i - 1] && data[i - 1].value < goal.value);
     if (indexOfMetGoal > 0) {
       // then get the number of days in between the when the goal was met and the previous hike
       const completed = data[indexOfMetGoal];
       const previous = data[indexOfMetGoal - 1];
       const daysBetweenDates = (completed.date.getTime() - previous.date.getTime())  / (1000 * 3600 * 24);
       // divide the difference of the met goal value and the previous value by the number of days
       const valueChangePerDay = (completed.value - previous.value) / daysBetweenDates;
       // increment the previous date one day at a time and the value determined above
       // the date at which the value first exceeds the goal value is the date to set the goal at
       let elapsedDays = 0;
       let elapsedValue = previous.value;
       while (elapsedValue < goal.value && elapsedDays < daysBetweenDates) {
         elapsedValue += valueChangePerDay;
         elapsedDays ++;
       }
       const interpolatedDate = new Date(previous.date.getTime() + elapsedDays * 24 * 60 * 60 * 1000);
       goalsWithInterpolatedDates.push({
         ...goal,
         date: interpolatedDate,
       });
     }
   });

  const allData: Array<Datum | GoalDatum> = sortBy([...data, ...goalsWithInterpolatedDates], ['date']);

  // Add the valueLine path.
  g.append('path')
      .data([allData])
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', primaryColor)
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', valueLine)
      .attr('transform', 'translate(' + margin.left + ', 0)');

  g.selectAll('circle')
    .data(goalsWithInterpolatedDates)
    .enter()
    .append('circle')
    .style('stroke', 'gray')
    .style('fill', 'black')
    .attr('r', 4)
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.value))
    .attr('transform', 'translate(' + margin.left + ', 0)');

  // Add the x Axis
  g.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + height + ')')
      .call(axisBottom(x));

  // Add the y Axis
  g.append('g')
      .call(axisLeft(y).tickFormat(formatNumber as any).ticks(8))
      .attr('transform', 'translate(' + margin.left + ', 0)');

  g.style('transform', 'scale(0.95) translateY(' + margin.top + 'px)')
   .style('transform-origin', 'center');

  const bisect = bisector(function(d: any) { return d.date; }).left;
  // Create the circle that travels along the curve of chart
  const focusLineVertical = g
    .append('line')
      .style('fill', 'none')
      .attr('stroke', '#a7a7a7')
      .attr('stroke-width', '0.5px')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', height)
      .style('opacity', 0);
  const focusLineHorizontal = g
    .append('line')
      .style('fill', 'none')
      .attr('stroke', '#a7a7a7')
      .attr('stroke-width', '0.5px')
      .attr('x1', margin.left)
      .attr('x2', size.width)
      .attr('y1', 0)
      .attr('y2', 0)
      .style('opacity', 0);

  // Create the text that travels along the curve of chart
  const focusDateText = g
    .append('g')
    .append('text')
      .style('opacity', 0)
      .attr('y', height - 7)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle')
      .style('font-weight', '600')
      .style('font-size', '12px')
      .attr('fill', '#333')
      .attr('stroke', '#fff')
      .attr('stroke-width', '5px')
      .attr('paint-order', 'stroke');
  const focusValueText = g
    .append('g')
    .append('text')
      .style('opacity', 0)
      .attr('x', margin.left + 5)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle')
      .style('font-weight', '600')
      .style('font-size', '12px')
      .attr('fill', '#333')
      .attr('stroke', '#fff')
      .attr('stroke-width', '5px')
      .attr('paint-order', 'stroke');

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  g
    .append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('width', size.width * 2)
    .attr('height', size.height * 2)
    .attr('x', -margin.left)
    .attr('y', -margin.top * 2)
    .attr('transform', 'translate(' + margin.left + ', 0)')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);

    // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    focusLineVertical.style('opacity', 1);
    focusLineHorizontal.style('opacity', 1);
    focusDateText.style('opacity', 1);
    focusValueText.style('opacity', 1);
  }

  function mousemove() {
    // recover coordinate we need
    // @ts-expect-error this is correct
    const x0 = x.invert(mouse(this)[0]);
    const i = bisect(allData, x0, 1);
    const selectedData = allData[i];
    const maxI = i + 2 > allData.length - 1 ? allData.length - 1 : i + 2;
    let variableI = 0;
    while (i + variableI < maxI) {
      if ((allData[i + variableI] as any) && (allData[i + variableI] as any).name) {
        break;
      }
      variableI++;
    }
    const dataForTextValues = allData[i + variableI];
    if (selectedData) {
      focusLineVertical
        .attr('x1', x(selectedData.date) + margin.left)
        .attr('x2', x(selectedData.date) + margin.left);
      focusLineHorizontal
        .attr('y1', y(selectedData.value))
        .attr('y2', y(selectedData.value));

      const label = (dataForTextValues as any).name
        ? (dataForTextValues as any).name + ' - ' + Math.round(dataForTextValues.value).toString() + units
        : dataForTextValues.date.toDateString();
      focusDateText
        .html(label)
        .attr('x', x(selectedData.date) + 5);
      focusValueText
        .html(Math.round(selectedData.value).toString() + units)
        .attr('y', y(selectedData.value) - 10);
    }
  }
  function mouseout() {
    focusDateText.style('opacity', 0);
    focusValueText.style('opacity', 0);
    focusLineVertical.style('opacity', 0);
    focusLineHorizontal.style('opacity', 0);
  }
};

export default createLineChart;
