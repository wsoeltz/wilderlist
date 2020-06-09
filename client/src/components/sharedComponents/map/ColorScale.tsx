import { GetString } from 'fluent-react/compat';
import React, {RefObject, useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  baseColor,
  ButtonPrimary,
  lightBorderColor,
  LinkButton,
  tertiaryColor,
} from '../../../styling/styleUtils';
import Tooltip from '../Tooltip';

const ColorScaleLegend = styled.div`
  padding: 0.6rem 0;
  border-top: 1px solid ${lightBorderColor};
  background-color: ${tertiaryColor};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const LegendTitle = styled.h4`
  margin: 0.3rem 0 0.6rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  text-align: center;
  font-weight: 600;
  width: 100%;
  flex-shrink: 0;
`;
const LegendItem = styled.div`
  margin: 0 0.3rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const circleSmallScreenSize = 400; // in px

const Circle = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 4000px;
  margin-bottom: 0.2rem;

  @media (max-width: ${circleSmallScreenSize}px) {
    width: 14px;
    height: 14px;
  }
`;

const GridLegendLabel = styled(LegendItem)`
  white-space: nowrap;
  width: 15px;

  @media (max-width: ${circleSmallScreenSize}px) {
    width: 14px;
  }
`;
const GridLabelStart = styled(GridLegendLabel)`
  align-items: flex-start;
`;
const GridLabelEnd = styled(GridLegendLabel)`
  align-items: flex-end;
`;

const SeasonLabelStart = styled(LegendItem)`
  justify-content: center;
`;
const SeasonLabelEnd = styled(LegendItem)`
  justify-content: center;
`;

const CenterCoordinatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: auto;
  margin-left: 1rem;
`;

const CenterCoordinatesTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
`;

const CenterCoordinatesSection = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  font-size: 0.8rem;
`;

const ActionButton = styled(ButtonPrimary)`
  margin-top: 0.5rem;
  font-size: 0.7rem;
  padding: 0.2rem 0.3rem;
`;

const AdditionalItemsRoot = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const AdditionalItemsColumn = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding: 1.5rem 0 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const AdditionalItem = styled.div`
  min-width: 9.5rem;
`;

const LegendToggle = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  white-space: nowrap;
  margin-bottom: 0.6rem;
`;

const Icon = styled.div`
  margin-right: 0.5rem;
`;

const IconDisabled = styled(Icon)`
  opacity: 0.3;
  position: relative;

  &:after {
    content: '';
    width: 0.1rem;
    border-radius: 80px;
    height: 120%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    transform: rotate(45deg);
    background-color: ${baseColor};
    border: 1px solid ${tertiaryColor};
  }
`;

const Label = styled.span`
  text-transform: uppercase;
  font-weight: 600;
`;

const Status = styled.em`
  display: block;
  font-size: 0.6rem;
`;

const MissingMountainLink = styled.div`
  margin: 0.5rem 0 0;
  font-size: 0.7rem;
  opacity: 0.85;
`;

interface Props {
  centerCoords: [string, string];
  showCenterCrosshairs?: boolean;
  returnLatLongOnClick?: (lat: number | string, lng: number | string) => void;
  colorScaleTitle?: string;
  colorScaleColors: string[];
  colorScaleLabels: string[];
  showNearbyTrails?: boolean;
  showYourLocation?: boolean;
  showOtherMountains?: boolean;
  majorTrailsOn?: boolean;
  toggleMajorTrails?: () => void;
  campsitesOn?: boolean;
  showCampsites?: boolean;
  toggleCampsites?: () => void;
  yourLocationOn?: boolean;
  toggleYourLocation?: () => void;
  otherMountainsOn?: boolean;
  toggleOtherMountains?: () => void;
  userId: string | null;
  onAddMountainClick: () => void;
}

const ColorScale = React.forwardRef((props: Props, rootElRef: RefObject<HTMLDivElement>) => {
  const {
    centerCoords, colorScaleColors, colorScaleLabels,
    showCenterCrosshairs, returnLatLongOnClick,
    colorScaleTitle, showNearbyTrails, showYourLocation,
    toggleMajorTrails, toggleYourLocation,
    majorTrailsOn, yourLocationOn,
    showOtherMountains, otherMountainsOn, toggleOtherMountains,
    showCampsites, toggleCampsites, campsitesOn, userId,
    onAddMountainClick,
  } = props;
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  if (colorScaleColors.length === 0) {
    return null;
  }

  let latLongLegend: React.ReactElement<any> | null;
  if (showCenterCrosshairs === true) {
    const returnLatLongButton = returnLatLongOnClick === undefined ? null : (
      <ActionButton onClick={() => returnLatLongOnClick(...centerCoords)}>
        {getFluentString('map-set-lat-long-value')}
      </ActionButton>
    );
    latLongLegend = (
      <CenterCoordinatesContainer>
        <CenterCoordinatesTitle>{getFluentString('map-coordinates-at-center')}</CenterCoordinatesTitle>
        <CenterCoordinatesSection>
          <span>{getFluentString('global-text-value-latitude')}: {centerCoords[0]}</span>
          <span>{getFluentString('global-text-value-longitude')}: {centerCoords[1]}</span>
          {returnLatLongButton}
        </CenterCoordinatesSection>
      </CenterCoordinatesContainer>
    );
  } else {
    latLongLegend = null;
  }

  const LocationIcon = yourLocationOn ? Icon : IconDisabled;
  const OtherMountainsIcon = otherMountainsOn ? Icon : IconDisabled;
  const MajorTrailsIcon = majorTrailsOn ? Icon : IconDisabled;
  const CampsitesIcon = campsitesOn ? Icon : IconDisabled;

  const locationLegend = showYourLocation ? (
    <AdditionalItem>
      <Tooltip
      explanation={
          <div
            dangerouslySetInnerHTML={{__html: getFluentString('map-legend-location-tooltip')}}
          />
        }
        cursor={'pointer'}
      >
        <LegendToggle
          onClick={toggleYourLocation}
        >
          <LocationIcon>
            <img
              src={require('./images/custom-icons/your-location.svg')}
              alt='Your Location Legend Icon'
              style={{width: '1rem'}}
            />
          </LocationIcon>
          <div>
            <Label
              dangerouslySetInnerHTML={{__html: getFluentString('map-legend-location')}}
            />
            <Status>({getFluentString('map-legend-show-hide', {
              shown: yourLocationOn ? 'true' : 'false',
            })})</Status>
          </div>
        </LegendToggle>
      </Tooltip>
    </AdditionalItem>
  ) : null;

  const otherMountainsLegend = showOtherMountains ? (
    <AdditionalItem>
      <Tooltip
      explanation={
          <div
            dangerouslySetInnerHTML={{__html: getFluentString('map-legend-other-mountains-tooltip')}}
          />
        }
        cursor={'pointer'}
      >
        <LegendToggle
          onClick={toggleOtherMountains}
        >
          <OtherMountainsIcon>
            <img
              src={require('./images/custom-icons/mountain-default.svg')}
              alt='Your Location Legend Icon'
              style={{width: '1.65rem'}}
            />
          </OtherMountainsIcon>
          <div>
            <Label
              dangerouslySetInnerHTML={{__html: getFluentString('map-legend-other-mountains')}}
            />
            <Status>({getFluentString('map-legend-show-hide', {
              shown: otherMountainsOn ? 'true' : 'false',
            })})</Status>
          </div>
        </LegendToggle>
      </Tooltip>
    </AdditionalItem>
  ) : null;

  const addMountainLink = showOtherMountains && userId ? (
    <MissingMountainLink>
      {getFluentString('map-missing-mountain-text')}
      {' '}
      <LinkButton onClick={onAddMountainClick}>
        {getFluentString('map-missing-mountain-link')}
      </LinkButton>
    </MissingMountainLink>
  ) : null;

  const trailsLegend = showNearbyTrails ? (
    <AdditionalItem>
      <Tooltip
        explanation={<div dangerouslySetInnerHTML={{__html: getFluentString('map-legend-trails-tooltip')}} />}
        cursor={'pointer'}
      >
        <LegendToggle
          onClick={toggleMajorTrails}
        >
          <MajorTrailsIcon>
            <img
              src={require('./images/custom-icons/trail-default.svg')}
              alt='Major Trails Legend Icon'
              style={{width: '1.65rem'}}
            />
          </MajorTrailsIcon>
          <div>
            <Label
              dangerouslySetInnerHTML={{__html: getFluentString('map-legend-trails-major')}}
            />
            <Status>({getFluentString('map-legend-show-hide', {
              shown: majorTrailsOn ? 'true' : 'false',
            })})</Status>
          </div>
        </LegendToggle>
      </Tooltip>
    </AdditionalItem>
  ) : null;

  const campsitesLegend = showCampsites ? (
    <AdditionalItem>
      <Tooltip
        explanation={<div dangerouslySetInnerHTML={{__html: getFluentString('map-legend-campsites-tooltip')}} />}
        cursor={'pointer'}
      >
        <LegendToggle
          onClick={toggleCampsites}
        >
          <CampsitesIcon>
            <img
              src={require('./images/custom-icons/tent-default.svg')}
              alt='Minor Trails Legend Icon'
              style={{width: '1.65rem'}}
            />
          </CampsitesIcon>
          <div>
            <Label
              dangerouslySetInnerHTML={{__html: getFluentString('map-legend-campsites')}}
            />
            <Status>({getFluentString('map-legend-show-hide', {
              shown: campsitesOn ? 'true' : 'false',
            })})</Status>
          </div>
        </LegendToggle>
      </Tooltip>
    </AdditionalItem>
  ) : null;

  const additionalItems = showYourLocation || showNearbyTrails || showOtherMountains ? (
    <>
      <AdditionalItemsRoot>
        <AdditionalItemsColumn>
          {otherMountainsLegend}
          {locationLegend}
        </AdditionalItemsColumn>
        <AdditionalItemsColumn>
          {trailsLegend}
          {campsitesLegend}
        </AdditionalItemsColumn>
      </AdditionalItemsRoot>
      {addMountainLink}
    </>
  ) : null;

  const title = colorScaleTitle ? <LegendTitle>{colorScaleTitle}</LegendTitle> : null;
  const startColor = colorScaleColors[0];
  const endColor = colorScaleColors[colorScaleColors.length - 1];

  if (colorScaleColors.length <= 2) {
    const legendNodes = colorScaleColors.map((c, i) => {
      return (
        <LegendItem key={c} style={{color: c}}>
          <Circle style={{backgroundColor: c}} />
          {colorScaleLabels[i]}
        </LegendItem>
      );
    });
    return (
      <ColorScaleLegend ref={rootElRef}>
        {title}
        {latLongLegend}
        {legendNodes}
        {additionalItems}
      </ColorScaleLegend>
    );
  } else if (colorScaleColors.length < 8) {
    const legendNodes = colorScaleColors.map((c) => {
      return (
        <LegendItem key={c}>
          <Circle style={{backgroundColor: c}} />
        </LegendItem>
      );
    });
    return (
      <ColorScaleLegend ref={rootElRef}>
        {title}
        <SeasonLabelStart style={{color: startColor}}>
          {colorScaleLabels[0]}
        </SeasonLabelStart>
        {legendNodes}
        <SeasonLabelEnd style={{color: endColor}}>
          {colorScaleLabels[colorScaleLabels.length - 1]}
        </SeasonLabelEnd>
        {additionalItems}
      </ColorScaleLegend>
    );
  } else {
    const legendNodes = colorScaleColors.map((c, i) => {
      if (i === 0 || i === 12) {
        return null;
      } else {
        return (
          <LegendItem key={c}>
            <Circle style={{backgroundColor: c}} />
          </LegendItem>
        );
      }
    });
    return (
      <ColorScaleLegend ref={rootElRef}>
        {title}
        <GridLabelStart style={{color: startColor}}>
          <Circle style={{backgroundColor: startColor}} />
          {colorScaleLabels[0]}
        </GridLabelStart>
        {legendNodes}
        <GridLabelEnd style={{color: endColor}}>
          <Circle style={{backgroundColor: endColor}} />
          {colorScaleLabels[colorScaleLabels.length - 1]}
        </GridLabelEnd>
        {additionalItems}
      </ColorScaleLegend>
    );
  }
});

export default ColorScale;
