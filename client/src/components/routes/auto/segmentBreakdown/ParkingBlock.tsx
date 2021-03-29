import {
  faCloudSun,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import upperFirst from 'lodash/upperFirst';
import React, {useEffect, useState} from 'react';
import {Destination} from '../../../../hooks/servicesHooks/pathfinding/simpleCache';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import {
  BasicIconInTextCompact,
  primaryColor,
} from '../../../../styling/styleUtils';
import {CoreItems, MapItem} from '../../../../types/itemTypes';
import WeatherModal from '../../../sharedComponents/detailComponents/weather/WeatherModal';
import Directions from '../../../template/globalMap/tooltip/popup/directions/index';
import {
  ContentRoot,
  IconContainer,
  ListText,
  SegmentRoot,
  WeatherButton,
} from './styleUtils';

interface Props {
  destination: Destination;
}

const ParkingBlock = (props: Props) => {
  const {destination} = props;

  const getString = useFluent();
  const mapContext = useMapContext();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  let destinationName: string;
  const formattedType =
    upperFirst(getString('global-formatted-anything-type', {type: destination.type}));
  if (destination.name) {
    destinationName = destination.name;
  } else {
    destinationName = formattedType;
  }

  const onMouseLeave = () => {
    if (mapContext.intialized) {
      mapContext.clearExternalHoveredPopup();
    }
  };
  const onMouseEnter = () => {
    if (mapContext.intialized) {
    mapContext.setExternalHoveredPopup(
        destinationName,
        MapItem.directions,
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

  return (
    <>
      <SegmentRoot onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <IconContainer $color={primaryColor}>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
        </IconContainer>
        <div>
          <ContentRoot>
            <div>
              {getString('global-text-value-start-at')} {destinationName}
            </div>
            <WeatherButton onClick={openModal}>
              <BasicIconInTextCompact icon={faCloudSun} />
              {getString('weather-forecast-weather-at-start')}
            </WeatherButton>
          </ContentRoot>
          <ContentRoot>
            <ListText>
              <Directions
                destination={destination.location}
                itemType={CoreItems.campsites}
                alignLinkEnd={true}
              />
            </ListText>
          </ContentRoot>
        </div>
      </SegmentRoot>
      {weather}
    </>
  );
};

export default ParkingBlock;
