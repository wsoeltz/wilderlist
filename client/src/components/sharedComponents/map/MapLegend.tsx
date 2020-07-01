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

const Root = styled.div`
  padding: 0.6rem 0;
  border-top: 1px solid ${lightBorderColor};
  background-color: ${tertiaryColor};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled(ButtonPrimary)`
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
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
  primaryMountainLegendCopy: undefined | string;
  customContentBottom: undefined | React.ReactNode;
  useGenericFunctionality: boolean | undefined;
}

const MapLegend = React.forwardRef((props: Props, rootElRef: RefObject<HTMLDivElement>) => {
  const {
    centerCoords, showCenterCrosshairs, returnLatLongOnClick,
    showNearbyTrails, showYourLocation, toggleMajorTrails, toggleYourLocation,
    majorTrailsOn, yourLocationOn,
    showOtherMountains, otherMountainsOn, toggleOtherMountains,
    showCampsites, toggleCampsites, campsitesOn, userId,
    onAddMountainClick, primaryMountainLegendCopy, customContentBottom,
    useGenericFunctionality,
  } = props;
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const latLongLegend = returnLatLongOnClick === undefined || showCenterCrosshairs === false ? null : (
      <ActionButton onClick={() => returnLatLongOnClick(...centerCoords)}>
        {getFluentString('map-set-lat-long-value')}
      </ActionButton>
    );

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

  const otherMountainsLegend = showOtherMountains && !useGenericFunctionality ? (
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
              alt='Other Mountains Legend Icon'
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

  const allMountainsLegend = useGenericFunctionality ? (
    <AdditionalItem>
      <Tooltip
      explanation={
          <div
            dangerouslySetInnerHTML={{__html: getFluentString('map-legend-other-mountains-tooltip')}}
          />
        }
        cursor={'pointer'}
      >
        <LegendToggle>
          <OtherMountainsIcon>
            <img
              src={require('./images/custom-icons/mountain-highlighted.svg')}
              alt='Mountains Legend Icon'
              style={{width: '1.65rem'}}
            />
          </OtherMountainsIcon>
          <div>
            <Label>
              Mountains on<br />
              Wilderlist
            </Label>
          </div>
        </LegendToggle>
      </Tooltip>
    </AdditionalItem>
  ) : null;

  const primaryMountainsLegend = primaryMountainLegendCopy ? (
    <AdditionalItem>
        <LegendToggle>
          <Icon>
            <img
              src={require('./images/custom-icons/mountain-highlighted.svg')}
              alt={primaryMountainLegendCopy + ' Icon'}
              style={{width: '1.65rem'}}
            />
          </Icon>
          <div>
            <Label
              dangerouslySetInnerHTML={{__html: primaryMountainLegendCopy}}
            />
          </div>
        </LegendToggle>
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

  let additionalItems: React.ReactElement<any> | null;

  if (showOtherMountains && primaryMountainsLegend) {
    additionalItems = (
      <>
        <AdditionalItemsRoot>
          <AdditionalItemsColumn>
            {otherMountainsLegend}
          </AdditionalItemsColumn>
          <AdditionalItemsColumn>
            {primaryMountainsLegend}
          </AdditionalItemsColumn>
        </AdditionalItemsRoot>
      </>
    );
  } else if (showYourLocation || showNearbyTrails || showOtherMountains || allMountainsLegend) {
    additionalItems = (
      <>
        <AdditionalItemsRoot>
          <AdditionalItemsColumn>
            {allMountainsLegend}
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
    );
  } else {
    additionalItems = null;
  }

  if (latLongLegend || additionalItems || customContentBottom) {
    return (
      <Root ref={rootElRef}>
        {latLongLegend}
        {additionalItems}
        {customContentBottom}
      </Root>
    );
  } else {
    return null;
  }

});

export default MapLegend;
