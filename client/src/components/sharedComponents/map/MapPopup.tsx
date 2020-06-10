import {
  faCalendarAlt,
  faCar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import {lighten} from 'polished';
import React, {
  useContext,
  useState,
} from 'react';
import {Popup} from 'react-mapbox-gl';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  friendsProfileWithPeakListWithMountainDetailLink,
  listDetailWithMountainDetailLink,
  mountainDetailLink,
} from '../../../routing/Utils';
import {
  ButtonSecondary,
  linkStyles,
  placeholderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { CompletedMountain, Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import {DrivingData} from '../../../utilities/getDrivingDistances';
import {
  TrailType,
} from '../../../utilities/getTrails';
import {
  userAllowsLocation,
} from '../../../Utils';
import NewAscentReport from '../../peakLists/detail/completionModal/NewAscentReport';
import getCompletionDates from '../../peakLists/detail/getCompletionDates';
import {
  VariableDate,
} from '../../peakLists/detail/getCompletionDates';
import {
  formatDate,
  formatGridDate,
} from '../../peakLists/Utils';
import DynamicLink from '../DynamicLink';
import SignUpModal from '../SignUpModal';
import CampsiteDetailModal from './CampsiteDetailModal';
import {getImageAndIcon} from './colorScaleColors';
import {
  DirectionsButton,
  DirectionsContainer,
  DirectionsContent,
  DirectionsIcon,
} from './styleUtils';
import TrailDetailModal from './TrailDetailModal';
import {
  CoordinateWithDates,
  DestinationDatum,
  IUserLocation,
  PopupData,
  PopupDataTypes,
} from './types';

interface ColorProps {
  color: string;
}

const PopupHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  margin-right: 0.5rem;
`;

const PopupTitleInternal = styled(DynamicLink)<ColorProps>`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({color}) => color};

  &:hover {
    color: ${({color}) => lighten(0.1, color)};
  }
`;

const PopupTitleExternal = styled.button<ColorProps>`
  ${linkStyles}
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({color}) => color};
  padding: 0;
  outline: none;
  background-color: transparent;
  border: none;

  &:hover {
    cursor: pointer;
    color: ${({color}) => lighten(0.1, color)};
  }
`;

const ClosePopup = styled.div`
  position: absolute;
  top: -0.1rem;
  right: 0.1rem;
  font-size: 0.9rem;
  font-weight: ${semiBoldFontBoldWeight};
  color: ${placeholderColor};

  &:hover {
    cursor: pointer;
  }
`;

const PopupDetail = styled.div`
  font-size: 0.7rem;
  line-height: 0.8;
  margin-bottom: 0.5rem;
`;

const PopupDates = styled.div`
  display: flex;
  align-items: center;
`;

const DateDiv = styled.div`
  margin-right: 0.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  line-height: 1.4;
  text-align: center;
`;

const GridNumbers = styled.div`
  letter-spacing: -1px;
`;

const ActionButton = styled(ButtonSecondary)`
  padding: 0.3rem;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 100%;

  &:not(:first-child) {
    margin-left: auto;
  }
`;

interface Props {
  popupInfo: PopupData | null;
  completedAscents: CompletedMountain[];
  peakListId: string | null;
  mountainId: string | null;
  userId: string | null;
  isOtherUser: boolean | undefined;
  otherUserId: string | undefined;
  usersLocation: IUserLocation;
  destination: DestinationDatum | undefined;
  setDestination: (value: DestinationDatum | undefined) => void;
  directionsData: DrivingData | undefined;
  closePopup: () => void;
  yourLocationOn: boolean;
  showYourLocation: boolean | undefined;
  setYourLocationOn: (value: boolean) => void;
  colorScaleColors: string[];
  colorScaleSymbols: string[];
  createOrEditMountain?: boolean;
  highlighted?: CoordinateWithDates[];
  addRemoveMountains?: {
    addText: string;
    onAdd: (mountain: CoordinateWithDates) => void;
    removeText: string;
    onRemove: (mountain: CoordinateWithDates) => void;
  };
}

const MapPopup = (props: Props) => {
  const {
    popupInfo, completedAscents, peakListId, mountainId, isOtherUser,
    otherUserId, userId, usersLocation, destination, directionsData,
    closePopup, yourLocationOn, setYourLocationOn, setDestination,
    showYourLocation, colorScaleColors, colorScaleSymbols,
    createOrEditMountain, highlighted, addRemoveMountains,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  const [trailModalOpen, setTrailModalOpen] = useState<boolean>(false);
  const [campsiteModalOpen, setCampsiteModalOpen] = useState<boolean>(false);

  const getDesktopUrl = (id: Mountain['id']) => {
    if (peakListId === null || mountainId === id) {
      return mountainDetailLink(id);
    } else if (peakListId !== null) {
      if (isOtherUser && otherUserId) {
        return friendsProfileWithPeakListWithMountainDetailLink(otherUserId, peakListId, id);
      } else {
        return listDetailWithMountainDetailLink(peakListId, id);
      }
    } else {
      return mountainDetailLink(id);
    }
  };

  const renderCompletionDates = (dates: VariableDate | null | undefined) => {
    let output: React.ReactElement<any> | null = null;
    let length: number = 0;
    if (dates) {
      if (dates.type === PeakListVariants.standard) {
        if (dates.standard !== undefined) {
          const completedTextFluentId = isOtherUser && otherUserId ? 'map-completed-other-user' : 'map-completed';
          output = (
            <DateDiv>
              <strong>{getFluentString(completedTextFluentId)}: </strong>
              {formatDate(dates.standard)}
            </DateDiv>
          );
          length = 1;
        }
      }
      if (dates.type === PeakListVariants.winter) {
        if (dates.winter !== undefined) {
          output = (
            <DateDiv>
              <strong>{getFluentString('map-completed-in-winter')}: </strong>
              {formatDate(dates.winter)}
            </DateDiv>
          );
          length = 1;
        }
      }
      if (dates.type === PeakListVariants.fourSeason) {
        const datesElm: Array<React.ReactElement<any>> = [];
        Object.keys(dates).forEach(function(season: keyof VariableDate) {
          if (season !== 'type' && dates[season] !== undefined) {
            const seasonAsString = season as string;
            datesElm.push(
              <DateDiv key={season}>
                <strong>{seasonAsString}</strong>
                <div>{formatDate(dates[season])}</div>
              </DateDiv>,
            );
          }
        });
        output = (
          <>
            {datesElm}
          </>
        );
        length = datesElm.length;
      }
      if (dates.type === PeakListVariants.grid) {
        const datesElm: Array<React.ReactElement<any>> = [];
        Object.keys(dates).forEach(function(month: keyof VariableDate) {
          if (month !== 'type' && dates[month] !== undefined) {
            const monthAsString = month as string;
            const monthNameArray = monthAsString.match(/.{1,3}/g);
            const monthName = monthNameArray !== null && monthNameArray.length ? monthNameArray[0] : '';
            datesElm.push(
              <DateDiv key={monthName}>
                <strong>{monthName}</strong>
                <GridNumbers>{formatGridDate(dates[month])}</GridNumbers>
              </DateDiv>,
            );
          }
        });
        output = (
          <>
            {datesElm}
          </>
        );
        length = datesElm.length;
      }
    }
    return {dateElms: output, length};
  };

  const getMountainPopupName = (mtnId: string, mtnName: string, color: string) => {
    if (mtnId && !(peakListId === null && mountainId === null)) {
      return (
        <PopupTitleInternal
          mobileURL={mountainDetailLink(mtnId)}
          desktopURL={getDesktopUrl(mtnId)}
          color={color}
        >
          {mtnName}
        </PopupTitleInternal>
      );
    } else {
      return (
        <span style={{color, fontWeight: 600}}>
          {mtnName}
        </span>
      );
    }
  };

  const getAddAscentButton = (mtnId: string, showText: boolean) => {
    const text = showText ? getFluentString('map-add-ascent') : '';
    return isOtherUser ? null : (
      <ActionButton onClick={() => setEditMountainId(mtnId)}>
        <FontAwesomeIcon icon={faCalendarAlt} /> {text}
      </ActionButton>
    );
  };

  let popup: React.ReactElement<any>;
  if (!popupInfo) {
    popup = <></>;
  } else if (popupInfo.type === PopupDataTypes.Coordinate || popupInfo.type === PopupDataTypes.OtherMountain) {
    const {data: popupData} = popupInfo;
    let drivingInfo: React.ReactElement<any>;
    if (usersLocation.loading === true) {
      drivingInfo = (
        <DirectionsContent>
          {getFluentString('global-text-value-loading')}...
        </DirectionsContent>
      );
    } else if (usersLocation.error !== undefined) {
      drivingInfo = (
        <DirectionsContent>
          {getFluentString('mountain-detail-driving-error-location')}
        </DirectionsContent>
      );
    } else if (destination && destination.key === popupData.id && directionsData) {
      const {miles} = directionsData;
      const hours = directionsData !== undefined && directionsData.hours ? directionsData.hours + 'hrs' : '';
      const minutes = directionsData !== undefined && directionsData.minutes ? directionsData.minutes + 'm' : '';
      drivingInfo = (
        <DirectionsContent>
          {hours} {minutes} ({miles} miles)
        </DirectionsContent>
      );
    } else {
      const onClick = () => {
        setDestination({
          key: popupData.id,
          latitude: popupData.latitude,
          longitude: popupData.longitude,
        });
        if (!yourLocationOn) {
          setYourLocationOn(true);
        }
        if (userAllowsLocation() === false) {
          alert('You must enable location services for directions');
        }
      };
      drivingInfo = (
        <DirectionsButton onClick={onClick}>{getFluentString('map-get-directions')}</DirectionsButton>
      );
    }

    const drivingContent = showYourLocation ? (
      <DirectionsContainer>
        <DirectionsIcon>
          <FontAwesomeIcon icon={faCar} />
        </DirectionsIcon>
        {drivingInfo}
      </DirectionsContainer>
    ) : <></>;

    const completionDates = popupData.completionDates === undefined
      ? getCompletionDates({
          type: PeakListVariants.standard,
          mountain: {id: popupData.id},
          userMountains: completedAscents,
        })
      : popupData.completionDates;
    const {circleColor, iconImage} = getImageAndIcon({
      colorScaleColors, point: {...popupData, completionDates}, createOrEditMountain,
      highlighted, colorScaleSymbols, popUpDataType: popupInfo.type,
      addRemoveEnabled: addRemoveMountains ? true : false,
    });
    const {dateElms, length} = renderCompletionDates(completionDates);

    let actionButton: React.ReactElement<any> | null;
    if (addRemoveMountains !== undefined) {
      if (popupInfo.type === PopupDataTypes.Coordinate) {
        const onClick = () => {
          addRemoveMountains.onRemove(popupData);
          closePopup();
        };
        actionButton = (
          <ActionButton onClick={onClick}>
            {addRemoveMountains.removeText}
          </ActionButton>
        );
      } else if (popupInfo.type === PopupDataTypes.OtherMountain) {
        const onClick = () => {
          addRemoveMountains.onAdd(popupData);
          closePopup();
        };
        actionButton = (
          <ActionButton onClick={onClick}>
            {addRemoveMountains.addText}
          </ActionButton>
        );
      } else {
        console.error('Invalid value for popupInfo');
        actionButton = null;
      }
    } else {
      actionButton = null;
    }

    if (circleColor && iconImage) {
      popup = (
        <Popup
          coordinates={[popupData.longitude, popupData.latitude]}
        >
          <PopupHeader>
            <Icon>
              <img
                src={require('./images/custom-icons/' + iconImage + '.svg')}
                alt='Mountain Icon'
                style={{width: '1.65rem'}}
              />
            </Icon>
            <div>
              {getMountainPopupName(popupData.id, popupData.name, circleColor)}
              <PopupDetail>
                {popupData.elevation}ft
              </PopupDetail>
            </div>
          </PopupHeader>
          <PopupDates>
            {dateElms}
            {getAddAscentButton(popupData.id, !length)}
          </PopupDates>
          {drivingContent}
          {actionButton}
          <ClosePopup onClick={closePopup}>×</ClosePopup>
        </Popup>
      );
    } else {
      popup = <></>;
    }
  } else if (popupInfo.type === PopupDataTypes.Trail) {
    const {data: popupData} = popupInfo;
    let drivingInfo: React.ReactElement<any>;
    if (usersLocation.loading === true) {
      drivingInfo = (
        <DirectionsContent>
          {getFluentString('global-text-value-loading')}
        </DirectionsContent>
      );
    } else if (usersLocation.error !== undefined) {
      drivingInfo = (
        <DirectionsContent>
          {getFluentString('mountain-detail-driving-error-location')}
        </DirectionsContent>
      );
    } else if (destination && destination.key === popupData.id && directionsData) {
      const {miles} = directionsData;
      const hours = directionsData !== undefined && directionsData.hours ? directionsData.hours + 'hrs' : '';
      const minutes = directionsData !== undefined && directionsData.minutes ? directionsData.minutes + 'm' : '';
      drivingInfo = (
        <DirectionsContent>
          {hours} {minutes} ({miles} miles)
        </DirectionsContent>
      );
    } else {
      const onClick = () => {
        setDestination({
          key: popupData.id,
          latitude: popupData.latitude,
          longitude: popupData.longitude,
        });
        if (!yourLocationOn) {
          setYourLocationOn(true);
        }
        if (userAllowsLocation() === false) {
          alert('You must enable location services for directions');
        }
      };
      drivingInfo = (
        <DirectionsButton onClick={onClick}>{getFluentString('map-get-directions')}</DirectionsButton>
      );
    }

    const drivingContent = showYourLocation ? (
      <DirectionsContainer>
        <DirectionsIcon>
          <FontAwesomeIcon icon={faCar} />
        </DirectionsIcon>
        {drivingInfo}
      </DirectionsContainer>
    ) : <></>;

    const imageIcon = popupData.type === TrailType.Connector ? 'trail-connector' : 'trail-default';

    const openTrailModal = () => {
      setTrailModalOpen(true);
      setDestination({
        key: popupData.id,
        latitude: popupData.latitude,
        longitude: popupData.longitude,
      });
    };
    popup = (
      <Popup
        coordinates={[popupData.longitude, popupData.latitude]}
      >
        <PopupHeader>
          <Icon>
            <img
              src={require('./images/custom-icons/' + imageIcon + '.svg')}
              alt='Major Trails Legend Icon'
              style={{width: '1.65rem'}}
            />
          </Icon>
          <div>
            <PopupTitleExternal
              onClick={openTrailModal}
              color={'#7a3800'}
            >
              {popupData.name}
            </PopupTitleExternal>
            <PopupDetail>
              <strong>{popupData.mileage}mi</strong> long,{' '}
              <strong>{popupData.elevation}ft</strong> elev. gain
            </PopupDetail>
          </div>
       </PopupHeader>
       {drivingContent}
        <ClosePopup onClick={closePopup}>×</ClosePopup>
      </Popup>
    );
  } else if (popupInfo.type === PopupDataTypes.Campsite) {
    const {data: popupData} = popupInfo;
    let drivingInfo: React.ReactElement<any>;
    if (usersLocation.loading === true) {
      drivingInfo = (
        <DirectionsContent>
          {getFluentString('global-text-value-loading')}
        </DirectionsContent>
      );
    } else if (usersLocation.error !== undefined) {
      drivingInfo = (
        <DirectionsContent>
          {getFluentString('mountain-detail-driving-error-location')}
        </DirectionsContent>
      );
    } else if (destination && destination.key === popupData.id && directionsData) {
      const {miles} = directionsData;
      const hours = directionsData !== undefined && directionsData.hours ? directionsData.hours + 'hrs' : '';
      const minutes = directionsData !== undefined && directionsData.minutes ? directionsData.minutes + 'm' : '';
      drivingInfo = (
        <DirectionsContent>
          {hours} {minutes} ({miles} miles)
        </DirectionsContent>
      );
    } else {
      const onClick = () => {
        setDestination({
          key: popupData.id,
          latitude: popupData.latitude,
          longitude: popupData.longitude,
        });
        if (!yourLocationOn) {
          setYourLocationOn(true);
        }
        if (userAllowsLocation() === false) {
          alert('You must enable location services for directions');
        }
      };
      drivingInfo = (
        <DirectionsButton onClick={onClick}>{getFluentString('map-get-directions')}</DirectionsButton>
      );
    }

    const drivingContent = showYourLocation ? (
      <DirectionsContainer>
        <DirectionsIcon>
          <FontAwesomeIcon icon={faCar} />
        </DirectionsIcon>
        {drivingInfo}
      </DirectionsContainer>
    ) : <></>;

    const openCampsiteModal = () => {
      setCampsiteModalOpen(true);
      setDestination({
        key: popupData.id,
        latitude: popupData.latitude,
        longitude: popupData.longitude,
      });
    };
    popup = (
      <Popup
        coordinates={[popupData.longitude, popupData.latitude]}
      >
        <PopupHeader>
          <Icon>
            <img
              src={require('./images/custom-icons/tent-default.svg')}
              alt='Campsite Icon'
              style={{width: '1.65rem'}}
            />
          </Icon>
          <div>
            <PopupTitleExternal
              onClick={openCampsiteModal}
              color={'#7a3800'}
              dangerouslySetInnerHTML={{__html: popupData.name.toLowerCase()}}
              style={{textTransform: 'capitalize'}}
            />
          </div>
       </PopupHeader>
       {drivingContent}
        <ClosePopup onClick={closePopup}>×</ClosePopup>
      </Popup>
    );
  } else {
    popup = <></>;
  }

  let editMountainModal: React.ReactElement<any>;
  if (editMountainId === null || popupInfo === null) {
    editMountainModal = <></>;
  } else {
    if (!userId) {
      editMountainModal = (
        <SignUpModal
          text={getFluentString('global-text-value-modal-sign-up-today-ascents-list', {
            'mountain-name': popupInfo.data.name,
          })}
          onCancel={closeEditMountainModalModal}
        />
      );
    } else {
      editMountainModal = editMountainId === null ? <></> : (
        <NewAscentReport
          editMountainId={editMountainId}
          closeEditMountainModalModal={closeEditMountainModalModal}
          userId={userId}
          mountainName={popupInfo.data.name}
          variant={PeakListVariants.standard}
        />
      );
    }
  }

  const trailModal = trailModalOpen && popupInfo !== null && popupInfo.type === PopupDataTypes.Trail ? (
    <TrailDetailModal
      onClose={() => setTrailModalOpen(false)}
      trailDatum={popupInfo.data}
      directionsData={directionsData}
      getDirections={() => {
        setDestination({
          key: popupInfo.data.id,
          latitude: popupInfo.data.latitude,
          longitude: popupInfo.data.longitude,
        });
        if (!yourLocationOn) {
          setYourLocationOn(true);
        }
        if (userAllowsLocation() === false) {
          alert('You must enable location services for directions');
        }
      }}
      usersLocation={usersLocation.coordinates}
    />
  ) : <></>;

  const campsiteModal = campsiteModalOpen && popupInfo !== null && popupInfo.type === PopupDataTypes.Campsite ? (
    <CampsiteDetailModal
      onClose={() => setCampsiteModalOpen(false)}
      campsiteDatum={popupInfo.data}
      directionsData={directionsData}
      getDirections={() => {
        setDestination({
          key: popupInfo.data.id,
          latitude: popupInfo.data.latitude,
          longitude: popupInfo.data.longitude,
        });
        if (!yourLocationOn) {
          setYourLocationOn(true);
        }
        if (userAllowsLocation() === false) {
          alert('You must enable location services for directions');
        }
      }}
      usersLocation={usersLocation.coordinates}
    />
  ) : <></>;

  return (
    <>
      {popup}
      {editMountainModal}
      {trailModal}
      {campsiteModal}
    </>
  );

};

export default MapPopup;
