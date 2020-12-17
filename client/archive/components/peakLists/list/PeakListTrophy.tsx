import React from 'react';
import styled from 'styled-components/macro';
import {
  dashboardWithListDetailLink,
  listDetailWithMountainDetailLink,
  otherUserPeakListDetailLink,
  otherUserPeakListLink,
  searchListDetailLink,
} from '../../../routing/Utils';
import {mediumSize, mobileSize} from '../../../Utils';
import DynamicLink from '../../sharedComponents/DynamicLink';
import MountainLogo from '../mountainLogo';
import { CardPeakListDatum } from './ListPeakLists';

const LinkWrapper = styled(DynamicLink)`
  display: block;
  color: inherit;
  text-decoration: inherit;
  flex-grow: 1;
  display: flex;
  justify-content: center;

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
  transition: transform 0.2s ease;
  transform: scale(0.92);

  &:hover {
    transform: scale(1);
  }

  @media(max-width: ${mediumSize}px) and (min-width: ${mobileSize}px) {
    width: ${dimensionsSmall}rem;
    height: ${dimensionsSmall}rem;
  }

  @media(max-width: 500px) {
    width: ${dimensionsSmall}rem;
    height: ${dimensionsSmall}rem;
  }
`;

interface Props {
  peakList: CardPeakListDatum;
  profileId: string | undefined;
  dashboardView: boolean;
}

const PeakListCard = ({peakList, profileId, dashboardView}: Props) => {
  const { id, name, shortName, parent, type  } = peakList;

  const mountainLogoId = parent === null ? id : parent.id;
  let desktopURL: string;
  if (profileId !== undefined) {
    desktopURL = otherUserPeakListLink(profileId, id);
  } else if (dashboardView === true) {
    desktopURL = dashboardWithListDetailLink(id);
  } else {
    desktopURL = searchListDetailLink(id);
  }
  const mobileURL = profileId !== undefined
    ? otherUserPeakListDetailLink(profileId, id) : listDetailWithMountainDetailLink(id, 'none');
  return (
    <LinkWrapper mobileURL={mobileURL} desktopURL={desktopURL}>
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