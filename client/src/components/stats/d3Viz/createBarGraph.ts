import {
  scaleBand,
  scaleLinear,
} from 'd3-scale';
import { Selection } from 'd3-selection';
import {
  axisBottom,
} from 'd3-axis';
import { max } from 'd3-array';
import { lightBorderColor, baseColor, linkColor } from '../../../styling/styleUtils';

export interface Datum {
  label: string;
  value: number;
  onClick?: () => void;
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


export default (input: Input) => {
  const { svg, data, size } = input;

  const margin = {top: 10, right: 10, bottom: 10, left: 10};
  const width = size.width - margin.left - margin.right;
  const height = size.height - margin.bottom - margin.top;

  // set the ranges
  const y = scaleBand()
            .range([height, 0])
            .padding(0.1);

  const x = scaleLinear()
            .range([0, width]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  data.forEach(function(d) {
    d.value = +d.value;
  });

  // Scale the range of the data in the domains
  const maxXValue = max(data,function(d){ return d.value; });
  const definedMaxXValue = maxXValue !== undefined ? maxXValue : 0;
  x.domain([0,  definedMaxXValue]);
  y.domain(data.map(function(d) { return d.label; }));

  // append the rectangles for the bar chart
  svg.selectAll()
      .data(data)
    .enter().append("rect")
      .attr("width", function(d) {return x(d.value); } )
      .attr("transform", "translate(" + margin.left + ", " + 0 +")")
      .attr("y", function(d) {
        const val = y(d.label);
        return val !== undefined ? val : 0;
      })
      .attr("height", y.bandwidth())
      .style('fill', lightBorderColor)
      .style('cursor', (d) => {
        if (d.onClick) {
          return 'pointer';
        } else {
          return 'auto';
        }
      })
      .on('click', (d) => {
        if (d.onClick) {
          d.onClick();
        }
      })

  // append the text for the bar chart
  svg.selectAll()
      .data(data)
    .enter().append("text")
      .attr("width", function(d) {return x(d.value); } )
      .attr("transform", "translate(" + (margin.left + 10)+ ", " + (y.bandwidth() * .7) +")")
      .attr("y", function(d) {
        const val = y(d.label);
        return val !== undefined ? val : 0;
      })
      .attr("height", y.bandwidth() / 2)
      .text(d => `${d.label} (${d.value})`)
      .style('font-size', '12px')
      .style('text-transform', 'capitalize')
      .style('font-weight', '600')
      .style('fill', (d) => {
        if (d.onClick) {
          return linkColor;
        } else {
          return baseColor;
        }
      })
      .style('cursor', (d) => {
        if (d.onClick) {
          return 'pointer';
        } else {
          return 'auto';
        }
      })
      .style('text-decoration', (d) => {
        if (d.onClick) {
          return 'underline';
        } else {
          return 'none';
        }
      })
      .on('click', (d) => {
        if (d.onClick) {
          d.onClick();
        }
      })

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(" + margin.left + ", " + height + ")")
      .call(axisBottom(x))
      .style('opacity', 0.75)

  // add the y Axis
  svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
}
