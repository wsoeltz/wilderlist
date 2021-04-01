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
  const seasonsData: ClusterChartDatum[] = [
    {
      name: 'Summer',
      label: `Summer (${summer})`,
      value: summer,
      fill: '#87a51e',
    },
    {
      name: 'Fall',
      label: `Fall (${fall})`,
      value: fall,
      fill: '#b88700',
    },
    {
      name: 'Winter',
      label: `Winter (${winter})`,
      value: winter,
      fill: '#005e6c',
    },
    {
      name: 'Spring',
      label: `Spring (${spring})`,
      value: spring,
      fill: '#008e58',
    },
  ];

  const [min, max] = extent(years.map(y => y.count));
  const yearsColorScale = scaleLinear()
    .domain([min ? min : 0, max ? max : 1])
    .range([ '#cbe5ff' as any, primaryColor ]);
  const yearsData: ClusterChartDatum[] = years.map(y => ({
    name: y.year.toString(),
    label: `${y.year}`,
    value: y.count,
    fill: yearsColorScale(y.count) as any as string,
  }));

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
