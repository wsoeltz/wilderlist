import orderBy from 'lodash/orderBy';
import React from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {campsiteDetailLink, mountainDetailLink, trailDetailLink} from '../../../routing/Utils';
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
import DataViz, {
  VizType,
} from '../d3Viz';
import {
  Title,
} from '../styling';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 1rem -1rem 0;
`;

const Column = styled.div`
  text-align: center;
`;

const Icon = styled(IconContainer)`
  margin: 0;
`;

interface Props {
  allMountains: Array<{id: string, name: string, numDates: number}>;
  allTrails: Array<{id: string, name: string, numDates: number}>;
  allCampsites: Array<{id: string, name: string, numDates: number}>;
}

const Top10 = (props: Props) => {
  const {allMountains, allTrails, allCampsites} = props;
  const {push} = useHistory();
  const getString = useFluent();
  const topPeaks = orderBy(allMountains, ['numDates'], ['desc']).slice(0, 10).map((d, i) => ({
    label: (i + 1) + '. ' + d.name, value: d.numDates,
    onClick: () => push(mountainDetailLink(d.id)),
  })).reverse();
  const topTrails = orderBy(allTrails, ['numDates'], ['desc']).slice(0, 10).map((d, i) => ({
    label: (i + 1) + '. ' + d.name, value: d.numDates,
    onClick: () => push(trailDetailLink(d.id)),
  })).reverse();
  const topCampsites = orderBy(allCampsites, ['numDates'], ['desc']).slice(0, 10).map((d, i) => ({
    label: (i + 1) + '. ' + d.name, value: d.numDates,
    onClick: () => push(campsiteDetailLink(d.id)),
  })).reverse();
  return (
    <>
      <Title>{getString('stats-top-10-title')}</Title>
      <Root>
        <Column>
          <div>
            <Icon
              dangerouslySetInnerHTML={{__html: mountainNeutralSvg}}
              $color={primaryColor}
            />
            <SectionTitle>{getString('global-text-hiked-mountains')}</SectionTitle>
          </div>
          <DataViz
            id='top-10-peaks-hiked'
            vizType={VizType.HorizontalBarChart}
            data={topPeaks}
          />
        </Column>
        <Column>
          <div>
            <Icon
              dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
              $color={primaryColor}
            />
            <SectionTitle>{getString('global-text-hiked-trails')}</SectionTitle>
          </div>
          <DataViz
            id='top-10-trails-hiked'
            vizType={VizType.HorizontalBarChart}
            data={topTrails}
          />
        </Column>
        <Column>
          <div>
            <Icon
              dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
              $color={primaryColor}
            />
            <SectionTitle>{getString('global-text-camped-at')}</SectionTitle>
          </div>
          <DataViz
            id='top-10-campsites-hiked'
            vizType={VizType.HorizontalBarChart}
            data={topCampsites}
          />
        </Column>
      </Root>
    </>
  );
};

export default Top10;
