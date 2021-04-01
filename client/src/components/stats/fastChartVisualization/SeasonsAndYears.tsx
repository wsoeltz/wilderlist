import {extent} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import React from 'react';
import DataViz, {
  ClusterChartDatum,
  VizType,
} from 'react-fast-charts';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  lightBorderColor,
  primaryColor,
} from '../../../styling/styleUtils';
import {
  Title,
} from '../styling';

const Root = styled.div`
  margin: -1rem 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Column = styled.div`
  padding: 1rem 0;

  &:first-of-type {
    border-right: dashed 1px ${lightBorderColor};
  }
`;

interface Props {
  summer: number;
  fall: number;
  winter: number;
  spring: number;
  years: Array<{year: number, count: number}>;
}

const SeasonsAndYears = (props: Props) => {
  const {summer, fall, winter, spring, years} = props;
  const getString = useFluent();
  const seasonsData: ClusterChartDatum[] =  summer || fall || winter || spring ? [] : [ // use ghost values
    {
      name: 'Summer',
      label: `Summer (0)`,
      value: 1,
      fill: '#87a51e',
      tooltipContent: `Summer (0)`,
    },
    {
      name: 'Fall',
      label: `Fall (0)`,
      value: 1,
      fill: '#b88700',
      tooltipContent: `Fall (0)`,
    },
    {
      name: 'Winter',
      label: `Winter (0)`,
      value: 1,
      fill: '#005e6c',
      tooltipContent: `Winter (0)`,
    },
    {
      name: 'Spring',
      label: `Spring (0)`,
      value: 1,
      fill: '#008e58',
      tooltipContent: `Spring (0)`,
    },
  ];

  if (summer) {
    seasonsData.push({
      name: 'Summer',
      label: `Summer (${summer})`,
      value: summer,
      fill: '#87a51e',
    });
  }
  if (fall) {
    seasonsData.push({
      name: 'Fall',
      label: `Fall (${fall})`,
      value: fall,
      fill: '#b88700',
    });
  }
  if (winter) {
    seasonsData.push({
      name: 'Winter',
      label: `Winter (${winter})`,
      value: winter,
      fill: '#005e6c',
    });
  }
  if (spring) {
    seasonsData.push({
      name: 'Spring',
      label: `Spring (${spring})`,
      value: spring,
      fill: '#008e58',
    });
  }

  const [min, max] = extent(years.map(y => y.count));
  const yearsColorScale = scaleLinear()
    .domain([min ? min : 0, max ? max : 1])
    .range([ '#cbe5ff' as any, primaryColor ]);
  const yearsData: ClusterChartDatum[] = years.length ? years.map(y => ({
    name: y.year.toString(),
    label: `${y.year}`,
    value: y.count,
    fill: yearsColorScale(y.count) as any as string,
  })) : [ // use ghost values
    {
      name: new Date().getFullYear().toString(),
      label: `${new Date().getFullYear()} (0)`,
      value: 1,
      fill: yearsColorScale(0.5) as any as string,
      tooltipContent: `${new Date().getFullYear()} (0)`,
    },
  ];

  return (
    <Root>
      <Column>
        <Title>{getString('stats-trips-seasons-title')}</Title>
        <DataViz
          id={'Total-trips-in-every-season'}
          vizType={VizType.ClusterChart}
          data={seasonsData}
          height={300}
        />
      </Column>
      <Column>
        <Title>{getString('stats-trips-years-title')}</Title>
        <DataViz
          id={'Total-trips-in-for-every-year'}
          vizType={VizType.ClusterChart}
          data={yearsData}
          height={300}
        />
      </Column>
    </Root>
  );
};

export default SeasonsAndYears;
