import React from 'react';
import { mountainDetailLink, searchMountainsDetailLink } from '../../../routing/Utils';
import {
  Card,
  CardLinkWrapper,
  CardSubtitle,
  CardTitle,
  CollapsedParagraph,
} from '../../../styling/styleUtils';
import { MountainDatum } from './ListMountains';

interface Props {
  mountain: MountainDatum;
}

const MountainCard = ({ mountain }: Props) => {
  const { name, elevation, state } = mountain;
  const stateName = state !== null ? state.name : '';

  return (
    <CardLinkWrapper
      mobileURL={mountainDetailLink(mountain.id)}
      desktopURL={searchMountainsDetailLink(mountain.id)}
    >
      <Card>
        <CardTitle>{name}</CardTitle>
        <CardSubtitle>
          <CollapsedParagraph>
            {stateName}
          </CollapsedParagraph>
          <CollapsedParagraph>
            {elevation}ft
          </CollapsedParagraph>
        </CardSubtitle>
      </Card>
    </CardLinkWrapper>
  );
};

export default MountainCard;
