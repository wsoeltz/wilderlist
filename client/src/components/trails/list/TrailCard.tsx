import upperFirst from 'lodash/upperFirst';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { TrailDatum } from '../../../queries/trails/useGeoNearTrails';
import { trailDetailLink } from '../../../routing/Utils';
import {
  Card,
  CardSubtitle,
  CardTitle,
  CollapsedParagraph,
  Seperator,
  StackedCardWrapper,
} from '../../../styling/styleUtils';

const Root = styled.div`
  margin-bottom: 2rem;
`;

const LinkWrapper = styled(StackedCardWrapper)`
  margin-bottom: 0;
`;

const Details = styled(CollapsedParagraph)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.8rem;
  margin: 0.4rem 0 0;
`;

interface Props {
  trail: TrailDatum;
}

const TrailCard = ({ trail }: Props) => {
  const { name, states } = trail;
  const getString = useFluent();
  const type = upperFirst(getString('global-formatted-trail-type', {type: trail.type}));

  const stateName = states !== null && states.length ? (
    <>
      <Seperator>|</Seperator>
      {states.map(s => s.name).join(', ')}
    </>
  ) : null;

  return (
  <>
    <Root>
      <LinkWrapper
        to={trailDetailLink(trail.id)}
      >
        <Card>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle>
            <Details>
              <span>
                {type}
                {stateName}
              </span>
            </Details>
          </CardSubtitle>
        </Card>
      </LinkWrapper>
    </Root>

  </>
  );
};

export default TrailCard;
