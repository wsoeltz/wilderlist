import { faCar, faChartArea, faCloudSun, faHiking } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {GoogleMapsDirectionsLink, HikingProjectTrailLink} from '../../../routing/externalLinks';
import {
  BasicIconInText,
  ButtonSecondary,
  CardSubtitle,
  CardTitle,
  DetailBox,
  DetailBoxTitle,
  lightBorderColor,
  ResourceList,
  SemiBold,
  SimpleListItem,
} from '../../../styling/styleUtils';
import {DrivingData} from '../../../utilities/getDrivingDistances';
import WeatherReport from '../../mountains/detail/WeatherReport';
import { ButtonWrapper } from '../AreYouSureModal';
import Modal from '../Modal';
import {Trail} from './';
import {
  DirectionsButton,
  DirectionsContainer,
  DirectionsContent,
  DirectionsIcon,
} from './styleUtils';

const Header = styled.div`
 display: grid;
 grid-template-columns: 1fr auto;
 grid-column-gap: 1rem;
`;

const CoverPhoto = styled.div`
  height: 230px;
  overflow: hidden;
  display: flex;
  align-items: center;

  img {
    width: 100%;

  }
`;

const Seperator = styled.div`
  width: 100%;
  height: 0;
  margin-top: 1rem;
  border-bottom: 1px solid ${lightBorderColor};
`;

const Details = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  margin: 1rem 0;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexDetailBox = styled(DetailBox)`
  flex-grow: 1;
`;

const List = styled(ResourceList)`
  margin-bottom: 0;
`;

const DirectionsRoot = styled(DirectionsContainer)`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
`;

const GoogleButton = styled.div`
  margin-left: auto;
`;

interface Props {
  onClose: () => void;
  trailDatum: Trail;
  directionsData: DrivingData | undefined;
  getDirections: () => void;
  usersLocation: {latitude: number, longitude: number} | undefined;
}

const TrailDetailModal = (props: Props) => {
  const {
    onClose, trailDatum, directionsData, getDirections, usersLocation,
  } = props;
  const {
    name, location, image, mileage, difficulty,
    elevation, highPoint, lowPoint, summary,
    latitude, longitude, url,
  } = trailDatum;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const coverPhoto = image && image.length ? (
    <CoverPhoto>
      <img
        src={image}
        alt={'Photo of ' + name}
      />
    </CoverPhoto>
  ) : <Seperator />;

  const description = summary.length > 25 ? (
    <p style={{textAlign: 'center'}}>&ldquo;<em>{summary}</em>&rdquo;</p>
  ) : null;

  const hours = directionsData !== undefined && directionsData.hours ? directionsData.hours + 'hrs' : '';
  const minutes = directionsData !== undefined && directionsData.minutes ? directionsData.minutes + 'm' : '';
  const directions = directionsData !== undefined && usersLocation !== undefined ?
    <DirectionsContent>
      {hours} {minutes} ({directionsData.miles} miles)
      <GoogleButton>
        <GoogleMapsDirectionsLink
          lat={latitude}
          long={longitude}
          userLat={usersLocation.latitude}
          userLong={usersLocation.longitude}
        />
      </GoogleButton>
    </DirectionsContent>
  : (
    <DirectionsButton onClick={getDirections}>
      {getFluentString('map-get-directions')}
    </DirectionsButton>
  );

  const actions = (
    <ButtonWrapper>
      <ButtonSecondary onClick={onClose}>
        {getFluentString('global-text-value-modal-close')}
      </ButtonSecondary>
    </ButtonWrapper>
  );

  return (
    <Modal
      actions={actions}
      onClose={onClose}
      width={'500px'}
      height={'auto'}
    >
      <Header>
        <div>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle>{location}</CardSubtitle>
        </div>
        <div>
          <HikingProjectTrailLink
            url={url}
          />
        </div>
      </Header>
      {coverPhoto}
      {description}
      <Details>
        <Column>
          <DetailBoxTitle>
            <BasicIconInText icon={faHiking} />
            {getFluentString('global-text-value-trail')}
          </DetailBoxTitle>
          <FlexDetailBox>
            <List>
              <SimpleListItem>
                <SemiBold>{mileage}</SemiBold> {getFluentString('map-trails-trail-desc', {miles: mileage})}
              </SimpleListItem>
              <SimpleListItem>
                {getFluentString('map-trails-difficulty-desc', {difficulty})}
              </SimpleListItem>
            </List>
          </FlexDetailBox>
        </Column>
        <Column>
          <DetailBoxTitle>
            <BasicIconInText icon={faChartArea} />
            {getFluentString('global-text-value-elevation')}
          </DetailBoxTitle>
          <FlexDetailBox>
            <List>
              <SimpleListItem>
                {getFluentString('global-text-value-elevation-gain')}: <SemiBold>{elevation}ft</SemiBold>
              </SimpleListItem>
              <SimpleListItem>
                {getFluentString('global-text-value-high-point')}: <SemiBold>{highPoint}ft</SemiBold>
              </SimpleListItem>
              <SimpleListItem>
                {getFluentString('global-text-value-low-point')}: <SemiBold>{lowPoint}ft</SemiBold>
              </SimpleListItem>
            </List>
          </FlexDetailBox>
        </Column>
      </Details>
      <DirectionsRoot>
        <DirectionsIcon>
          <FontAwesomeIcon icon={faCar} />
        </DirectionsIcon>
        {directions}
      </DirectionsRoot>
      <DetailBoxTitle>
        <BasicIconInText icon={faCloudSun} />
        {getFluentString('weather-forecast-weather')}
      </DetailBoxTitle>
      <DetailBox>
        <WeatherReport
          latitude={latitude}
          longitude={longitude}
        />
      </DetailBox>
    </Modal>
  );
};

export default TrailDetailModal;
