import {faMedal} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {
  SectionTitle,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInTextCompact,
  lightBaseColor,
  primaryColor,
  secondaryFont,
  Subtext,
  tertiaryColor,
} from '../../../styling/styleUtils';
import {formatNumber} from '../../../Utils';
import SimplePercentBar from '../../sharedComponents/listComponents/SimplePercentBar';
import DataViz, {
  VizType,
} from '../d3Viz';
import {
  Title,
} from '../styling';

const Root = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 110px;
  grid-column-gap: 0.5rem;
`;

const GoalColumn = styled.div`
  padding: 0.5rem 0.25rem;
  background-color: ${tertiaryColor};
  display: flex;
  flex-direction: column;
`;

const GoalTitle = styled(SectionTitle)`
  text-align: center;
  font-size: 0.875rem;
`;

const Image = styled.img`
  width: 90px;
  height: 90px;
  margin: 0.875rem auto;
  display: block;
`;

const GoalText = styled.div`
  font-family: ${secondaryFont};
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.2rem;
`;

const GoalValue = styled.div`
  text-align: center;
  font-size: 0.8rem;
  margin-bottom: 0.65rem;
  color: ${lightBaseColor};
`;

const GoalDesc = styled.div`
  font-size: 0.75rem;
  color: ${lightBaseColor};
  text-align: center;
`;

const PercentContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
`;

interface Props {
  title: string;
  data: Array<{date: Date, value: number}>;
  goals: Array<{name: string, image: string, desc: string, value: number}>;
  units: string;
  disclaimer: string;
}

const ProgressLineChart = (props: Props) => {
  const {data, goals, units, title, disclaimer} = props;
  const maxValue = data && data.length && data[data.length - 1]
    ? data[data.length - 1].value : 0;
  let nextGoal = goals.find((g, i) => g.value > maxValue && (i === 0 || goals[i - 1].value <= maxValue));
  nextGoal = nextGoal ? nextGoal : goals[goals.length - 1];
  const percent = nextGoal && maxValue ? parseFloat((maxValue / nextGoal.value * 100).toFixed(1)) : 0;
  const nextGoalEl = nextGoal ? (
    <GoalColumn>
      <GoalTitle>
        <BasicIconInTextCompact style={{color: primaryColor}} icon={faMedal} />
        Next Goal
      </GoalTitle>
      <Image
        src={nextGoal.image}
      />
      <GoalText>{nextGoal.name}</GoalText>
      <GoalValue>{formatNumber(nextGoal.value)} {units}</GoalValue>
      <GoalDesc>{nextGoal.desc}</GoalDesc>
      <PercentContainer>
        <SimplePercentBar text={'there'} percent={percent} />
      </PercentContainer>
    </GoalColumn>
  ) : null;
  return (
    <>
      <Title>
        {title}
      </Title>
      <Root>
        <div>
          <DataViz
            id='lifetime-elevation-line-chart'
            vizType={VizType.LineProgressChart}
            data={data}
            units={units}
            height={300}
            goals={goals}
          />
        </div>
        {nextGoalEl}
      </Root>
      <Subtext><small>{disclaimer}</small></Subtext>
    </>
  );
};

export default ProgressLineChart;
