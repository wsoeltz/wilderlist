const {point, featureCollection} = require('@turf/helpers');
const getCenter = require('@turf/center').default;
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import useMapContext from '../../../hooks/useMapContext';
import {
  BasicIconInText,
  IconContainer,
  lightBaseColor,
  lightBorderColor,
  primaryColor,
  SemiBold,
} from '../../../styling/styleUtils';
import {AggregateItem, CoreItem} from '../../../types/itemTypes';
import StarListButton from '../../peakLists/detail/StarListButton';
import StarButtonWrapper from '../detailComponents/header/starButton';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../svgIcons';
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
  margin-bottom: 0.5rem;
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

export type Props = BaseProps & (
  {
    type: CoreItem.mountain,
  } | {
    type: CoreItem.trail,
  } | {
    type: CoreItem.campsite,
  } | {
    type: AggregateItem.list
    numMountains: number;
    numTrails: number;
    numCampsites: number;
    percent: number;
    bbox: [number, number, number, number] | null;
  }
);

const ResultItem = (props: Props) => {
  const {
    id, title, customIcon, icon, url, type,
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
  } else {
    content = null;
  }

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
    </InlineCard>
  );
};

export default ResultItem;
