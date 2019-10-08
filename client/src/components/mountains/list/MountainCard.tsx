// import { GetString } from 'fluent-react';
import React from 'react';
import styled from 'styled-components';
// import {
//   AppLocalizationAndBundleContext,
// } from '../../../contextProviders/getFluentLocalizationContext';
import { mountainDetailLink, searchMountainsDetailLink } from '../../../routing/Utils';
import {
  Card,
  lightBaseColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import DynamicLink from '../../sharedComponents/DynamicLink';
import { MountainDatum } from './ListMountains';

const LinkWrapper = styled(DynamicLink)`
  display: block;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    color: inherit;
  }
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 0.4rem;
`;

const Subtitle = styled.div`
  color: ${lightBaseColor};
  margin: 0.4rem 0;
  display: flex;
  justify-content: space-between;
  font-weight: ${semiBoldFontBoldWeight};
`;

interface Props {
  mountain: MountainDatum;
}

const MountainCard = ({ mountain }: Props) => {
  const { name, elevation, state } = mountain;
  const stateName = state !== null ? state.name : '';

  return (
    <LinkWrapper
      mobileURL={mountainDetailLink(mountain.id)}
      desktopURL={searchMountainsDetailLink(mountain.id)}
    >
      <Card>
        <Title>{name}</Title>
        <Subtitle>
          <div>
            {stateName}
          </div>
          <div>
            {elevation}ft
          </div>
        </Subtitle>
      </Card>
    </LinkWrapper>
  );
};

export default MountainCard;
