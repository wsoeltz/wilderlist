const {point, featureCollection} = require('@turf/helpers');
const getCenter = require('@turf/center').default;
import { faCalendarAlt, faLock } from '@fortawesome/free-solid-svg-icons';
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
  BasicIconInText,
  BasicIconInTextCompact,
  CompleteText,
  IconContainer,
  IncompleteText,
  lightBaseColor,
  lightBorderColor,
  SemiBold,
  Subtext,
} from '../../../styling/styleUtils';
import {ListPrivacy, PeakListVariants} from '../../../types/graphQLTypes';
import {AggregateItem} from '../../../types/itemTypes';
import { getType } from '../../../utilities/dateUtils';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../sharedComponents/svgIcons';
import Tooltip from '../../sharedComponents/Tooltip';
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
  margin-bottom: 0.75rem;
  margin-right: -1rem;
`;

const FlexRow = styled.div`
  display: flex;
  font-size: 0.875rem;
  color: ${lightBaseColor};
  align-items: center;
`;

const MidFlexRow = styled(FlexRow)`
  margin-bottom: 0.5rem;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled(FlexRow)`
  margin-right: 1rem;
`;

const PullRight = styled(FlexRow)`
  margin-left: auto;
  align-items: center;

  @media (max-width: 400px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
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
      latestTrip, parent, bbox, privacy,
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

  const privacyIcon = privacy === ListPrivacy.Private
    ? (
      <Tooltip
        explanation={getString('global-text-value-private-list')}
      >
        <Subtext><BasicIconInText icon={faLock} /></Subtext>
      </Tooltip>
    ) : null;

  const title = privacy === ListPrivacy.Private && profileId !== undefined
    ? (
      <div>
        {privacyIcon}
        <SemiBold>{name}{getType(type)}</SemiBold>
      </div>
    ) : (
      <div>
        {privacyIcon}
        <Link to={url}>
          <SemiBold>{name}{getType(type)}</SemiBold>
        </Link>
      </div>
    );

  const logo = privacy === ListPrivacy.Private && profileId !== undefined
    ? (
      <MountainLogo
        id={mountainLogoId}
        title={name}
        shortName={shortName}
        variant={type}
        active={false}
        completed={false}
      />
    ) : (
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
    );

  const latestTripText = latestTrip ? (
    <CompleteText>
      <SemiBold>{latestTrip}</SemiBold>
    </CompleteText>
  ) : (

    <IncompleteText>
      <SemiBold>{getString('global-text-value-none-yet')}</SemiBold>
    </IncompleteText>
  );

  return (
      <Root
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        <LogoContainer>
          {logo}
        </LogoContainer>
        <Content>
          <Header>
            {title}
          </Header>
          <MidFlexRow>
            <ListContainer>
              {numMountainsCompleted}
              {numTrailsCompleted}
              {numCampsitesCompleted}
            </ListContainer>
            <PullRight>
              <SimpleTitle>
                <BasicIconInTextCompact icon={faCalendarAlt} />
                <Subtext>
                  {getString('global-text-value-last-trip')}:
                </Subtext>
              </SimpleTitle>
              {latestTripText}
            </PullRight>
          </MidFlexRow>
          <MidFlexRow>
            {locationText}
            <PullRight>
              <strong>{isNaN(percentageComplete) ? 0 : percentageComplete}%</strong>
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
