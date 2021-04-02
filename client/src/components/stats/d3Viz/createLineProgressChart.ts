import { extent, max } from 'd3-array';
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
  event,
  select,
  Selection,
} from 'd3-selection';
import { line } from 'd3-shape';
import sortBy from 'lodash/sortBy';
import {
  baseColor,
  lightBorderColor,
  secondaryColor,
} from '../../../styling/styleUtils';
import {formatNumber} from '../../../Utils';

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
  image: string;
  desc: string;
}

type GoalDatum = Goal & Datum;

interface Input {
  svg: Selection<any, unknown, null, undefined>;
  data: Datum[];
  size: Dimensions;
  units: string;
  goals: Goal[];
}

const createLineChart = (input: Input) => {
  const { svg, data, size, units, goals } = input;

  const margin = {top: 0, right: 0, bottom: 22, left: 37};
  const width = size.width - margin.left - margin.right;
  const height = size.height - margin.bottom - margin.top;

  const formatWithUnits = (value: number) => formatNumber(value) + ' ' + units;

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
      .attr('stroke', secondaryColor)
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', valueLine)
      .attr('transform', 'translate(' + margin.left + ', 0)');

  // Add the x Axis
  g.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + height + ')')
      .call(axisBottom(x));

  // Add the y Axis
  g.append('g')
      .call(axisLeft(y).tickFormat(formatWithUnits as any).ticks(8))
      .attr('transform', 'translate(' + margin.left + ', 0)');

  g.style('transform', 'scale(0.95) translateY(' + margin.top + 'px)')
   .style('transform-origin', 'center');

  // Define the div for the tooltip
  const tooltipDiv = select('body').append('div')
    .style('position', 'absolute')
    .style('text-align', 'center')
    .style('display', 'none')
    .style('padding', '8px 12px')
    .style('background', '#fff')
    .style('border-radius', '4px')
    .style('color', secondaryColor)
    .style('pointer-events', 'none')
    .style('box-shadow', '0px 0px 3px -1px #b5b5b5')
    .style('border', `solid 1px ${lightBorderColor}`);

  g.selectAll('image')
    .data(goalsWithInterpolatedDates)
    .enter()
    .append('image')
      .attr('xlink:href', d => d.image)
      .attr('x', d => x(d.date) - 10)
      .attr('y', d => y(d.value) - 10)
      .attr('transform', 'translate(' + margin.left + ', 0)')
      .attr('width', 20)
      .attr('height', 20)
      .on('mousemove', (d) => {
        tooltipDiv
            .style('display', 'block');
        tooltipDiv.html(`
          <div style="max-width: 110px;">
            <img src="${d.image}" style="width: 90px; height: 90px;" />
            <div style="margin: 0.65rem 0 0.25rem; font-size: 0.875rem; font-weight: 600; color: ${baseColor};">
              ${d.name}
            </div>
            <div style="font-size: 0.75rem; margin-bottom: 0.35rem">${formatNumber(d.value)} ${units}</div>
            <div style="font-size: 0.75rem; text-align: left; margin-bottom: 0.35rem">${d.desc}</div>
          </div>`)
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY) + 'px');
      })
      .on('mouseout', () => {
          tooltipDiv
              .style('display', 'none');
      });

};

export default createLineChart;
