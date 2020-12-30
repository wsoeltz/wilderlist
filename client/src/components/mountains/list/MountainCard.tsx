import {
  faMountain,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import { mountainDetailLink } from '../../../routing/Utils';
import {
  BasicIconInText,
  Card,
  CardSubtitle,
  CardTitle,
  CollapsedParagraph,
  Seperator,
  StackedCardWrapper,
} from '../../../styling/styleUtils';
import { MountainDatum } from './ListMountains';

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
  mountain: MountainDatum;
}

const MountainCard = ({ mountain }: Props) => {
  const { name, elevation, state } = mountain;

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
        to={mountainDetailLink(mountain.id)}
      >
        <Card>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle>
            <Details>
              <span>
                <BasicIconInText icon={faMountain} />
                {elevation}ft
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

export default MountainCard;
