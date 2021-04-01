import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import DataViz, {
  HorizontalLegend,
  LeafDatum,
  RootDatum,
  VizType,
} from 'react-fast-charts';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  Title,
} from '../styling';

const Root = styled.div`
  text {
    paint-order: stroke;
    fill: #fff;
    font-weight: 600;
    stroke: #999;
    letter-spacing: 0.1px;
    stroke-width: 1px;
  }
`;

const LegendRoot = styled.div`
  div {
    font-size: 0.75rem;
    font-weight: 600;
    white-space: pre;
  }
`;

const colorScheme = [
  '#206ca6',
  '#0083b4',
  '#0099b4',
  '#00aca5',
  '#10bd8c',
  '#77ca70',
  '#bcd25b',
  '#ffd459',
  '#3a6ea6',
  '#7673b6',
  '#ae74b9',
  '#de77ad',
  '#ff8096',
  '#ff957c',
  '#ffb264',
  '#ffd459',
  '#9c3535',
  '#a8542f',
  '#ad7230',
  '#ac913c',
  '#a5ae55',
  '#9bca79',
  '#8ce5a6',
  '#7dffd9',
  '#869c86',
  '#8e986e',
  '#a19057',
  '#bb834c',
  '#d57053',
  '#e65a6f',
  '#e74b9a',
  '#cb53cf',
  '#819c84',
  '#639b87',
  '#359993',
  '#0095a6',
  '#008fbc',
  '#0086ce',
  '#0078d6',
  '#6863cf',
  '#279c3c',
  '#67992c',
  '#8d952b',
  '#a99038',
  '#be8c4b',
  '#cb8a62',
  '#d18b7a',
  '#cf8f8f',
  '#91883f',
  '#ac8549',
  '#c1825a',
  '#cf8172',
  '#d5848c',
  '#d28aa6',
  '#c994bd',
  '#ba9fcf',
  '#423e1d',
  '#5f4d33',
  '#785e4e',
  '#8d716a',
  '#9f8687',
  '#ae9da2',
  '#bdb4ba',
  '#cecccf',
];

interface Props {
  data: Array<{dateAsNumber: number, county: string, state: string}>;
}

const CountyTreemap = (props: Props) => {
  const {data} = props;
  const getString = useFluent();

  const treemapData: RootDatum = {
    id: 'tree-map-top-level-parent',
    label: 'USA',
    children: [],
  };

  const total = data.length;

  const allTripsUniqueByDateCountyState = uniqBy(data, d => d.dateAsNumber + d.county + d.state);
  const tripsGroupedByState = groupBy(allTripsUniqueByDateCountyState, 'state');
  let currentColor: number = 0;
  for (const key in tripsGroupedByState) {
    if (key.length === 2) {
      const countyGroups = groupBy(tripsGroupedByState[key], 'county');
      const children: LeafDatum[] = [];
      for (const county in countyGroups) {
        if (countyGroups[county] !== undefined) {
          const percent = parseFloat((countyGroups[county].length / total * 100).toFixed(1));
          children.push({
            id: county,
            label: county + ', ' + key,
            tooltipContent: `
              <div class="react-fast-chart-tooltip">
                <strong>${county}, ${key}</strong>
                <div>
                  <span class="label-text">${getString('stats-percent-of-all-trips')}:</span>
                  <span class="value-text">${percent}%</span>
                </div>
                <div>
                  <span class="label-text">${getString('stats-total-trips-here')}:</span>
                  <span class="value-text">${countyGroups[county].length}</span>
                </div>
              </div>
            `,
            size: percent,
          });
        }
      }

      treemapData.children.push({
        id: key,
        label: key,
        fill: colorScheme[currentColor],
        children,
      });
      currentColor++;
      if (currentColor >= colorScheme.length) {
        currentColor = 0;
      }
    }
  }

  const legendList = orderBy(treemapData.children.map(c => {
    const percent = (c as RootDatum).children.reduce((value, cc) => value += (cc as LeafDatum).size, 0);

    return {
      label: `${c.label}\n${parseFloat(percent.toFixed(1))}%`,
      fill: (c as RootDatum).fill,
      stroke: undefined,
      value: percent,
    };
  }), ['value'], ['desc']);

  return (
    <Root>
      <Title>{getString('stats-total-trips-title')}</Title>
      <br />
      <DataViz
        id={'county-state-trip-tree-map'}
        vizType={VizType.TreeMap}
        data={treemapData}
        height={350}
      />
      <LegendRoot>
        <HorizontalLegend
          legendList={legendList}
        />
      </LegendRoot>
    </Root>
  );
};

export default CountyTreemap;
