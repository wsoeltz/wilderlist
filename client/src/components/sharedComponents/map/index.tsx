import {
  faCalendarAlt,
  faCar,
  faLongArrowAltDown,
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import sortBy from 'lodash/sortBy';
import {lighten} from 'polished';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactMapboxGl, {
  Feature,
  Layer,
  MapContext,
  Popup,
  RotationControl,
  ZoomControl,
} from 'react-mapbox-gl';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  friendsProfileWithPeakListWithMountainDetailLink,
  listDetailWithMountainDetailLink,
  mountainDetailLink,
} from '../../../routing/Utils';
import {
  BasicIconInText,
  borderRadius,
  ButtonSecondary,
  lightBorderColor,
  linkStyles,
  placeholderColor,
  primaryColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import getDrivingDistances, {DrivingData} from '../../../utilities/getDrivingDistances';
import getTrails, {TrailsDatum, TrailType} from '../../../utilities/getTrails';
import {
  setUserAllowsLocation,
  userAllowsLocation,
} from '../../../Utils';
import NewAscentReport from '../../peakLists/detail/completionModal/NewAscentReport';
import {
  VariableDate,
} from '../../peakLists/detail/getCompletionDates';
import {
  formatDate,
  formatGridDate,
} from '../../peakLists/Utils';
import DynamicLink from '../DynamicLink';
import SignUpModal from '../SignUpModal';
import ColorScale from './ColorScale';
import {getImageAndIcon} from './colorScaleColors';

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ? process.env.REACT_APP_MAPBOX_ACCESS_TOKEN : '';

const Mapbox = ReactMapboxGl({
  accessToken,
  maxZoom: 16,
  scrollZoom: false,
});

const Root = styled.div`
  margin: 2rem 0;
  border: 1px solid ${lightBorderColor};

  .mapboxgl-popup-tip {
    border-top-color: rgba(255, 255, 255, 0.85);
  }
  .mapboxgl-popup-content {
    background-color: rgba(255, 255, 255, 0.85);
  }
`;

const StyledPopup = styled.div`
`;

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

const PopupTitleExternal = styled.a<ColorProps>`
  ${linkStyles}
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({color}) => color};

  &:hover {
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

const Date = styled.div`
  margin-right: 0.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  line-height: 1.4;
`;

const GridNumbers = styled.div`
  letter-spacing: -1px;
`;

const AddAscentButton = styled(ButtonSecondary)`
  padding: 0.3rem;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 100%;

  &:not(:first-child) {
    margin-left: auto;
  }
`;

const Crosshair = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    border-right: 1px solid gray;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    border-bottom: 1px solid gray;
  }
`;

const ReloadMapContainer = styled.div`
  position: absolute;
  bottom: 5px;
  right: 0;
  left: 0;
  background-color: #f8f8f8;
  cursor: pointer;
  width: 100px;
  margin: auto;
  text-align: center;
  padding: 0.2rem;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const BrokenMapMessage = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: -1;
  background-color: ${lightBorderColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.75rem;
  align-items: center;
  padding: 2rem;
  text-align: center;
  font-size: 1rem;
  line-height: 1.75;
  font-weight: 600;
  color: #585858;
`;

const DirectionsContainer = styled.div`
  display: flex;
  margin-top: 0.8rem;
`;

const DirectionsIcon = styled.div`
  border: solid 1px ${primaryColor};
  border-top-left-radius: ${borderRadius}px;
  border-bottom-left-radius: ${borderRadius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  color: ${primaryColor};
`;

const directionsContentStyles = `
  border: solid 1px ${primaryColor};
  border-top-right-radius: ${borderRadius}px;
  border-bottom-right-radius: ${borderRadius}px;
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  font-weight: 600;
`;

const DirectionsContent = styled.div`
  ${directionsContentStyles}
  background-color: ${lighten(0.4, primaryColor)};
`;

const DirectionsButton = styled.button`
  ${directionsContentStyles}
  background-color: ${primaryColor};
  color: #fff;
  text-transform: uppercase;

  &:hover {
    background-color: ${lighten(0.1, primaryColor)};
  }
`;
const getTrailsData = async (lat: number, lon: number, setTrailData: (input: Trail[]) => void) => {
  try {
    const res = await getTrails({params: {lat, lon, maxDistance: 180}});
    if (res && res.data && res.data.trails) {
      const rawData: TrailsDatum[] = res.data.trails;
      const cleanedTrailData: Trail[] = rawData.map(trailDatum => {
        return {
          id: trailDatum.id.toString(),
          latitude: trailDatum.latitude,
          longitude: trailDatum.longitude,
          name: trailDatum.name,
          elevation: trailDatum.ascent,
          url: trailDatum.url,
          mileage: trailDatum.length,
          type: trailDatum.type,
        };
      });
      setTrailData([...cleanedTrailData]);
    } else {
      console.error('There was an error getting the location response');
    }
  } catch (err) {
    console.error(err);
  }
};

const getMinMax = (coordinates: Coordinate[]) => {
  if (coordinates.length === 0) {
    return { minLat: 22, maxLat: 54, minLong: -129, maxLong: -64 };
  }
  const sortedByLat = sortBy(coordinates, ['latitude']);
  const sortedByLong = sortBy(coordinates, ['longitude']);

  const minLat = sortedByLat[sortedByLat.length - 1].latitude;
  const maxLat = sortedByLat[0].latitude;
  const minLong = sortedByLong[sortedByLong.length - 1].longitude;
  const maxLong = sortedByLong[0].longitude;

  return { minLat, maxLat, minLong, maxLong };
};

interface Coordinate {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  elevation: number;
}

interface Trail extends Coordinate {
  url: string;
  mileage: number;
  type: TrailType;
}

export type CoordinateWithDates = Coordinate & {completionDates?: VariableDate | null};

enum PopupDataTypes {
  Coordinate,
  Trail,
}

type PopupData = (
  {
    type: PopupDataTypes.Coordinate;
    data: CoordinateWithDates;
  } | {
    type: PopupDataTypes.Trail;
    data: Trail;
  }
);

interface IUserLocation {
  loading: boolean;
  error: string | undefined;
  coordinates: undefined | {
    latitude: number;
    longitude: number;
  };
}

interface Props {
  id: string | null;
  userId: string | null;
  coordinates: CoordinateWithDates[];
  highlighted?: CoordinateWithDates[];
  isOtherUser?: boolean;
  createOrEditMountain?: boolean;
  showCenterCrosshairs?: boolean;
  returnLatLongOnClick?: (lat: number | string, lng: number | string) => void;
  colorScaleTitle?: string;
  colorScaleColors: string[];
  colorScaleSymbols: string[];
  colorScaleLabels: string[];
  fillSpace?: boolean;
  showNearbyTrails?: boolean;
  defaultMajorTrailsOn?: boolean;
  defaultMinorTrailsOn?: boolean;
  showYourLocation?: boolean;
  defaultLocationOn?: boolean;
  localstorageKeys?: {
    majorTrail?: string;
    minorTrail?: string;
    yourLocation?: string;
  };
}

const Map = (props: Props) => {
  const {
    id, coordinates, highlighted,
    userId, isOtherUser, createOrEditMountain,
    showCenterCrosshairs, returnLatLongOnClick,
    colorScaleColors, colorScaleLabels, fillSpace,
    colorScaleTitle, showNearbyTrails, colorScaleSymbols,
    showYourLocation, defaultMajorTrailsOn, defaultMinorTrailsOn,
    localstorageKeys, defaultLocationOn,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const { minLat, maxLat, minLong, maxLong } = getMinMax(coordinates);

  let initialCenter: [number, number];
  if (highlighted && highlighted.length === 1) {
    initialCenter = [highlighted[0].longitude, highlighted[0].latitude];
  } else if (coordinates.length) {
    initialCenter = [(maxLong + minLong) / 2, (maxLat + minLat) / 2];
  } else {
    initialCenter = [-71.52769471, 43.20415146];
  }
  const [mapReloadCount, setMapReloadCount] = useState<number>(0);
  const incReload = () => setMapReloadCount(mapReloadCount + 1);
  const [popupInfo, setPopupInfo] = useState<PopupData | null>(null);
  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [fitBounds, setFitBounds] =
    useState<[[number, number], [number, number]] | undefined>([[minLong, minLat], [maxLong, maxLat]]);
  const [map, setMap] = useState<any>(null);
  const [trailData, setTrailData] = useState<undefined | Trail[]>(undefined);

  const [colorScaleHeight, setColorScaleHeight] = useState<number>(0);

  const initialMajorTrailsSetting = defaultMajorTrailsOn ? true : false;
  const [majorTrailsOn, setMajorTrailsOn] = useState<boolean>(initialMajorTrailsSetting);
  const toggleMajorTrails = () => {
    const newValue = !majorTrailsOn;
    setMajorTrailsOn(newValue);
    if (localstorageKeys && localstorageKeys.majorTrail) {
      localStorage.setItem(localstorageKeys.majorTrail, newValue.toString());
    }
  };

  const initialMinorTrailsSetting = defaultMinorTrailsOn ? true : false;
  const [minorTrailsOn, setMinorTrailsOn] = useState<boolean>(initialMinorTrailsSetting);
  const toggleMinorTrails = () => {
    const newValue = !minorTrailsOn;
    setMinorTrailsOn(newValue);
    if (localstorageKeys && localstorageKeys.minorTrail) {
      localStorage.setItem(localstorageKeys.minorTrail, newValue.toString());
    }
  };

  const initiaYourLocationSetting = defaultLocationOn ? true : false;
  const [yourLocationOn, setYourLocationOn] = useState<boolean>(initiaYourLocationSetting);
  const toggleYourLocation = () => {
    const newValue = !yourLocationOn;
    setYourLocationOn(newValue);
    if (localstorageKeys && localstorageKeys.yourLocation) {
      localStorage.setItem(localstorageKeys.yourLocation, newValue.toString());
    }
    if (userAllowsLocation() === false) {
      alert('You must enable location services for directions');
    }
  };

  const [usersLocation, setUsersLocation] = useState<IUserLocation>({
    error: undefined, loading: false, coordinates: undefined,
  });
  const [destination, setDestination] =
    useState<{key: string, latitude: number, longitude: number} | undefined>(undefined);
  const [directionsCache, setDirectionsCache] = useState<Array<DrivingData & {key: string}>>([]);
  const [directionsData, setDirectionsData] = useState<DrivingData | undefined>(undefined);

  useEffect(() => {
    if (yourLocationOn === true) {
      const onSuccess = ({coords: {latitude, longitude}}: Position) => {
        setUsersLocation({coordinates: {latitude, longitude}, error: undefined, loading: false});
        if (localstorageKeys && localstorageKeys.yourLocation) {
          localStorage.setItem(localstorageKeys.yourLocation, 'true');
        }
        setUserAllowsLocation(true);
      };
      const onError = () => {
        setUsersLocation({
          coordinates: undefined, error: 'You must enable location services for directions', loading: false,
        });
        setUserAllowsLocation(false);
      };
      if (!navigator.geolocation) {
        setUsersLocation({
          coordinates: undefined, error: 'Geolocation is not supported by your browser', loading: false,
        });
      } else {
        setUsersLocation({coordinates: undefined, error: undefined, loading: true});
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }
    } else {
      if (localstorageKeys && localstorageKeys.yourLocation) {
        localStorage.setItem(localstorageKeys.yourLocation, 'false');
      }
    }
  }, [yourLocationOn, localstorageKeys]);

  useEffect(() => {
    if (usersLocation.error === undefined &&
        usersLocation.loading === false &&
        usersLocation.coordinates !== undefined &&
        destination !== undefined) {
      const cachedData = directionsCache.find(({key}) => key === destination.key);
      if (cachedData) {
        setDirectionsData(cachedData);
      } else {
        getDrivingDistances(
          usersLocation.coordinates.latitude, usersLocation.coordinates.longitude,
          destination.latitude, destination.longitude)
        .then(res => {
          if (res) {
            setDirectionsData(res);
            const cachedRes = {...res, key: destination.key};
            setDirectionsCache([...directionsCache, cachedRes]);
          } else {
            setDirectionsData(undefined);
          }
        })
        .catch(err => console.error(err));
      }
    }
  }, [usersLocation, destination, setDirectionsCache, directionsCache]);

  const colorScaleRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (colorScaleRef && colorScaleRef.current) {
      setColorScaleHeight(colorScaleRef.current.offsetHeight);
    }
  }, [colorScaleRef, setColorScaleHeight]);

  useEffect(() => {
    if (showNearbyTrails === true && trailData === undefined) {
      getTrailsData(center[1], center[0], setTrailData);
    }
  }, [setTrailData, showNearbyTrails, trailData, center]);

  const latLngDecimalPoints = 8;
  const [centerCoords, setCenterCoords] = useState<[string, string]>(
    [initialCenter[0].toFixed(latLngDecimalPoints), initialCenter[1].toFixed(latLngDecimalPoints)]);
  useEffect(() => {
    const enableZoom = (e: KeyboardEvent) => {
      if (e.shiftKey && map) {
        map.scrollZoom.enable();
      }
    };
    const disableZoom = () => {
      if (map) {
        map.scrollZoom.disable();
      }
    };
    const disableDragPanOnTouchDevics = () => {
      if (map) {
        map.dragPan.disable();
      }
    };

    if (map && fillSpace === true) {
      map.scrollZoom.enable();
    } else {
      document.body.addEventListener('keydown', enableZoom);
      document.body.addEventListener('keyup', disableZoom);
      document.body.addEventListener('touchstart', disableDragPanOnTouchDevics);
    }

    const getCenterCoords = () => {
      if (map) {
        const {lat, lng}: {lat: number, lng: number} = map.getCenter();
        setCenterCoords([lat.toFixed(latLngDecimalPoints), lng.toFixed(latLngDecimalPoints)]);
      }
    };
    if (map && showCenterCrosshairs) {
      map.on('move', getCenterCoords);
    }

    return () => {
      document.body.removeEventListener('keydown', enableZoom);
      document.body.removeEventListener('keyup', disableZoom);
      document.body.removeEventListener('touchstart', disableDragPanOnTouchDevics);
      if (map && showCenterCrosshairs) {
        map.off('move', getCenterCoords);
        // destroy the map on unmount
        map.remove();
      }
    };
  }, [map, showCenterCrosshairs, fillSpace]);

  useEffect(() => {
    if (!createOrEditMountain) {
      const coords = getMinMax(coordinates);
      setFitBounds([[coords.minLong, coords.minLat], [coords.maxLong, coords.maxLat]]);
    }
  }, [coordinates, createOrEditMountain]);

  useEffect(() => {
    if (highlighted && highlighted.length === 1) {
      setPopupInfo({type: PopupDataTypes.Coordinate, data: {...highlighted[0]}});
      setCenter([highlighted[0].longitude, highlighted[0].latitude]);
    } else if (coordinates.length === 1) {
      setPopupInfo({type: PopupDataTypes.Coordinate, data: {...coordinates[0]}});
      setCenter([coordinates[0].longitude, coordinates[0].latitude]);
      setDestination({
        key: coordinates[0].id, latitude: coordinates[0].latitude, longitude: coordinates[0].longitude,
      });
    }
  }, [highlighted, setPopupInfo, setCenter, coordinates]);

  const togglePointer = (mapEl: any, cursor: string) => {
    mapEl.getCanvas().style.cursor = cursor;
  };

  const features = coordinates.map(point => {
    const onClick = () => {
      setPopupInfo({type: PopupDataTypes.Coordinate, data: {...point}});
      setCenter([point.longitude, point.latitude]);
      if (showNearbyTrails === true) {
        getTrailsData(point.latitude, point.longitude, setTrailData);
      }
    };
    const {circleColor, iconImage} = getImageAndIcon({
      colorScaleColors, point, createOrEditMountain,
      highlighted, colorScaleSymbols,
    });
    return (
      <Feature
        coordinates={[point.longitude, point.latitude]}
        onClick={onClick}
        onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
        onMouseLeave={(event: any) => togglePointer(event.map, '')}
        properties={{
          'circle-color': circleColor,
          'icon-image': iconImage,
        }}
        key={'' + point.latitude + point.longitude}
      />
    );
  });

  const renderCompletionDates = (dates: VariableDate | null | undefined) => {
    if (dates) {
      if (dates.type === PeakListVariants.standard) {
        if (dates.standard !== undefined) {
          const completedTextFluentId = isOtherUser ? 'map-completed-other-user' : 'map-completed';
          return (
            <Date>
              <strong>{getFluentString(completedTextFluentId)}: </strong>
              {formatDate(dates.standard)}
            </Date>
          );
        }
      }
      if (dates.type === PeakListVariants.winter) {
        if (dates.winter !== undefined) {
          return (
            <Date>
              <strong>{getFluentString('map-completed-in-winter')}: </strong>
              {formatDate(dates.winter)}
            </Date>
          );
        }
      }
      if (dates.type === PeakListVariants.fourSeason) {
        const datesElm: Array<React.ReactElement<any>> = [];
        Object.keys(dates).forEach(function(season: keyof VariableDate) {
          if (season !== 'type' && dates[season] !== undefined) {
            const seasonAsString = season as string;
            datesElm.push(
              <Date key={season}>
                <strong>{seasonAsString}</strong>
                <div>{formatDate(dates[season])}</div>
              </Date>,
            );
          }
        });
        return (
          <>
            {datesElm}
          </>
        );
      }
      if (dates.type === PeakListVariants.grid) {
        const datesElm: Array<React.ReactElement<any>> = [];
        Object.keys(dates).forEach(function(month: keyof VariableDate) {
          if (month !== 'type' && dates[month] !== undefined) {
            const monthAsString = month as string;
            const monthNameArray = monthAsString.match(/.{1,3}/g);
            const monthName = monthNameArray !== null && monthNameArray.length ? monthNameArray[0] : '';
            datesElm.push(
              <Date key={monthName}>
                <strong>{monthName}</strong>
                <GridNumbers>{formatGridDate(dates[month])}</GridNumbers>
              </Date>,
            );
          }
        });
        return (
          <>
            {datesElm}
          </>
        );
      }
    }
    return null;
  };

  let editMountainModal: React.ReactElement<any> | null;
  if (editMountainId === null || popupInfo === null) {
    editMountainModal = null;
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
      editMountainModal = editMountainId === null ? null : (
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

  const getDesktopUrl = (mountainId: Mountain['id']) => {
    if (id === mountainId || id === null) {
      return mountainDetailLink(mountainId);
    } else {
      if (isOtherUser && userId) {
        return friendsProfileWithPeakListWithMountainDetailLink(userId, id, mountainId);
      } else {
        return listDetailWithMountainDetailLink(id, mountainId);
      }
    }
  };

  const getMountainPopupName = (mtnId: string, mtnName: string, color: string) => {
    return (
      <PopupTitleInternal
        mobileURL={mountainDetailLink(mtnId)}
        desktopURL={getDesktopUrl(mtnId)}
        color={color}
      >
        {mtnName}
      </PopupTitleInternal>
    );
  };

  const getAddAscentButton = (mtnId: string, showText: boolean) => {
    const text = showText ? getFluentString('map-add-ascent') : '';
    return isOtherUser ? null : (
      <AddAscentButton onClick={() => setEditMountainId(mtnId)}>
        <FontAwesomeIcon icon={faCalendarAlt} /> {text}
      </AddAscentButton>
    );
  };

  const crosshairs = showCenterCrosshairs === true ? <Crosshair /> : <React.Fragment />;

  const trails: Array<React.ReactElement<any>> = [];

  if (showNearbyTrails && trailData !== undefined) {
    trailData.forEach(point => {
      const onClick = () => {
        setPopupInfo({type: PopupDataTypes.Trail, data: {...point}});
        setCenter([point.longitude, point.latitude]);
      };
      if (
        !((point.type === TrailType.Connector && !minorTrailsOn) ||
          (point.type !== TrailType.Connector && !majorTrailsOn))
       ) {
        const iconImage = point.type === TrailType.Connector ? 'trail-connector' : 'trail-default';
        trails.push(
          <Feature
            coordinates={[point.longitude, point.latitude]}
            onClick={onClick}
            onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
            onMouseLeave={(event: any) => togglePointer(event.map, '')}
            properties={{
              'icon-image': iconImage,
            }}
            key={point.id + point.latitude + point.longitude}
          />,
        );
      }
    });
  }

  const trailLayer = trails && trails.length ? (
    <Layer
      type='symbol'
      id='trail-signs'
      layout={{
        'icon-image': ['get', 'icon-image'],
        'icon-size': {
          base: 0.5,
          stops: [
            [1, 0.2],
            [10, 0.45],
            [17, 0.75],
            [20, 1],
          ],
        },
      }}
    >
      {trails}
    </Layer>
  ) : <></>;

  const yourLocationLayer = showYourLocation && yourLocationOn && usersLocation.coordinates !== undefined ? (
    <Layer
      type='symbol'
      id='your-location'
      layout={{
        'icon-image': 'your-location',
        'icon-size': 1,
        'icon-allow-overlap': true,
      }}
    >
      <Feature
        coordinates={[usersLocation.coordinates.longitude, usersLocation.coordinates.latitude]}
        onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
        onMouseLeave={(event: any) => togglePointer(event.map, '')}
      />
    </Layer>
  ) : <></>;

  const directionsLayer = showYourLocation && yourLocationOn && directionsData !== undefined ? (
    <Layer
       type='line'
       id='directions-layer'
       layout={{ 'line-cap': 'round', 'line-join': 'round' }}
       paint={{ 'line-color': '#206ca6', 'line-width': 4 }}>
       <Feature coordinates={directionsData.coordinates}/>
    </Layer>
  ) : <></>;

  let popup: React.ReactElement<any>;
  if (!popupInfo) {
    popup = <></>;
  } else if (popupInfo.type === PopupDataTypes.Coordinate) {
    const {data: popupData} = popupInfo;
    let drivingInfo: React.ReactElement<any>;
    if (destination && destination.key === popupData.id && directionsData) {
      const {hours, minutes, miles} = directionsData;
      drivingInfo = (
        <DirectionsContent>
          {hours}hrs {minutes}m ({miles} miles)
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

    const {circleColor, iconImage} = getImageAndIcon({
      colorScaleColors, point: popupData, createOrEditMountain,
      highlighted, colorScaleSymbols,
    });
    const dateElms = renderCompletionDates(popupData.completionDates);
    popup = (
      <Popup
        coordinates={[popupData.longitude, popupData.latitude]}
      >
        <StyledPopup>
          <PopupHeader>
            <Icon>
              <img
                src={require('./images/custom-icons/' + iconImage + '.svg')}
                alt='Major Trails Legend Icon'
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
            {getAddAscentButton(popupData.id, !dateElms)}
          </PopupDates>
          <DirectionsContainer>
            <DirectionsIcon>
              <FontAwesomeIcon icon={faCar} />
            </DirectionsIcon>
            {drivingInfo}
          </DirectionsContainer>
          <ClosePopup onClick={() => setPopupInfo(null)}>×</ClosePopup>
        </StyledPopup>
      </Popup>
    );
  } else if (popupInfo.type === PopupDataTypes.Trail) {
    const {data: popupData} = popupInfo;
    let drivingInfo: React.ReactElement<any>;
    if (destination && destination.key === popupData.id && directionsData) {
      const {hours, minutes, miles} = directionsData;
      drivingInfo = (
        <DirectionsContent>
          {hours}hrs {minutes}m ({miles} miles)
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
    const imageIcon = popupData.type === TrailType.Connector ? 'trail-connector' : 'trail-default';
    popup = (
      <Popup
        coordinates={[popupData.longitude, popupData.latitude]}
      >
        <StyledPopup>
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
                href={popupData.url}
                target='_blank'
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
          <DirectionsContainer>
            <DirectionsIcon>
              <FontAwesomeIcon icon={faCar} />
            </DirectionsIcon>
            {drivingInfo}
          </DirectionsContainer>
          <ClosePopup onClick={() => setPopupInfo(null)}>×</ClosePopup>
        </StyledPopup>
      </Popup>
    );
  } else {
    popup = <></>;
  }

  const mapRenderProps = (mapEl: any) => {
    setMap(mapEl);
    return null;
  };

  return (
    <Root
      style={{
        height: fillSpace === true ? '100%' : undefined,
        margin: fillSpace === true ? '0' : undefined,
        pointerEvents: !map ? 'none' : undefined,
      }}
    >
      <Mapbox
        // eslint-disable-next-line
        style={'mapbox://styles/wsoeltz/ck41nop7o0t7d1cqdtokuavwk'}
        containerStyle={{
          height: fillSpace === true ? `calc(100% - ${colorScaleHeight}px)` : '500px',
          width: '100%',
        }}
        center={center}
        onClick={() => setPopupInfo(null)}
        fitBounds={fitBounds}
        fitBoundsOptions={{padding: 50, linear: true}}
        movingMethod={'flyTo'}
        key={`mapkey-${colorScaleHeight}-${mapReloadCount}`}
      >
        <ZoomControl />
        <RotationControl style={{ top: 80 }} />
        {directionsLayer}
        {trailLayer}
        <Layer
          type='circle'
          id='marker-circle'
          maxZoom={9.85}
          paint={{
            'circle-color': ['get', 'circle-color'],
            'circle-radius': {
              base: 5,
              stops: [
                [1, 4],
                [10, 10],
              ],
            },
          }}
        >
          {features}
        </Layer>
        <Layer
          type='symbol'
          id='marker-icon'
          minZoom={9.85}
          layout={{
            'icon-image': ['get', 'icon-image'],
            'icon-size': {
              base: 0.5,
              stops: [
                [1, 0.4],
                [10, 0.7],
                [20, 1],
              ],
            },
            'icon-allow-overlap': true,
          }}
        >
          {features}
        </Layer>
        {yourLocationLayer}
        {popup}
        {crosshairs}
        <BrokenMapMessage>
          {getFluentString('map-broken-message')}
          <BasicIconInText
            icon={faLongArrowAltDown}
            style={{
              fontSize: '1rem',
              margin: '1rem 0',
            }}
          />
        </BrokenMapMessage>
        <ReloadMapContainer
          onClick={incReload}
        >
          <BasicIconInText icon={faSync} />
          {getFluentString('map-refresh-map')}
        </ReloadMapContainer>
        <MapContext.Consumer children={mapRenderProps} />
      </Mapbox>
      <ColorScale
        centerCoords={centerCoords}
        showCenterCrosshairs={showCenterCrosshairs}
        returnLatLongOnClick={returnLatLongOnClick}
        colorScaleTitle={colorScaleTitle}
        colorScaleColors={colorScaleColors}
        colorScaleLabels={colorScaleLabels}
        showNearbyTrails={showNearbyTrails}
        showYourLocation={showYourLocation}
        majorTrailsOn={majorTrailsOn}
        toggleMajorTrails={toggleMajorTrails}
        minorTrailsOn={minorTrailsOn}
        toggleMinorTrails={toggleMinorTrails}
        yourLocationOn={yourLocationOn}
        toggleYourLocation={toggleYourLocation}
        ref={colorScaleRef}
      />
      {editMountainModal}
    </Root>
  );

};

export default Map;
