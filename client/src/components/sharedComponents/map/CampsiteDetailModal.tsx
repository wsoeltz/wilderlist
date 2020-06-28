import {
  faAddressBook,
  faAlignLeft,
  faAt,
  faCar,
  faCloudSun,
  faLink,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {GoogleMapsDirectionsLink} from '../../../routing/externalLinks';
import {
  BasicIconInText,
  ButtonSecondary,
  CardTitle,
  DetailBox,
  DetailBoxTitle,
  SemiBold,
  SimpleListItem,
} from '../../../styling/styleUtils';
import getCampsiteDetail, {
  CampsiteDetail,
} from '../../../utilities/getCampsiteDetail';
import {
  Campsite,
  Sources,
} from '../../../utilities/getCampsites';
import {DrivingData} from '../../../utilities/getDrivingDistances';
import {AppContext} from '../../App';
import WeatherReport from '../../mountains/detail/WeatherReport';
import { ButtonWrapper } from '../AreYouSureModal';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';
import {
  CoverPhoto,
  DirectionsButton,
  DirectionsContent,
  DirectionsIcon,
  DirectionsRoot,
  DirectionsText,
  FlexDetailBox,
  GoogleButton,
  Header,
  List,
  Seperator,
} from './styleUtils';

const LoadingContainer = styled.div`
  width: 350px;
  height: 350px;
`;

const Section = styled.div`
  margin-top: 1rem;
`;

interface Props {
  onClose: () => void;
  campsiteDatum: Campsite;
  directionsData: DrivingData | undefined;
  getDirections: () => void;
}

const TrailDetailModal = (props: Props) => {
  const {
    onClose, campsiteDatum, directionsData, getDirections,
  } = props;
  const {
    name, latitude, longitude, id, contractCode, source,
  } = campsiteDatum;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);
  const {usersLocation} = useContext(AppContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<CampsiteDetail | undefined>(undefined);
  const [showImage, setShowImage] = useState<boolean>(true);

  useEffect(() => {
    const fetchCampsiteDetails = async () => {
      try {
        const res = await getCampsiteDetail({params: {id, contract: contractCode, source}});
        if (res && res.data) {
          const data: CampsiteDetail = res.data;
          setDetails(data);
          setLoading(false);
        } else {
          console.error('There was an error getting the location response');
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCampsiteDetails();
  }, [id, contractCode, source, setDetails, setLoading]);

  const fromText = usersLocation && usersLocation.data
          ? <small>from {usersLocation.data.text}</small> : null;
  const hours = directionsData !== undefined && directionsData.hours ? directionsData.hours + 'hrs' : '';
  const minutes = directionsData !== undefined && directionsData.minutes ? directionsData.minutes + 'm' : '';
  const directions = directionsData !== undefined && usersLocation !== undefined &&
    usersLocation.data && usersLocation.data.coordinates
    ? (
      <DirectionsContent>
        <DirectionsText>
          {hours} {minutes} ({directionsData.miles} miles)
          {fromText}
        </DirectionsText>
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

  let content: React.ReactElement<any>;
  if (loading === true) {
    content = (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  } else {
    const coverPhoto = showImage && details && details.image && details.image.length ? (
      <CoverPhoto>
        <img
          src={details.image}
          alt={'Photo of ' + name}
          onError={() => setShowImage(false)}
        />
      </CoverPhoto>
    ) : <Seperator />;

    let descriptionText: string | null;
    if (campsiteDatum.description && campsiteDatum.description.length > 25) {
      descriptionText = campsiteDatum.description;
    } else if (details && details.description && details.description.length > 25) {
      descriptionText = details.description;
    } else {
      descriptionText = null;
    }
    const sourceText = source === Sources.ReserveAmerica ? 'ReserveAmerica.com' : 'Recreation.gov';

    const description = descriptionText ? (
      <Section>
        <DetailBoxTitle>
          <BasicIconInText icon={faAlignLeft} />
          {getFluentString('global-text-value-description')} via {sourceText}
        </DetailBoxTitle>
        <DetailBox>
          <div dangerouslySetInnerHTML={{__html: descriptionText}} />
        </DetailBox>
      </Section>
    ) : null;

    let phone: React.ReactElement<any> | null;
    if (campsiteDatum.contact && campsiteDatum.contact.phone && campsiteDatum.contact.phone.length) {
      phone = (
        <SimpleListItem>
          <SemiBold>
            <BasicIconInText icon={faPhone} />
            {getFluentString('global-text-value-phone')}:
          </SemiBold>
          {' '}
          <a href={`tel:${campsiteDatum.contact.phone}`}>{campsiteDatum.contact.phone}</a>
        </SimpleListItem>
      );
    } else if (details && details.contact && details.contact.phone && details.contact.phone.length) {
      phone = (
        <SimpleListItem>
          <SemiBold>
            <BasicIconInText icon={faPhone} />
            {getFluentString('global-text-value-phone')}:
          </SemiBold>
          {' '}
          <a href={`tel:${details.contact.phone}`}>{details.contact.phone}</a>
        </SimpleListItem>
      );
    } else {
      phone = null;
    }
    let email: React.ReactElement<any> | null;
    if (campsiteDatum.contact && campsiteDatum.contact.email && campsiteDatum.contact.email.length) {
      email = (
        <SimpleListItem>
          <SemiBold>
            <BasicIconInText icon={faAt} />
            {getFluentString('global-text-value-modal-email')}:
          </SemiBold>
          {' '}
          <a href={`mailto:${campsiteDatum.contact.email}`}>
            {campsiteDatum.contact.email}
          </a>
        </SimpleListItem>
      );
    } else if (details && details.contact && details.contact.email && details.contact.email.length) {
      email = (
        <SimpleListItem>
          <SemiBold>
            <BasicIconInText icon={faAt} />
            {getFluentString('global-text-value-modal-email')}:
          </SemiBold>
          {' '}
          <a href={`mailto:${details.contact.email}`}>{details.contact.email}</a>
        </SimpleListItem>
      );
    } else {
      email = null;
    }
    let reservationUrl: React.ReactElement<any> | null;
    if (campsiteDatum.contact && campsiteDatum.contact.reservationUrl && campsiteDatum.contact.reservationUrl.length) {
      reservationUrl = (
        <SimpleListItem>
          <SemiBold>
            <BasicIconInText icon={faLink} />
            {getFluentString('global-text-value-website')}:
          </SemiBold>
          {' '}
          <a
            href={campsiteDatum.contact.reservationUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            {getFluentString('campsite-modal-go-to-website')}
          </a>
        </SimpleListItem>
      );
    } else if (details && details.contact && details.contact.reservationUrl && details.contact.reservationUrl.length) {
      reservationUrl = (
        <SimpleListItem>
          <SemiBold>
            <BasicIconInText icon={faLink} />
            {getFluentString('global-text-value-website')}:
          </SemiBold>
          {' '}
          <a
            href={details.contact.reservationUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            {getFluentString('campsite-modal-go-to-website')}
          </a>
        </SimpleListItem>
      );
    } else {
      reservationUrl = null;
    }
    const contactBox = phone || email || reservationUrl ? (
      <Section>
        <DetailBoxTitle>
          <BasicIconInText icon={faAddressBook} />
          {getFluentString('global-text-value-contact')}
        </DetailBoxTitle>
        <FlexDetailBox>
          <List>
            {phone}
            {email}
            {reservationUrl}
          </List>
        </FlexDetailBox>
      </Section>
    ) : null;
    content = (
      <>
        {coverPhoto}
        {contactBox}
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
        {description}
      </>
    );
  }

  return (
    <Modal
      actions={actions}
      onClose={onClose}
      width={'500px'}
      height={'auto'}
    >
      <Header>
        <div style={{textTransform: 'capitalize'}}>
          <CardTitle dangerouslySetInnerHTML={{__html: name.toLowerCase()}} />
        </div>
      </Header>
      {content}
    </Modal>
  );
};

export default TrailDetailModal;
