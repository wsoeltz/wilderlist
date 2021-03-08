const {point, featureCollection} = require('@turf/helpers');
const getCenter = require('@turf/center').default;
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import useMapContext from '../../../hooks/useMapContext';
import { CardPeakListDatum } from '../../../queries/lists/getUsersPeakLists';
import {
  listDetailLink,
  otherUserPeakListLink,
} from '../../../routing/Utils';
import {
  SimpleTitle,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInTextCompact,
  CompleteText,
  IconContainer,
  lightBaseColor,
  lightBorderColor,
  SemiBold,
  Subtext,
} from '../../../styling/styleUtils';
import {PeakListVariants} from '../../../types/graphQLTypes';
import {AggregateItem} from '../../../types/itemTypes';
import { getType } from '../../../utilities/dateUtils';
import StarListButton from '../../peakLists/detail/StarListButton';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../sharedComponents/svgIcons';
import MountainLogo from '../mountainLogo';
import PeakProgressBar from './PeakProgressBar';

const Root = styled.div`
  padding: 1rem 1rem 0.5rem 0;
  border-top: solid 1px ${lightBorderColor};
  display: grid;
  grid-template-columns: 8rem 1fr;
  grid-template-rows: auto;

  &:last-of-type {
    border-bottom: solid 1px ${lightBorderColor};
  }
`;

const Content = styled.div`
  grid-column: 2;
  grid-row: 1;
`;

const LogoContainer = styled.div`
  grid-column: 1;
  grid-row: 1 / -1;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 5.625rem;
  grid-column-gap: 0.35rem;
  margin-bottom: 0.25rem;
  margin-right: -1rem;
`;

const SavedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const FlexRow = styled.div`
  display: flex;
  font-size: 0.875rem;
  color: ${lightBaseColor};
`;

const MidFlexRow = styled(FlexRow)`
  margin-bottom: 0.5rem;
`;

const ListItem = styled(FlexRow)`
  margin-right: 1rem;
`;

const PullRight = styled(FlexRow)`
  margin-left: auto;
  align-items: center;
`;

interface Props {
  peakList: CardPeakListDatum;
  numCompletedTrips: number;
  totalRequiredTrips: number;
  profileId?: string;
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {
      id, name, shortName, locationText, type,
      numMountains, numTrails, numCampsites,
      numCompletedAscents, numCompletedTrails, numCompletedCampsites,
      latestTrip, parent, bbox,
    },
    profileId,
    numCompletedTrips, totalRequiredTrips,
  } = props;

  const getString = useFluent();
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

  let multiplier: number = 1;
  if (type === PeakListVariants.fourSeason) {
    multiplier = 4;
  } else if (type === PeakListVariants.grid) {
    multiplier = 12;
  }

  const numMountainsCompleted = numMountains ? (
    <ListItem>
      <IconContainer
        $color={lightBaseColor}
        dangerouslySetInnerHTML={{__html: mountainNeutralSvg}}
      />
      {numCompletedAscents}/{numMountains * multiplier}
    </ListItem>
  ) : null;
  const numTrailsCompleted = numTrails ? (
    <ListItem>
      <IconContainer
        $color={lightBaseColor}
        dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
      />
      {numCompletedTrails}/{numTrails * multiplier}
    </ListItem>
  ) : null;
  const numCampsitesCompleted = numCampsites ? (
    <ListItem>
      <IconContainer
        $color={lightBaseColor}
        dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
      />
      {numCompletedCampsites}/{numCampsites * multiplier}
    </ListItem>
  ) : null;

  const percentageComplete = parseFloat((numCompletedTrips / totalRequiredTrips * 100).toFixed(1));

  const mountainLogoId = parent === null ? id : parent.id;

  const url = profileId !== undefined
    ? otherUserPeakListLink(profileId, id) : listDetailLink(id);

  const starButton = profileId !== undefined ? null : (
    <div>
      <SavedContainer>
        <StarListButton
          peakListId={id}
          peakListName={name}
          compact={true}
        />
      </SavedContainer>
    </div>
  );

  return (
      <Root
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        <LogoContainer>
          <Link to={url}>
            <MountainLogo
              id={mountainLogoId}
              title={name}
              shortName={shortName}
              variant={type}
              active={true}
              completed={false}
            />
          </Link>
        </LogoContainer>
        <Content>
          <Header>
            <div>
              <Link to={url}>
                <SemiBold>{name}{getType(type)}</SemiBold>
              </Link>
            </div>
            {starButton}
          </Header>
          <MidFlexRow>
            {numMountainsCompleted}
            {numTrailsCompleted}
            {numCampsitesCompleted}
            <PullRight>
              <SimpleTitle>
                <BasicIconInTextCompact icon={faCalendarAlt} />
                <Subtext>
                  {getString('global-text-value-last-trip')}:
                </Subtext>
              </SimpleTitle>
              <CompleteText>
                <SemiBold>{latestTrip}</SemiBold>
              </CompleteText>
            </PullRight>
          </MidFlexRow>
          <MidFlexRow>
            {locationText}
            <PullRight>
              <strong>{percentageComplete}%</strong>
              <SimpleTitle>
                &nbsp;
                <Subtext>
                  {getString('global-text-value-complete')}
                </Subtext>
              </SimpleTitle>
            </PullRight>
          </MidFlexRow>
          <ProgressContainer>
            <PeakProgressBar
              variant={type}
              completed={numCompletedTrips}
              total={totalRequiredTrips}
              id={mountainLogoId}
              hidePercentage={true}
            />
          </ProgressContainer>
        </Content>
      </Root>
  );
};

export default PeakListCard;
