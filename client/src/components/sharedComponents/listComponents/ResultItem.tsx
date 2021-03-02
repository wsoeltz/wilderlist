const {point, featureCollection} = require('@turf/helpers');
const getCenter = require('@turf/center').default;
import {
  faChartArea,
  faChartLine,
  faShoePrints,
} from '@fortawesome/free-solid-svg-icons';
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import {OriginLocation} from '../../../hooks/directions/useDirectionsOrigin';
import useFluent from '../../../hooks/useFluent';
import useMapContext from '../../../hooks/useMapContext';
import {
  BasicIconInText,
  IconContainer,
  lightBaseColor,
  lightBorderColor,
  primaryColor,
  SemiBold,
  Seperator,
} from '../../../styling/styleUtils';
import {CampsiteOwnership, Coordinate} from '../../../types/graphQLTypes';
import {AggregateItem, CoreItem} from '../../../types/itemTypes';
import StarListButton from '../../peakLists/detail/StarListButton';
import StarButtonWrapper from '../detailComponents/header/starButton';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../svgIcons';
import CrowFliesDistance from './CrowFliesDistance';
import LatestTrip from './LatestTrip';
import SimplePercentBar from './SimplePercentBar';

const InlineCard = styled.div`
  margin: 0 -1rem;
  padding: 1rem;
  border-top: solid 1px ${lightBorderColor};
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 5.625rem;
  grid-column-gap: 0.35rem;
  margin-bottom: 0.25rem;
  margin-right: -1rem;
`;

const IconHeader = styled.h2`
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 1.15rem;
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

const PullRight = styled(FlexRow)`
  margin-left: auto;
`;

const ListItem = styled(FlexRow)`
  margin-right: 1rem;
`;

interface BaseProps {
  id: string;
  title: string;
  url: string;
  locationText: string | null;
  type: CoreItem | AggregateItem;
  customIcon: boolean;
  icon: string | any;
}

export type TypeProps = BaseProps & (
  {
    type: CoreItem.mountain,
    elevation: number;
    location: Coordinate;
    distanceToCenter: number;
  } | {
    type: CoreItem.trail,
    formattedType: string,
    trailLength: number;
    slopeText: string | null;
    distanceToCenter: number;
    location: Coordinate;
    line: Coordinate[];
  } | {
    type: CoreItem.campsite,
    formattedType: string;
    ownership: CampsiteOwnership | null;
    distanceToCenter: number;
    location: Coordinate;
  } | {
    type: AggregateItem.list
    numMountains: number;
    numTrails: number;
    numCampsites: number;
    percent: number;
    bbox: [number, number, number, number] | null;
  }
);

type Props = TypeProps & {
  mapCenter: Coordinate;
  usersLocation: undefined | null | OriginLocation;
  changeUsersLocation: () => void;
};

const ResultItem = (props: Props) => {
  const {
    id, title, customIcon, icon, url, type,
    mapCenter, usersLocation, changeUsersLocation,
  } = props;
  const getString = useFluent();
  const mapContext = useMapContext();
  const onMouseLeave = () => {
    if (mapContext.intialized) {
      mapContext.clearExternalHoveredPopup();
    }
  };
  const onMouseEnter = () => {
    if (mapContext.intialized) {
      if (props.type === AggregateItem.list && props.bbox) {
        const center = getCenter(featureCollection([
          point(props.bbox.slice(0, 2)),
          point(props.bbox.slice(2, 4)),
        ]));
        mapContext.setExternalHoveredPopup(
          props.title,
          AggregateItem.list,
          '',
          [center.geometry.coordinates[0], props.bbox[3]],
          undefined,
          props.bbox,
        );
      } else if (props.type !== AggregateItem.list) {
        let subtitle: string = '';
        if (props.type === CoreItem.mountain) {
          if (props.elevation) {
            subtitle = props.elevation + 'ft';
          }
        } else if (props.type === CoreItem.trail) {
          if (props.formattedType && props.trailLength) {
            const trailLength = props.trailLength;
            const trailLengthDisplay = trailLength < 0.1
              ? Math.round(trailLength * 5280) + ' ft'
              : parseFloat(trailLength.toFixed(1)) + ' mi';
            subtitle = !isNaN(trailLength)
              ? trailLengthDisplay + ' long ' + getString('global-formatted-trail-type', {type})
              : getString('global-formatted-trail-type', {type});
          }
        } else if (props.type === CoreItem.campsite) {
          if (props.formattedType) {
            subtitle = props.formattedType;
          }
        }
        const line = props.type === CoreItem.trail && props.line ? props.line : undefined;
        mapContext.setExternalHoveredPopup(props.title, props.type, subtitle, props.location, line);
      }
    }
  };
  useEffect(() => {
    return () => {
      if (mapContext.intialized) {
        mapContext.clearExternalHoveredPopup();
      }
    };
  }, [mapContext]);
  const iconEl = customIcon ? (
    <IconContainer
      $color={primaryColor}
      dangerouslySetInnerHTML={{__html: icon}}
    />
  ) : (
    <IconContainer $color={primaryColor}>
      <BasicIconInText icon={icon} />
    </IconContainer>
  );

  const star = type === AggregateItem.list ? (
    <StarListButton
      peakListId={id}
      peakListName={title}
      compact={true}
    />
  ) : (
    <StarButtonWrapper
      id={id}
      name={title}
      type={type}
      compact={true}
    />
  );

  let content: React.ReactElement<any> | null;
  if (props.type === AggregateItem.list) {
    const numMountains = props.numMountains ? (
      <ListItem>
        <IconContainer
          $color={lightBaseColor}
          dangerouslySetInnerHTML={{__html: mountainNeutralSvg}}
        />
        {props.numMountains} {props.numMountains > 1
          ? getString('global-text-value-mountains') : getString('global-text-value-mountain')}
      </ListItem>
    ) : null;
    const numTrails = props.numTrails ? (
      <ListItem>
        <IconContainer
          $color={lightBaseColor}
          dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
        />
        {props.numTrails} {props.numTrails > 1
          ? getString('global-text-value-trails') : getString('global-text-value-trail')}
      </ListItem>
    ) : null;
    const numCampsites = props.numCampsites ? (
      <ListItem>
        <IconContainer
          $color={lightBaseColor}
          dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
        />
        {props.numCampsites} {props.numCampsites > 1
          ? getString('global-text-value-campsites') : getString('global-text-value-campsite')}
      </ListItem>
    ) : null;

    const locationText = props.locationText ? (
      <FlexRow>
        {upperFirst(props.locationText)}
      </FlexRow>
    ) : null;

    content = (
      <>
        <MidFlexRow>
          {numMountains}
          {numTrails}
          {numCampsites}
        </MidFlexRow>
        <FlexRow>
          {locationText}
          <PullRight>
            <SimplePercentBar
              percent={props.percent}
            />
          </PullRight>
        </FlexRow>
      </>
    );
  } else if (props.type === CoreItem.mountain) {
    const locationText = props.locationText ? (
      <FlexRow>
        {upperFirst(props.locationText)}
      </FlexRow>
    ) : null;
    content = (
      <MidFlexRow>
        <BasicIconInText icon={faChartArea} />
        {props.elevation}ft
        <Seperator>|</Seperator>
        {locationText}
      </MidFlexRow>
    );
  } else if (props.type === CoreItem.campsite) {
    content = (
      <MidFlexRow>
        {getString('campsite-detail-subtitle', {
          ownership: props.ownership,
          type: props.formattedType,
          location: props.locationText,
        })}
      </MidFlexRow>
    );
  } else if (props.type === CoreItem.trail) {
    const slopeText = props.slopeText ? (
      <PullRight>
        <BasicIconInText icon={faChartLine} />
        {props.slopeText}
      </PullRight>
    ) : null;
    const trailLength = props.trailLength < 0.1
      ? getString('distance-feet-formatted', {feet: Math.round(props.trailLength * 5280)})
      : getString('directions-driving-distance', {miles: parseFloat(props.trailLength.toFixed(1))});
    content = (
      <>
        <MidFlexRow>
          {getString('trail-detail-subtitle', {
            type: props.formattedType,
            segment: 0,
            state: props.locationText,
          })}
        </MidFlexRow>
        <MidFlexRow>
          <FlexRow>
            <BasicIconInText icon={faShoePrints} />
            {trailLength}
          </FlexRow>
          {slopeText}
        </MidFlexRow>
      </>
    );
  } else {
    content = null;
  }

  const distanceAndLastHiked = props.type !== AggregateItem.list ? (
    <FlexRow>
      <CrowFliesDistance
        location={props.location}
        usersLocation={usersLocation}
        mapCenter={mapCenter}
        changeUsersLocation={changeUsersLocation}
      />
      <PullRight>
        <LatestTrip
          item={props.type}
          id={id}
        />
      </PullRight>
    </FlexRow>
  ) : null;

  return (
    <InlineCard
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <Header>
        <div>
          <IconHeader>
            <Link to={url}>
              {iconEl}
            </Link>
            <Link to={url}>
              <SemiBold>{title}</SemiBold>
            </Link>
          </IconHeader>
        </div>
        <div>
          <SavedContainer>
            {star}
          </SavedContainer>
        </div>
      </Header>
      {content}
      {distanceAndLastHiked}
    </InlineCard>
  );
};

export default ResultItem;
