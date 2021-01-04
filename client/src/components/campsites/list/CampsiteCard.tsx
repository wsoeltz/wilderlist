import upperFirst from 'lodash/upperFirst';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { CampsiteDatum } from '../../../queries/campsites/useGeoNearCampsites';
import { campsiteDetailLink } from '../../../routing/Utils';
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
  campsite: CampsiteDatum;
}

const CampsiteCard = ({ campsite }: Props) => {
  const { name, state } = campsite;
  const getString = useFluent();
  const type = upperFirst(getString('global-formatted-campsite-type', {type: campsite.type}));

  const stateName = state !== null ? (
    <>
      <Seperator>|</Seperator>
      {state.name}
    </>
  ) : null;

  return (
  <>
    <Root>
      <LinkWrapper
        to={campsiteDetailLink(campsite.id)}
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

export default CampsiteCard;
