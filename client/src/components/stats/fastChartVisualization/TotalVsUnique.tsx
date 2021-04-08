import React from 'react';
import DataViz, {
  BarChartDatum,
  Legend,
  VizType,
} from 'react-fast-charts';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  SectionTitle,
} from '../../../styling/sharedContentStyles';
import {
  IconContainer,
  primaryColor,
} from '../../../styling/styleUtils';
import {
  mountainNeutralSvg,
  tentNeutralSvg,
  trailDefaultSvg,
} from '../../sharedComponents/svgIcons';
import {
  Title,
} from '../styling';

const barChartBlue = '#659dca';

const BarChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.75fr;
  align-items: center;
  position: relative;

  @media (max-width: 450px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto;
  }
`;

const Column = styled.div`
  text-align: center;
`;

const AboutColumn = styled.div`
  @media (max-width: 450px) {
    grid-column: 1 / -1;
    grid-row: 1;
  }
`;

const Label = styled.div`
  margin-top: -1rem;
`;

const Icon = styled(IconContainer)`
  margin: 0;
`;

const GhostOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.75);
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;

  &:before {
    display: block;
    content: "You haven\'t logged any trips yet";
  }
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
  const getString = useFluent();

  const totalVsUniqueMountainsData: BarChartDatum[][] = [
      [
        {
          x: '',
          y: totalMountains,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>${getString('global-text-value-mountains')}</strong>
              <div>
                <span class="label-text">${getString('stats-total-hiked')}:</span>
                <span class="value-text">${totalMountains}</span>
              </div>
              <div>
                <span class="label-text">${getString('stats-unique-hiked')}:</span>
                <span class="value-text">${uniqueMountains}</span>
              </div>
            </div>
          `,
          stroke: barChartBlue,
          fill: 'transparent',
        },
      ],
      [
        {
          x: '',
          y: uniqueMountains,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>${getString('global-text-value-mountains')}</strong>
              <div>
                <span class="label-text">${getString('stats-total-hiked')}:</span>
                <span class="value-text">${totalMountains}</span>
              </div>
              <div>
                <span class="label-text">${getString('stats-unique-hiked')}:</span>
                <span class="value-text">${uniqueMountains}</span>
              </div>
            </div>
          `,
          fill: barChartBlue,
        },
      ],
    ];
  const totalVsUniqueTrailsData: BarChartDatum[][] = [
      [
        {
          x: '',
          y: totalTrails,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>${getString('global-text-value-trails')}</strong>
              <div>
                <span class="label-text">${getString('stats-total-hiked')}:</span>
                <span class="value-text">${totalTrails}</span>
              </div>
              <div>
                <span class="label-text">${getString('stats-unique-hiked')}:</span>
                <span class="value-text">${uniqueTrails}</span>
              </div>
            </div>
          `,
          stroke: barChartBlue,
          fill: 'transparent',
        },
      ],
      [
        {
          x: '',
          y: uniqueTrails,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>${getString('global-text-value-trails')}</strong>
              <div>
                <span class="label-text">${getString('stats-total-hiked')}:</span>
                <span class="value-text">${totalTrails}</span>
              </div>
              <div>
                <span class="label-text">${getString('stats-unique-hiked')}:</span>
                <span class="value-text">${uniqueTrails}</span>
              </div>
            </div>
          `,
          fill: barChartBlue,
        },
      ],
    ];
  const totalVsUniqueCampsitesData: BarChartDatum[][] = [
      [
        {
          x: '',
          y: totalCampsites,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>${getString('global-text-value-campsites')}</strong>
              <div>
                <span class="label-text">${getString('stats-total-camped')}:</span>
                <span class="value-text">${totalCampsites}</span>
              </div>
              <div>
                <span class="label-text">${getString('stats-unique-hiked')}:</span>
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
          x: '',
          y: uniqueCampsites,
          tooltipContentOnly: true,
          tooltipContent: `
            <div class="react-fast-chart-tooltip">
              <strong>${getString('global-text-value-campsites')}</strong>
              <div>
                <span class="label-text">${getString('stats-total-camped')}:</span>
                <span class="value-text">${totalCampsites}</span>
              </div>
              <div>
                <span class="label-text">${getString('stats-unique-hiked')}:</span>
                <span class="value-text">${uniqueCampsites}</span>
              </div>
            </div>
          `,
          fill: barChartBlue,
        },
      ],
    ];

  const ghostOverlay = !totalMountains && !totalTrails && !totalCampsites ? <GhostOverlay /> : null;

  return (
    <>
      <Title>{getString('stats-total-vs-unique-title')}</Title>
      <BarChartContainer>
        <Column>
          <DataViz
            id={'Total-vs-Unique-mountains-Hiked'}
            vizType={VizType.BarChart}
            data={totalVsUniqueMountainsData}
            height={360}
            axisMinMax={{minY: 0, maxY: totalMountains > 10 ? totalMountains : 10}}
          />
          <Label>
            <Icon
              dangerouslySetInnerHTML={{__html: mountainNeutralSvg}}
              $color={primaryColor}
            />
            <SectionTitle>{getString('global-text-value-mountains')}</SectionTitle>
          </Label>
        </Column>
        <Column>
          <DataViz
            id={'Total-vs-Unique-trails-Hiked'}
            vizType={VizType.BarChart}
            data={totalVsUniqueTrailsData}
            height={360}
            axisMinMax={{minY: 0, maxY: totalTrails > 10 ? totalTrails : 10}}
          />
          <Label>
            <Icon
              dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
              $color={primaryColor}
            />
            <SectionTitle>{getString('global-text-value-trails')}</SectionTitle>
          </Label>
        </Column>
        <Column>
          <DataViz
            id={'Total-vs-Unique-campsites-Camped'}
            vizType={VizType.BarChart}
            data={totalVsUniqueCampsitesData}
            height={360}
            axisMinMax={{minY: 0, maxY: totalCampsites > 10 ? totalCampsites : 10}}
          />
          <Label>
            <Icon
              dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
              $color={primaryColor}
            />
            <SectionTitle>{getString('global-text-value-campsites')}</SectionTitle>
          </Label>
        </Column>
        <AboutColumn>
          <p>
            <small dangerouslySetInnerHTML={{__html: getString('stats-about-total') }} />
          </p>
          <p>
            <small dangerouslySetInnerHTML={{__html: getString('stats-about-unique') }} />
          </p>
          <Legend
            legendList={[
              {
                label: getString('global-text-total'),
                stroke: barChartBlue,
                fill: 'transparent',
              },
              {
                label: getString('global-text-unique'),
                fill: barChartBlue,
                stroke: undefined,
              },
            ]}
          />
        </AboutColumn>
        {ghostOverlay}
      </BarChartContainer>
    </>

  );
};

export default TotalVsUnique;
