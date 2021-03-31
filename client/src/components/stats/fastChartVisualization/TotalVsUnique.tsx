import {rgba} from 'polished';
import React from 'react';
import DataViz, {
  BarChartDatum,
  Legend,
  VizType,
} from 'react-fast-charts';
import styled from 'styled-components/macro';
import {
  primaryColor,
} from '../../../styling/styleUtils';
import {
  Title,
} from '../styling';

const barChartBlue = rgba(primaryColor, 0.7);

const BarChartContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.65fr;
  align-items: center;
`;

interface Props {
  totalMountains: number;
  uniqueMountains: number;
  totalTrails: number;
  uniqueTrails: number;
  totalCampsites: number;
  uniqueCampsites: number;
}

const TotalVsUnique = (props: Props) => {
  const {
    totalMountains,
    uniqueMountains,
    totalTrails,
    uniqueTrails,
    totalCampsites,
    uniqueCampsites,
  } = props;

  const totalVsUniqueData: BarChartDatum[][] = [
      [
        {
          x: 'Mountains',
          y: totalMountains,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>Mountains</strong>
              <div>
                <span class="label-text">Total hiked:</span>
                <span class="value-text">${totalMountains}</span>
              </div>
              <div>
                <span class="label-text">Unique hiked:</span>
                <span class="value-text">${uniqueMountains}</span>
              </div>
            </div>
          `,
          stroke: barChartBlue,
          fill: 'transparent',
        },
        {
          x: 'Trails',
          y: totalTrails,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>Trails</strong>
              <div>
                <span class="label-text">Total hiked:</span>
                <span class="value-text">${totalTrails}</span>
              </div>
              <div>
                <span class="label-text">Unique hiked:</span>
                <span class="value-text">${uniqueTrails}</span>
              </div>
            </div>
          `,
          stroke: barChartBlue,
          fill: 'transparent',
        },
        {
          x: 'Campsites',
          y: totalCampsites,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>Campsites</strong>
              <div>
                <span class="label-text">Total stayed at:</span>
                <span class="value-text">${totalCampsites}</span>
              </div>
              <div>
                <span class="label-text">Unique stayed at:</span>
                <span class="value-text">${uniqueCampsites}</span>
              </div>
            </div>
          `,
          stroke: barChartBlue,
          fill: 'transparent',
        },
      ],
      [
        {
          x: 'Mountains',
          y: uniqueMountains,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>Mountains</strong>
              <div>
                <span class="label-text">Total hiked:</span>
                <span class="value-text">${totalMountains}</span>
              </div>
              <div>
                <span class="label-text">Unique hiked:</span>
                <span class="value-text">${uniqueMountains}</span>
              </div>
            </div>
          `,
          fill: barChartBlue,
        },
        {
          x: 'Trails',
          y: uniqueTrails,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>Trails</strong>
              <div>
                <span class="label-text">Total hiked:</span>
                <span class="value-text">${totalTrails}</span>
              </div>
              <div>
                <span class="label-text">Unique hiked:</span>
                <span class="value-text">${uniqueTrails}</span>
              </div>
            </div>
          `,
          fill: barChartBlue,
        },
        {
          x: 'Campsites',
          y: uniqueCampsites,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>Campsites</strong>
              <div>
                <span class="label-text">Total stayed at:</span>
                <span class="value-text">${totalCampsites}</span>
              </div>
              <div>
                <span class="label-text">Unique stayed at:</span>
                <span class="value-text">${uniqueCampsites}</span>
              </div>
            </div>
          `,
          fill: barChartBlue,
        },
      ],
    ];

  return (
    <>
      <Title>Total vs Unique Points Hiked/Camped</Title>
      <BarChartContainer>
        <DataViz
          id={'Total-vs-Unique-Points-Hiked-Camped'}
          vizType={VizType.BarChart}
          data={totalVsUniqueData}
          height={300}
        />
        <Legend
          legendList={[
            {
              label: 'Total',
              stroke: barChartBlue,
              fill: 'transparent',
            },
            {
              label: 'Unique',
              fill: barChartBlue,
              stroke: undefined,
            },
          ]}
        />
      </BarChartContainer>
    </>

  );
};

export default TotalVsUnique;
