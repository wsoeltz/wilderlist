import React from 'react';
import styled from 'styled-components/macro';
import { mountainDetailLink, searchMountainsDetailLink } from '../../../routing/Utils';
import {
  CardFooterButton,
  CardFooterLink,
  CardSubtitle,
  CardTitle,
  CollapsedParagraph,
  locationColor,
  secondaryColor,
  Seperator,
  StackableCardFooter,
  StackableCardSection,
  StackedCardWrapper,
} from '../../../styling/styleUtils';
import { MountainDatum } from './ListMountains';

const Root = styled.div`
  margin-bottom: 2rem;
`;

const LinkWrapper = styled(StackedCardWrapper)`
  margin-bottom: 0;
`;

const CardFooter = styled(StackableCardFooter)`
  border-left-width: 0;
`;

const OverviewLink = styled(CardFooterLink)`
  width: 50%;
  color: ${secondaryColor};

  &:hover {
    color: #fff;
  }
`;

const MapButton = styled(CardFooterButton)`
  width: 50%;
  color: ${secondaryColor};

  &:hover {
    color: #fff;
  }
`;

interface Props {
  mountain: MountainDatum;
  setHighlighted: (highlighted: MountainDatum[]) => void;
}

const MountainCard = ({ mountain, setHighlighted }: Props) => {
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
        mobileURL={mountainDetailLink(mountain.id)}
        desktopURL={searchMountainsDetailLink(mountain.id) + window.location.search}
      >
        <StackableCardSection>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle>
            <CollapsedParagraph>
              {elevation}ft
              {stateName}
            </CollapsedParagraph>
          </CardSubtitle>
        </StackableCardSection>
      </LinkWrapper>
      <CardFooter>
        <OverviewLink
          mobileURL={mountainDetailLink(mountain.id)}
          desktopURL={searchMountainsDetailLink(mountain.id) + window.location.search}
          color={secondaryColor}
          $isActive={false}
        >
          View details
        </OverviewLink>
        <MapButton
          color={locationColor}
          $isActive={false}
          onClick={() => setHighlighted([mountain])}
        >
          Show on map
        </MapButton>
      </CardFooter>
    </Root>

  </>
  );
};

export default MountainCard;
