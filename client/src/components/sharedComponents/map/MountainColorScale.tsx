import React from 'react';
import styled from 'styled-components';
import {
  lightBorderColor,
  tertiaryColor,
} from '../../../styling/styleUtils';

const Root = styled.div`
  padding: 0.6rem 0;
  border-top: 1px solid ${lightBorderColor};
  border-left: 1px solid ${lightBorderColor};
  border-right: 1px solid ${lightBorderColor};
  background-color: ${tertiaryColor};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const LegendTitle = styled.h4`
  margin: 0.3rem 0 0.6rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  text-align: center;
  font-weight: 600;
  width: 100%;
  flex-shrink: 0;
`;
const LegendItem = styled.div`
  margin: 0 0.3rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const circleSmallScreenSize = 400; // in px

const Circle = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 4000px;
  margin-bottom: 0.2rem;

  @media (max-width: ${circleSmallScreenSize}px) {
    width: 14px;
    height: 14px;
  }
`;
const Icon = styled.img`
  width: 100%;
`;

const GridLegendLabel = styled(LegendItem)`
  white-space: nowrap;
  width: 15px;

  @media (max-width: ${circleSmallScreenSize}px) {
    width: 14px;
  }
`;
const GridLabelStart = styled(GridLegendLabel)`
  align-items: flex-start;
`;
const GridLabelEnd = styled(GridLegendLabel)`
  align-items: flex-end;
`;

const SeasonLabelStart = styled(LegendItem)`
  justify-content: center;
`;
const SeasonLabelEnd = styled(LegendItem)`
  justify-content: center;
`;

interface Props {
  colorScaleTitle?: string;
  colorScaleColors: string[];
  colorScaleLabels: string[];
  colorScaleSymbols: string[];
}

const ColorScale = (props: Props) => {
  const {
    colorScaleSymbols, colorScaleLabels, colorScaleTitle, colorScaleColors,
  } = props;

  const title = colorScaleTitle ? <LegendTitle>{colorScaleTitle}</LegendTitle> : null;
  const startColor = colorScaleColors[0];
  const endColor = colorScaleColors[colorScaleColors.length - 1];

  if (colorScaleSymbols.length === 0) {
    return null;
  }
  if (colorScaleSymbols.length <= 2) {
    const legendNodes = colorScaleSymbols.map((c, i) => {
      return (
        <LegendItem key={c} style={{color: colorScaleColors[i]}}>
          <Circle>
            <Icon src={require('./images/custom-icons/' + c + '.svg')} alt={'Mountain Icon'} />
          </Circle>
          {colorScaleLabels[i]}
        </LegendItem>
      );
    });
    return (
      <Root>
        {title}
        {legendNodes}
      </Root>
    );
  } else if (colorScaleSymbols.length < 8) {
    const legendNodes = colorScaleSymbols.map((c) => {
      return (
        <LegendItem key={c}>
          <Circle>
            <Icon src={require('./images/custom-icons/' + c + '.svg')} alt={'Mountain Icon'} />
          </Circle>
        </LegendItem>
      );
    });
    return (
      <Root>
        {title}
        <SeasonLabelStart style={{color: startColor}}>
          {colorScaleLabels[0]}
        </SeasonLabelStart>
        {legendNodes}
        <SeasonLabelEnd style={{color: endColor}}>
          {colorScaleLabels[colorScaleLabels.length - 1]}
        </SeasonLabelEnd>
      </Root>
    );
  } else {
    const legendNodes = colorScaleSymbols.map((c, i) => {
      if (i === 0 || i === 12) {
        return null;
      } else {
        return (
          <LegendItem key={c}>
            <Circle>
              <Icon src={require('./images/custom-icons/' + c + '.svg')} alt={'Mountain Icon'} />
            </Circle>
          </LegendItem>
        );
      }
    });
    return (
      <Root>
        {title}
        <GridLabelStart style={{color: startColor}}>
          <Circle>
              <Icon
                src={require('./images/custom-icons/' + colorScaleSymbols[0] + '.svg')}
                alt={'Mountain Icon'}
              />
          </Circle>
          {colorScaleLabels[0]}
        </GridLabelStart>
        {legendNodes}
        <GridLabelEnd style={{color: endColor}}>
          <Circle>
              <Icon
                src={require('./images/custom-icons/' + colorScaleSymbols[colorScaleSymbols.length - 1] + '.svg')}
                alt={'Mountain Icon'}
              />
          </Circle>
          {colorScaleLabels[colorScaleLabels.length - 1]}
        </GridLabelEnd>
      </Root>
    );
  }
};

export default ColorScale;
