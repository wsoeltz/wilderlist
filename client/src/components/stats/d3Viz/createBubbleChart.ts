import { Selection } from 'd3-selection';
import {
  pack,
  hierarchy,
  stratify,
} from 'd3-hierarchy';

export interface Datum {
  label: string;
  value: number;
}

interface ParentDatum {
  id: string;
}

interface SrcDatum extends ParentDatum {
  value: number;
  parentId: string;
};

type SrcData = Array<SrcDatum | ParentDatum>;

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
  const { svg, size, data } = input;

  const srcData: SrcData = data.map(d => ({id: d.label, size: d.value, parentId: 'global'}));
  srcData.unshift({id: 'global'});

  const margin = {top: 10, right: 10, bottom: 10, left: 10};
  const width = size.width - margin.left - margin.right;
  const height = size.height - margin.bottom - margin.top;

  svg.attr("width", width)
     .attr("height", height);

  const g = svg.append("g")
            .attr('class', 'main-group');

  const layout = pack()
          .size([width - 2, height - 2])
          .padding(6)
      
  const stratData = stratify()(srcData);
  const root = hierarchy(stratData)
      .sum(function (d: any) { return d.data.size })
      .sort(function(a: any, b: any) { return b.value - a.value });
  const nodes = root.descendants();

  layout(root)
  
  g.selectAll('circle')
    .data(nodes)
    .enter()
    .filter((d) => d.parent !== null )
    .append('circle')
    .attr('cx', function (d: any) { return d.x; })
    .attr('cy', function (d: any) { return d.y; })
    .attr('r', function (d: any) { return d.r; })
    .style("fill", '#abcf6f')


  g.selectAll('text')
    .data(nodes)
    .enter()
    .filter((d) => d.parent !== null )
    .append('text')
    .attr('x', function (d: any) { return d.x; })
    .attr('y', function (d: any) { return d.y; })
    .text(d => {
      if (d.data.id) {
        return d.data.id;
      } else {
        return '';
      }
    })
    .style('font-size', (d: any) => {
      const fontSize = parseInt(d.r, 10) * 0.85;
      return fontSize + 'px';
    })
    .attr("text-anchor", "middle")
    .style('transform', (d: any) => {
      const adjust = parseInt(d.r, 10) * 0.3;
      return 'translate(0px, ' + adjust + 'px)';
    })

    // g.style('transform', (_d) => {
    //     return 'scale(1.1)';
    //   })
    //  .style('transform-origin', 'center');
}
