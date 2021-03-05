const {point, featureCollection} = require('@turf/helpers');
const getCenter = require('@turf/center').default;
import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import useMapContext from '../../../hooks/useMapContext';
import { CardPeakListDatum } from '../../../queries/lists/getUsersPeakLists';
import {
  listDetailLink,
  otherUserPeakListLink,
} from '../../../routing/Utils';
import {AggregateItem} from '../../../types/itemTypes';
import {mediumSize, mobileSize} from '../../../Utils';
import MountainLogo from '../mountainLogo';

const LinkWrapper = styled(Link)`
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

const dimensions = 9; // in rem
const dimensionsSmall = 9; // in rem

const Root = styled.div`
  width: ${dimensions}rem;
  height: ${dimensions}rem;
  transition: transform 0.2s ease;
  transform: scale(0.92);
  user-select: none;

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
}

const PeakListCard = ({peakList, profileId}: Props) => {
  const { id, name, shortName, parent, type, bbox  } = peakList;
  const mapContext = useMapContext();
  useEffect(() => {
    return () => {
      if (mapContext.intialized) {
        mapContext.clearExternalHoveredPopup();
      }
    };
  }, [mapContext]);
  const onMouseLeave = () => {
    if (mapContext.intialized) {
      mapContext.clearExternalHoveredPopup();
    }
  };
  const onMouseEnter = () => {
    if (mapContext.intialized && bbox) {
      const center = getCenter(featureCollection([
        point(bbox.slice(0, 2)),
        point(bbox.slice(2, 4)),
      ]));
      mapContext.setExternalHoveredPopup(
        name,
        AggregateItem.list,
        '',
        [center.geometry.coordinates[0], bbox[3]],
        undefined,
        bbox,
      );
    }
  };

  const mountainLogoId = parent === null ? id : parent.id;
  const mobileURL = profileId !== undefined
    ? otherUserPeakListLink(profileId, id) : listDetailLink(id);
  return (
    <LinkWrapper
      to={mobileURL}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
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
