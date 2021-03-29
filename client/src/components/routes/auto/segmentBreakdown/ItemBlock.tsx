import {
  faChartArea,
  faCloudSun,
  faCrosshairs,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import {campsiteDetailLink, mountainDetailLink, trailDetailLink} from '../../../../routing/Utils';
import {
  BasicIconInTextCompact,
  primaryColor,
} from '../../../../styling/styleUtils';
import {Coordinate} from '../../../../types/graphQLTypes';
import {CoreItem} from '../../../../types/itemTypes';
import FormattedCoordinates from '../../../sharedComponents/detailComponents/header/FormattedCoordinates';
import FormattedElevation from '../../../sharedComponents/detailComponents/header/FormattedElevation';
import WeatherModal from '../../../sharedComponents/detailComponents/weather/WeatherModal';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../../sharedComponents/svgIcons';
import {
  ContentRoot,
  IconBullet,
  IconContainer,
  ListItem,
  ListText,
  SegmentRoot,
  WeatherButton,
} from './styleUtils';

interface Props {
  destination: {
    id: string;
    name: string;
    elevation?: number;
    location: Coordinate;
    itemType: CoreItem;
  };
  end: boolean;
}

const ParkingBlock = (props: Props) => {
  const {destination, end} = props;

  const getString = useFluent();
  const mapContext = useMapContext();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onMouseLeave = () => {
    if (mapContext.intialized) {
      mapContext.clearExternalHoveredPopup();
    }
  };
  const onMouseEnter = () => {
    if (mapContext.intialized) {
    mapContext.setExternalHoveredPopup(
        destination.name,
        destination.itemType,
        '',
        destination.location,
      );
    }
  };
  useEffect(() => {
    return () => {
      if (mapContext.intialized) {
        mapContext.clearExternalHoveredPopup();
      }
    };
  }, [mapContext]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const weather = modalOpen ? (
    <WeatherModal
      onClose={closeModal}
      latitude={destination.location[1]}
      longitude={destination.location[0]}
    />
  ) : null;

  let title: React.ReactElement<any> | null;
  let mainIcon: React.ReactElement<any> | null;
  if (destination.itemType === CoreItem.mountain) {
    title = (
      <Link
        to={mountainDetailLink(destination.id)}
      >
        {destination.name}
      </Link>
    );
    mainIcon = (
      <IconContainer
        $color={primaryColor}
        dangerouslySetInnerHTML={{__html: mountainNeutralSvg}}
      />
    );
  } else if (destination.itemType === CoreItem.campsite) {
    title = (
      <Link
        to={campsiteDetailLink(destination.id)}
      >
        {destination.name}
      </Link>
    );
    mainIcon = (
      <IconContainer
        $color={primaryColor}
        dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
      />
    );
  } else if (destination.itemType === CoreItem.trail) {
    title = (
      <Link
        to={trailDetailLink(destination.id)}
      >
        {destination.name}
      </Link>
    );
    mainIcon = (
      <IconContainer
        $color={primaryColor}
        dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
      />
    );
  } else {
    title = <>{destination.name}</>;
    mainIcon = (
      <IconContainer $color={primaryColor}>
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </IconContainer>
    );
  }

  const elevation = destination.elevation !== undefined && destination.elevation !== null ? (
    <ListItem>
      <IconBullet icon={faChartArea} />
      <FormattedElevation
        elevation={destination.elevation}
      />
    </ListItem>
  ) : null;

  return (
    <>
      <SegmentRoot onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {mainIcon}
        <div>
          <ContentRoot>
            <div>
              {end ? getString('global-text-value-end-at') : getString('global-text-value-start-at')} {title}
            </div>
            <WeatherButton onClick={openModal}>
              <BasicIconInTextCompact icon={faCloudSun} />
              {end ? getString('weather-forecast-weather-at-end') : getString('weather-forecast-weather-at-start')}
            </WeatherButton>
          </ContentRoot>
          <ContentRoot>
            <ListText>
              <ListItem>
                <IconBullet icon={faCrosshairs} />
                <FormattedCoordinates
                  coordinates={destination.location}
                  noPadding={true}
                />
              </ListItem>
              {elevation}
            </ListText>
          </ContentRoot>
        </div>
      </SegmentRoot>
      {weather}
    </>
  );
};

export default ParkingBlock;
