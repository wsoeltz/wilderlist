import { faCar, faChartArea, faCloudSun, faHiking } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
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
  SemiBold,
  SimpleListItem,
} from '../../../styling/styleUtils';
import {DrivingData} from '../../../utilities/getDrivingDistances';
import {AppContext} from '../../App';
import WeatherReport from '../../mountains/detail/WeatherReport';
import { ButtonWrapper } from '../AreYouSureModal';
import Modal from '../Modal';
import {
  Column,
  CoverPhoto,
  Details,
  DirectionsButton,
  DirectionsContent,
  DirectionsIcon,
  DirectionsRoot,
  FlexDetailBox,
  GoogleButton,
  Header,
  List,
  Seperator,
} from './styleUtils';
import {Trail} from './types';

interface Props {
  onClose: () => void;
  trailDatum: Trail;
  directionsData: DrivingData | undefined;
  getDirections: () => void;
}

const TrailDetailModal = (props: Props) => {
  const {
    onClose, trailDatum, directionsData, getDirections,
  } = props;
  const {
    name, location, image, mileage, difficulty,
    elevation, highPoint, lowPoint, summary,
    latitude, longitude, url,
  } = trailDatum;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);
  const {usersLocation} = useContext(AppContext);

  const [showImage, setShowImage] = useState<boolean>(true);

  const coverPhoto = showImage && image && image.length ? (
    <CoverPhoto>
      <img
        src={image}
        alt={'Photo of ' + name}
        onError={() => setShowImage(false)}
      />
    </CoverPhoto>
  ) : <Seperator />;

  const description = summary.length > 25 ? (
    <p style={{textAlign: 'center'}}>&ldquo;<em>{summary}</em>&rdquo;</p>
  ) : null;

  const hours = directionsData !== undefined && directionsData.hours ? directionsData.hours + 'hrs' : '';
  const minutes = directionsData !== undefined && directionsData.minutes ? directionsData.minutes + 'm' : '';
  const directions = directionsData !== undefined && usersLocation !== undefined &&
    usersLocation.data && usersLocation.data.coordinates
    ? (
      <DirectionsContent>
        {hours} {minutes} ({directionsData.miles} miles)
        <GoogleButton>
          <GoogleMapsDirectionsLink
            lat={latitude}
            long={longitude}
            userLat={usersLocation.data.coordinates.lat}
            userLong={usersLocation.data.coordinates.lng}
          />
        </GoogleButton>
      </DirectionsContent>
    )
  : (
    <DirectionsButton onClick={getDirections}>
      {getFluentString('map-get-directions')}
    </DirectionsButton>
  );

  const actions = (
    <ButtonWrapper>
      <ButtonSecondary onClick={onClose} mobileExtend={true} style={{gridColumn: '1 / -1'}}>
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
