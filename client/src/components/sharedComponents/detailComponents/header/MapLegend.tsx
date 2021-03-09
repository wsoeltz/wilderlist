import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {
  contentColumnIdeal,
  contentColumnMax,
  contentColumnMin,
} from '../../../../styling/Grid';
import {
  SimpleTitle,
} from '../../../../styling/sharedContentStyles';
import {
  completionColorScaleArray,
  lightBorderColor,
  Subtext,
} from '../../../../styling/styleUtils';
import {PeakListVariants} from '../../../../types/graphQLTypes';
import {mobileSize} from '../../../../Utils';

const Root = styled.div`
  @media(max-width: ${mobileSize}px) {
    margin: -0.7rem -1rem 0.7rem;
  }

  @media(min-width: ${mobileSize + 1}px) {
    width: calc(100vw - clamp(${contentColumnMin}px, ${contentColumnIdeal}vw, ${contentColumnMax}px));
    position: fixed;
    right: 0;
    bottom: 1.5rem;
    pointer-events: none;
    display: flex;
    justify-content: center;
  }
`;

const Content = styled.div`
  pointer-events: all;
  background-color: #fff;
  padding: 0.5rem;
  text-align: center;
  box-sizing: border-box;

  @media(max-width: ${mobileSize}px) {
    width: 100%;
    border-bottom: solid 1px ${lightBorderColor};
  }

  @media(min-width: ${mobileSize + 1}px) {
    border-radius: 8px;
    box-shadow: 0px 0px 3px -1px #b5b5b5;
  }
`;

const Title = styled(SimpleTitle)`
  padding: 0;
  margin-bottom: 0.25rem;
`;

const LegendTitleLeft = styled(SimpleTitle)`
  padding-right: 0.55rem;
  margin-bottom: 0.25rem;
`;
const LegendTitleRight = styled(SimpleTitle)`
  padding-left: 0.55rem;
  margin-bottom: 0.25rem;
`;

const BarGrid = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  width: 100%;
  text-align: center;
  max-width: 375px;
  margin: auto;
`;

const ColorBlock = styled.div`
  height: 0.5rem;
  border: solid 1px #fff;
  margin: auto 0;
`;

const ColorBlockWithText = styled(ColorBlock)`
  margin: auto 0 1rem;

  div {
    transform: translateY(60%);
  }
`;

interface Props {
  type: PeakListVariants | 'comparison' | null;
  hasMountains: boolean;
  hasTrails: boolean;
  hasCampsites: boolean;
}

const MapLegend = (props: Props) => {
  const {
    type, hasMountains, hasTrails, hasCampsites,
  } = props;
  const getString = useFluent();
  const whatsColoredArray: string[] = [];
  if (hasMountains) {
    whatsColoredArray.push(getString('global-text-value-mountains'));
  }
  if (hasTrails) {
    whatsColoredArray.push(getString('global-text-value-trails'));
  }
  if (hasCampsites) {
    whatsColoredArray.push(getString('global-text-value-campsites'));
  }
  const whatsColored = whatsColoredArray.length === 3 ? 'Points ' : whatsColoredArray.join('/') + ' ';

  let title = '----------------';
  let barValues: Array<React.ReactElement<any>> = [
    <ColorBlock key={'map-legend-blank-color-block'} />,
  ];
  if (type === PeakListVariants.grid) {
    title = whatsColored + getString('map-number-of-months');
    barValues = completionColorScaleArray.map(backgroundColor => (
        <ColorBlock
          key={'MapLegendKey' + backgroundColor}
          style={{backgroundColor}}
        />
      ),
    );
    barValues.push(
      <LegendTitleRight key={'MapLegend-map-all-months'}>
        <Subtext>
          {getString('map-all-months')}
        </Subtext>
      </LegendTitleRight>,
    );
    barValues.unshift(
      <LegendTitleLeft key={'MapLegend-map-no-months'}>
        <Subtext>
          {getString('map-no-months')}
        </Subtext>
      </LegendTitleLeft>,
    );
  } else if (type === PeakListVariants.fourSeason) {
    title = whatsColored + getString('map-number-of-seasons');
    barValues = completionColorScaleArray
      .filter((_unused, i) => i === 0 || i === 3 || i === 6 || i === 9 || i === 12)
      .map(backgroundColor => (
        <ColorBlock
          key={'MapLegendKey' + backgroundColor}
          style={{backgroundColor}}
        />
      ),
    );
    barValues.push(
      <LegendTitleRight key={'MapLegend-map-all-seasons'}>
        <Subtext>
          {getString('map-all-seasons')}
        </Subtext>
      </LegendTitleRight>,
    );
    barValues.unshift(
      <LegendTitleLeft key={'MapLegend-map-no-seasons'}>
        <Subtext>
          {getString('map-no-seasons')}
        </Subtext>
      </LegendTitleLeft>,
    );
  } else if (type === PeakListVariants.winter) {
    title = whatsColored + getString('map-completed-colored-winter');
    barValues = completionColorScaleArray
      .filter((_unused, i) => i === 0 || i === 12)
      .map(backgroundColor => (
        <ColorBlock
          key={'MapLegendKey' + backgroundColor}
          style={{backgroundColor}}
        />
      ),
    );
    barValues.push(
      <LegendTitleRight key={'MapLegend-global-text-value-done'}>
        <Subtext>
          {getString('global-text-value-done')}
        </Subtext>
      </LegendTitleRight>,
    );
    barValues.unshift(
      <LegendTitleLeft key={'MapLegend-global-text-value-not-done'}>
        <Subtext>
          {getString('global-text-value-not-done')}
        </Subtext>
      </LegendTitleLeft>,
    );
  } else if (type === PeakListVariants.standard) {
    title = whatsColored + getString('map-completed-colored');
    barValues = completionColorScaleArray
      .filter((_unused, i) => i === 0 || i === 12)
      .map(backgroundColor => (
        <ColorBlock
          key={'MapLegendKey' + backgroundColor}
          style={{backgroundColor}}
        />
      ),
    );
    barValues.push(
      <LegendTitleRight key={'MapLegend-global-text-value-done'}>
        <Subtext>
          {getString('global-text-value-done')}
        </Subtext>
      </LegendTitleRight>,
    );
    barValues.unshift(
      <LegendTitleLeft key={'MapLegend-global-text-value-not-done'}>
        <Subtext>
          {getString('global-text-value-not-done')}
        </Subtext>
      </LegendTitleLeft>,
    );
  } else if (type === 'comparison') {
    title = whatsColored + getString('map-completed-colored');
    barValues = completionColorScaleArray
      .filter((_unused, i) => i === 0 || i === 6 || i === 12)
      .map((backgroundColor, i) => {
        let labelText: string;
        if (i === 0) {
          labelText = getString('global-text-value-neither-hiked');
        } else if (i === 1) {
          labelText = getString('global-text-value-one-hiked');
        } else {
          labelText = getString('global-text-value-both-hiked');
        }
        return (
          <ColorBlockWithText
            key={'MapLegendKey' + backgroundColor}
            style={{backgroundColor}}
          >
            <Title>
              <Subtext>
                {labelText}
              </Subtext>
            </Title>
          </ColorBlockWithText>
        );
    });
  }

  return (
   <Root>
      <Content>
        <Title style={!type ? {opacity: 0} : undefined}>
          <small>{title}</small>
        </Title>
        <BarGrid>
          {barValues}
        </BarGrid>
      </Content>
    </Root>
  );
};

export default MapLegend;
