// import orderBy from 'lodash/orderBy';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  Subtext,
} from '../../../styling/styleUtils';
import DataViz, {
  VizType,
} from '../d3Viz';
import {
  Title,
} from '../styling';

const Root = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 8rem;
`;

const goals: Array<{name: string, link: string, desc: string, value: number}> = [
  {name: 'Everst', link: '', desc: '', value: 29_032},
  {name: 'Bottom of Ozone Layer', link: '', desc: '', value: 47_520},
  {name: 'Olympus Mons', link: '', desc: '', value: 69_841},
  {name: 'Top of Ozone Layer', link: '', desc: '', value: 116_160},
  {name: 'Cumulative height of the 7-Summits', link: '', desc: '', value: 142_114},
  {name: 'Kármán line', link: '', desc: '', value: 330_000},
  {name: 'International Space Station', link: '', desc: '', value: 1_341_120},
  {name: 'Edge of Earth\'s atmosphere', link: '', desc: '', value: 623_390_000},
  {name: 'Moon', link: '', desc: '', value: 1_261_392_000},
  {name: 'Mars', link: '', desc: '', value: 178_992_000_000},
  {name: 'Sun', link: '', desc: '', value: 490_516_752_000},
];

interface Props {
  elevationDataPoints: Array<{date: Date, value: number}>;
}

const Top10 = (props: Props) => {
  const {elevationDataPoints} = props;
  const getString = useFluent();
  return (
    <>
      <Title>
        {getString('stats-total-lifetime-elevation')}
      </Title>
      <Root>
        <div>
          <DataViz
            id='lifetime-elevation-line-chart'
            vizType={VizType.LineProgressChart}
            data={elevationDataPoints}
            units={'ft'}
            height={250}
            goals={goals}
          />
          <Subtext><small>{getString('stats-total-lifetime-context-note')}</small></Subtext>
        </div>
        <div>
          Upcoming Goal:
        </div>
      </Root>
    </>
  );
};

export default Top10;
