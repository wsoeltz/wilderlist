import {faMedal} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {
  SectionTitle,
} from '../../../styling/sharedContentStyles';
import {
  baseColor,
  BasicIconInTextCompact,
  IconContainer,
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
  grid-template-columns: 1fr 115px;
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
  font-size: 0.8rem;
`;

const Image = styled.img`
  width: 90px;
  height: 90px;
  margin: 0.5rem auto;
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
  margin-bottom: 0.5rem;
  color: ${lightBaseColor};
`;

const GoalDesc = styled.div`
  font-size: 0.7rem;
  color: ${lightBaseColor};
  text-align: center;
`;

const PercentContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
`;

const VizContainer = styled.div`
  position: relative;
`;

const GhostChart = styled.div`
  color: ${lightBaseColor};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 320px;
  background-color: rgba(255, 255, 255, 0.85);
  position: absolute;
  top: 0;
  left: 0;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${baseColor};
`;

interface Props {
  title: string;
  data: Array<{date: Date, value: number}>;
  goals: Array<{name: string, image: string, desc: string, value: number}>;
  units: string;
  disclaimer: string;
  icon: string;
  noDataMessage: string;
}

const ProgressLineChart = (props: Props) => {
  const {data, goals, units, title, disclaimer, icon, noDataMessage} = props;
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
  const ghostOverlay = data.length ? null : (
    <GhostChart>
      {noDataMessage}
    </GhostChart>
  );
  return (
    <>
      <Title>
        <IconContainer
          $color={primaryColor}
          dangerouslySetInnerHTML={{__html: icon}}
        />
        {title}
      </Title>
      <Root>
        <VizContainer>
          <DataViz
            id='lifetime-elevation-line-chart'
            vizType={VizType.LineProgressChart}
            data={data}
            units={units}
            height={320}
            goals={goals}
          />
          {ghostOverlay}
        </VizContainer>
        {nextGoalEl}
      </Root>
      <Subtext><small>{disclaimer}</small></Subtext>
    </>
  );
};

export default ProgressLineChart;
