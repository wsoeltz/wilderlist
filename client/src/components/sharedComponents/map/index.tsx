import {
  faLongArrowAltDown,
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import sortBy from 'lodash/sortBy';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactMapboxGl, {
  MapContext,
  RotationControl,
  ZoomControl,
} from 'react-mapbox-gl';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  lightBorderColor,
} from '../../../styling/styleUtils';
import { CompletedMountain } from '../../../types/graphQLTypes';
import getDrivingDistances, {DrivingData} from '../../../utilities/getDrivingDistances';
import {
  setUserAllowsLocation,
  userAllowsLocation,
} from '../../../Utils';
import ColorScale from './ColorScale';
import DirectionsAndLocation from './DirectionsAndLocation';
import MapPopup from './MapPopup';
import NearbyMountains from './NearbyMountains';
import PrimaryMountains from './PrimaryMountains';
import TrailsLayer, {getTrailsData} from './TrailsLayer';
import {
  Coordinate,
  CoordinateWithDates,
  DestinationDatum,
  IUserLocation,
  PopupData,
  PopupDataTypes,
  Trail,
} from './types';

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ? process.env.REACT_APP_MAPBOX_ACCESS_TOKEN : '';

const Mapbox = ReactMapboxGl({
  accessToken,
  maxZoom: 16,
  scrollZoom: false,
});

export const MapContainer = styled.div`
  margin: 2rem 0;
`;

const Root = styled.div`
  border: 1px solid ${lightBorderColor};

  .mapboxgl-popup-tip {
    border-top-color: rgba(255, 255, 255, 0.85);
  }
  .mapboxgl-popup-content {
    background-color: rgba(255, 255, 255, 0.85);
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

interface Props {
  mountainId: string | null;
  peakListId: string | null;
  userId: string | null;
  coordinates: CoordinateWithDates[];
  highlighted?: CoordinateWithDates[];
  isOtherUser?: boolean;
  otherUserId?: string;
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
  showOtherMountains?: boolean;
  defaultOtherMountainsOn?: boolean;
  localstorageKeys?: {
    majorTrail?: string;
    minorTrail?: string;
    yourLocation?: string;
    otherMountains?: string;
  };
  completedAscents: CompletedMountain[];
}

const Map = (props: Props) => {
  const {
    mountainId, peakListId, coordinates, highlighted,
    userId, isOtherUser, otherUserId, createOrEditMountain,
    showCenterCrosshairs, returnLatLongOnClick,
    colorScaleColors, colorScaleLabels, fillSpace,
    colorScaleTitle, showNearbyTrails, colorScaleSymbols,
    showYourLocation, defaultMajorTrailsOn, defaultMinorTrailsOn,
    localstorageKeys, defaultLocationOn, showOtherMountains,
    defaultOtherMountainsOn, completedAscents,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const { minLat, maxLat, minLong, maxLong } = getMinMax(coordinates);

  let initialCenter: [number, number];
  if (highlighted && highlighted.length === 1) {
    initialCenter = [ highlighted[0].latitude, highlighted[0].longitude];
  } else if (coordinates.length) {
    initialCenter = [(maxLat + minLat) / 2, (maxLong + minLong) / 2];
  } else {
    initialCenter = [43.20415146, -71.52769471];
  }
  const [mapReloadCount, setMapReloadCount] = useState<number>(0);
  const incReload = () => setMapReloadCount(mapReloadCount + 1);
  const [popupInfo, setPopupInfo] = useState<PopupData | null>(null);
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

  const initialOtherMountainsSetting = defaultOtherMountainsOn ? true : false;
  const [otherMountainsOn, setOtherMountainsOn] = useState<boolean>(initialOtherMountainsSetting);
  const toggleOtherMountains = () => {
    const newValue = !otherMountainsOn;
    setOtherMountainsOn(newValue);
    if (localstorageKeys && localstorageKeys.otherMountains) {
      localStorage.setItem(localstorageKeys.otherMountains, newValue.toString());
    }
  };

  const [usersLocation, setUsersLocation] = useState<IUserLocation>({
    error: undefined, loading: false, coordinates: undefined,
  });
  const [destination, setDestination] =
    useState<DestinationDatum | undefined>(undefined);
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
    if (map && showOtherMountains) {
      map.on('dragend', getCenterCoords);
      map.on('zoomend', getCenterCoords);
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
      if (map && showOtherMountains) {
        map.off('dragend', getCenterCoords);
        map.off('zoomend', getCenterCoords);
        // destroy the map on unmount
        map.remove();
      }
    };
  }, [map, showCenterCrosshairs, fillSpace, showOtherMountains]);

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

  const onFeatureClick = (point: CoordinateWithDates) => {
    setPopupInfo({type: PopupDataTypes.Coordinate, data: {...point}});
    if (showNearbyTrails === true) {
      getTrailsData(point.latitude, point.longitude, setTrailData);
    }
  };

  const crosshairs = showCenterCrosshairs === true ? <Crosshair /> : <React.Fragment />;

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
        <DirectionsAndLocation
          usersLocation={usersLocation}
          destination={destination}
          directionsData={directionsData}
          yourLocationOn={yourLocationOn}
          showYourLocation={showYourLocation}
          togglePointer={togglePointer}
        />
        <TrailsLayer
          showNearbyTrails={showNearbyTrails}
          trailData={trailData}
          setTrailData={setTrailData}
          setPopupInfo={setPopupInfo}
          minorTrailsOn={minorTrailsOn}
          majorTrailsOn={majorTrailsOn}
          togglePointer={togglePointer}
        />
        <NearbyMountains
          latitude={parseFloat(centerCoords[0])}
          longitude={parseFloat(centerCoords[1])}
          mountainsToIgnore={coordinates.map(mtn => mtn.id)}
          onFeatureClick={onFeatureClick}
          togglePointer={togglePointer}
          showOtherMountains={showOtherMountains}
          otherMountainsOn={otherMountainsOn}
        />
        <PrimaryMountains
          coordinates={coordinates}
          onFeatureClick={onFeatureClick}
          colorScaleColors={colorScaleColors}
          colorScaleSymbols={colorScaleSymbols}
          createOrEditMountain={createOrEditMountain}
          highlighted={highlighted}
          togglePointer={togglePointer}
        />
        <MapPopup
          popupInfo={popupInfo}
          completedAscents={completedAscents}
          peakListId={peakListId}
          mountainId={mountainId}
          userId={userId}
          isOtherUser={isOtherUser}
          otherUserId={otherUserId}
          usersLocation={usersLocation}
          destination={destination}
          setDestination={setDestination}
          directionsData={directionsData}
          closePopup={() => setPopupInfo(null)}
          yourLocationOn={yourLocationOn}
          showYourLocation={showYourLocation}
          setYourLocationOn={setYourLocationOn}
          colorScaleColors={colorScaleColors}
          colorScaleSymbols={colorScaleSymbols}
          createOrEditMountain={createOrEditMountain}
          highlighted={highlighted}
        />
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
        showOtherMountains={showOtherMountains}
        otherMountainsOn={otherMountainsOn}
        toggleOtherMountains={toggleOtherMountains}
        ref={colorScaleRef}
      />
    </Root>
  );

};

export default Map;
