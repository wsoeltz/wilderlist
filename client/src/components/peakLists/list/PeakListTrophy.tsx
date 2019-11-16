import React from 'react';
import styled from 'styled-components/macro';
import { listDetailWithMountainDetailLink } from '../../../routing/Utils';
import { tertiaryColor } from '../../../styling/styleUtils';
import DynamicLink from '../../sharedComponents/DynamicLink';
import MountainLogo from '../mountainLogo';
import { CardPeakListDatum } from './ListPeakLists';

const LinkWrapper = styled(DynamicLink)`
  display: block;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    color: inherit;
  }
`;

const dimensions = 13; // in rem
const dimensionsSmall = 8; // in rem

const Root = styled.div`
  width: ${dimensions}rem;
  height: ${dimensions}rem;
  padding: 0 1rem;

  &:hover {
    background-color: ${tertiaryColor};
  }

  @media(max-width: 500px) {
    width: ${dimensionsSmall}rem;
    height: ${dimensionsSmall}rem;
  }
`;

interface Props {
  peakList: CardPeakListDatum;
}

const PeakListCard = ({peakList}: Props) => {
  const { id, name, shortName, parent, type } = peakList;

  const mountainLogoId = parent === null ? id : parent.id;
  const desktopURL = listDetailWithMountainDetailLink(id, 'none');
  return (
    <LinkWrapper mobileURL={listDetailWithMountainDetailLink(id, 'none')} desktopURL={desktopURL}>
      <Root>
          <MountainLogo
            id={mountainLogoId}
            title={name}
            shortName={shortName}
            variant={type}
            active={true}
            completed={true}
          />
      </Root>
    </LinkWrapper>
  );
};

export default PeakListCard;
