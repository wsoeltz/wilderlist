import {
  faLongArrowAltDown,
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  MapContext,
  RotationControl,
  ZoomControl,
} from 'react-mapbox-gl';
import {useHistory} from 'react-router';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import MapboxContext from '../../../contextProviders/mapBoxContext';
import usePrevious from '../../../hooks/usePrevious';
import {Routes} from '../../../routing/routes';
import {
  BasicIconInText,
  lightBorderColor,
} from '../../../styling/styleUtils';
import { CompletedMountain } from '../../../types/graphQLTypes';
import {
  Campsite,
} from '../../../utilities/getCampsites';
import getDrivingDistances, {DrivingData} from '../../../utilities/getDrivingDistances';
import {AppContext} from '../../App';
import CampsitesLayer, {getCampsitesData} from './CampsitesLayer';
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
  PopupData,
  PopupDataTypes,
  Trail,
} from './types';

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

export enum MovingMethod {
  jumpTo = 'jumpTo',
  flyTo = 'flyTo',
  easeTo = 'easeTo',
}

export interface Props {
  mountainId: string | null;
  peakListId: string | null;
  userId: string | null;
  completedAscents: CompletedMountain[];
  coordinates: CoordinateWithDates[];
  colorScaleColors: string[];
  colorScaleSymbols: string[];
  colorScaleLabels: string[];
  highlighted?: CoordinateWithDates[];
  isOtherUser?: boolean;
  otherUserId?: string;
  createOrEditMountain?: boolean;
  showCenterCrosshairs?: boolean;
  returnLatLongOnClick?: (lat: number | string, lng: number | string) => void;
  colorScaleTitle?: string;
  fillSpace?: boolean;
  showNearbyTrails?: boolean;
  defaultMajorTrailsOn?: boolean;
  showYourLocation?: boolean;
  defaultLocationOn?: boolean;
  showOtherMountains?: boolean;
  defaultOtherMountainsOn?: boolean;
  showCampsites?: boolean;
  defaultCampsitesOn?: boolean;
  localstorageKeys?: {
    majorTrail?: string;
    campsites?: string;
    yourLocation?: string;
    otherMountains?: string;
  };
  movingMethod?: MovingMethod;
  addRemoveMountains?: {
    addText: string;
    onAdd: (mountain: CoordinateWithDates) => void;
    removeText: string;
    onRemove: (mountain: CoordinateWithDates) => void;
  };
  primaryMountainLegendCopy?: string;
  customScaleContentBottom?: React.ReactNode;
}

const Map = (props: Props) => {
  const {
    mountainId, peakListId, coordinates, highlighted,
    userId, isOtherUser, otherUserId, createOrEditMountain,
    showCenterCrosshairs, returnLatLongOnClick,
    colorScaleColors, colorScaleLabels, fillSpace,
    colorScaleTitle, showNearbyTrails, colorScaleSymbols,
    showYourLocation, defaultMajorTrailsOn,
    localstorageKeys, defaultLocationOn, showOtherMountains,
    defaultOtherMountainsOn, completedAscents,
    defaultCampsitesOn, showCampsites, movingMethod,
    addRemoveMountains, primaryMountainLegendCopy, customScaleContentBottom,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {usersLocation} = useContext(AppContext);

  const Mapbox = useContext(MapboxContext);

  const history = useHistory();

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
  const [campsiteData, setCampsiteData] = useState<undefined | Campsite[]>(undefined);

  const [colorScaleHeight, setColorScaleHeight] = useState<number>(0);

  const initialMajorTrailsSetting = defaultMajorTrailsOn ? true : false;
  const [majorTrailsOn, setMajorTrailsOn] = useState<boolean>(initialMajorTrailsSetting);
  const toggleMajorTrails = () => {
    const newValue = !majorTrailsOn;
    setMajorTrailsOn(newValue);
    if (localstorageKeys && localstorageKeys.majorTrail) {
      localStorage.setItem(localstorageKeys.majorTrail, newValue.toString());
    }
    if (newValue === false) {
      setTrailData(undefined);
    }
  };

  const initialCampsitesSetting = defaultCampsitesOn ? true : false;
  const [campsitesOn, setCampsitesOn] = useState<boolean>(initialCampsitesSetting);
  const toggleCampsites = () => {
    const newValue = !campsitesOn;
    setCampsitesOn(newValue);
    if (localstorageKeys && localstorageKeys.campsites) {
      localStorage.setItem(localstorageKeys.campsites, newValue.toString());
    }
    if (newValue === false) {
      setCampsiteData(undefined);
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
    if (newValue === true && usersLocation && usersLocation.requestAccurateLocation) {
      usersLocation.requestAccurateLocation();
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

  const [destination, setDestination] =
    useState<DestinationDatum | undefined>(undefined);
  const [directionsCache, setDirectionsCache] = useState<Array<DrivingData & {key: string}>>([]);
  const [directionsData, setDirectionsData] = useState<DrivingData | undefined>(undefined);

  useEffect(() => {
    if (usersLocation &&
        usersLocation.loading === false &&
        usersLocation.data !== undefined &&
        usersLocation.data.coordinates !== undefined &&
        destination !== undefined) {
      const cachedData = directionsCache.find(({key}) => key === destination.key);
      if (cachedData) {
        setDirectionsData(cachedData);
      } else {
        getDrivingDistances(
          usersLocation.data.coordinates.lat, usersLocation.data.coordinates.lng,
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

  const latLngDecimalPoints = 8;
  const [centerCoords, setCenterCoords] = useState<[string, string]>(
    [initialCenter[0].toFixed(latLngDecimalPoints), initialCenter[1].toFixed(latLngDecimalPoints)]);

  const prevCenterCoords = usePrevious(centerCoords);

  useEffect(() => {
    if (showNearbyTrails === true && majorTrailsOn &&
        (trailData === undefined ||
          (prevCenterCoords === undefined ||
            !(prevCenterCoords[0] === centerCoords[0] && prevCenterCoords[1] === centerCoords[1]))
          )
      ) {
      getTrailsData(parseFloat(centerCoords[0]), parseFloat(centerCoords[1]), setTrailData);
    }
  }, [setTrailData, showNearbyTrails, trailData, centerCoords, prevCenterCoords, majorTrailsOn]);

  useEffect(() => {
    if (showCampsites === true && campsitesOn &&
        (campsiteData === undefined ||
          (prevCenterCoords === undefined ||
            !(prevCenterCoords[0] === centerCoords[0] && prevCenterCoords[1] === centerCoords[1]))
          )
      ) {
      getCampsitesData(parseFloat(centerCoords[0]), parseFloat(centerCoords[1]), setCampsiteData);
    }
  }, [setCampsiteData, showCampsites, campsiteData, centerCoords, prevCenterCoords, campsitesOn]);

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

    const getPreciseCenterCoords = debounce(() => {
      if (map) {
        const {lat, lng}: {lat: number, lng: number} = map.getCenter();
        setCenterCoords([lat.toFixed(latLngDecimalPoints), lng.toFixed(latLngDecimalPoints)]);
      }
    }, 250);

    let prevVal = [0, 0];
    const getRoughCenterCoords = debounce(() => {
      if (map) {
        const {lat, lng}: {lat: number, lng: number} = map.getCenter();
        const latDiff = Math.abs(Math.abs(lat) - Math.abs(prevVal[0]));
        const lngDiff = Math.abs(Math.abs(lng) - Math.abs(prevVal[1]));
        if (latDiff > 0.4 || lngDiff > 0.4) {
          prevVal = [lat, lng];
          setCenterCoords([lat.toFixed(latLngDecimalPoints), lng.toFixed(latLngDecimalPoints)]);
        }
      }
    }, 400);
    if (map && showCenterCrosshairs) {
      map.on('dragend', getPreciseCenterCoords);
    }
    if (map && (showOtherMountains || showNearbyTrails)) {
      map.on('dragend', getRoughCenterCoords);
      map.on('zoomend', getRoughCenterCoords);
    }

    return () => {
      document.body.removeEventListener('keydown', enableZoom);
      document.body.removeEventListener('keyup', disableZoom);
      document.body.removeEventListener('touchstart', disableDragPanOnTouchDevics);
      if (map && showCenterCrosshairs) {
        map.off('dragend', getPreciseCenterCoords);
        // destroy the map on unmount
        map.remove();
      }
      if (map && (showOtherMountains || showNearbyTrails)) {
        map.off('dragend', getRoughCenterCoords);
        map.off('zoomend', getRoughCenterCoords);
        // destroy the map on unmount
        map.remove();
      }
    };
  }, [map, showCenterCrosshairs, fillSpace, showOtherMountains, showNearbyTrails]);

  useEffect(() => {
    if (!createOrEditMountain && !addRemoveMountains) {
      setTimeout(() => {
        const coords = getMinMax(coordinates);
        if (fitBounds === undefined || (
            coords.minLong !== fitBounds[0][0] || coords.minLat !== fitBounds[0][1] ||
            coords.maxLong !== fitBounds[1][0] || coords.maxLat !== fitBounds[1][1]
           )) {
          setFitBounds([[coords.minLong, coords.minLat], [coords.maxLong, coords.maxLat]]);
        }
      }, 0);
    }
  }, [coordinates, createOrEditMountain, peakListId, mountainId, fitBounds, addRemoveMountains]);

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

  const onFeatureClick = (popupType: PopupDataTypes.Coordinate | PopupDataTypes.OtherMountain) =>
    (point: CoordinateWithDates) => setPopupInfo({type: popupType, data: {...point}});

  const onAddMountainClick = () => {
    if (map) {
      const {lat, lng}: {lat: number, lng: number} = map.getCenter();
      history.push(Routes.CreateMountain + '?lat=' + lat + '&lng=' + lng);
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
        movingMethod={movingMethod ? movingMethod : 'flyTo'}
        key={`mapkey-${colorScaleHeight}-${mapReloadCount}`}
      >
        <ZoomControl />
        <RotationControl style={{ top: 80 }} />
        <DirectionsAndLocation
          destination={destination}
          directionsData={directionsData}
          yourLocationOn={yourLocationOn}
          showYourLocation={showYourLocation}
          togglePointer={togglePointer}
        />
        <TrailsLayer
          showNearbyTrails={showNearbyTrails}
          trailData={trailData}
          setPopupInfo={setPopupInfo}
          majorTrailsOn={majorTrailsOn}
          togglePointer={togglePointer}
        />
        <CampsitesLayer
          showCampsites={showCampsites}
          campsiteData={campsiteData}
          setPopupInfo={setPopupInfo}
          campsitesOn={campsitesOn}
          togglePointer={togglePointer}
        />
        <NearbyMountains
          latitude={parseFloat(centerCoords[0])}
          longitude={parseFloat(centerCoords[1])}
          mountainsToIgnore={coordinates.map(mtn => mtn.id)}
          onFeatureClick={onFeatureClick(PopupDataTypes.OtherMountain)}
          togglePointer={togglePointer}
          showOtherMountains={showOtherMountains}
          otherMountainsOn={otherMountainsOn}
        />
        <PrimaryMountains
          coordinates={coordinates}
          onFeatureClick={onFeatureClick(PopupDataTypes.Coordinate)}
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
          addRemoveMountains={addRemoveMountains}
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
        yourLocationOn={yourLocationOn}
        toggleYourLocation={toggleYourLocation}
        showOtherMountains={showOtherMountains}
        otherMountainsOn={otherMountainsOn}
        toggleOtherMountains={toggleOtherMountains}
        showCampsites={showCampsites}
        campsitesOn={campsitesOn}
        toggleCampsites={toggleCampsites}
        userId={userId}
        onAddMountainClick={onAddMountainClick}
        primaryMountainLegendCopy={primaryMountainLegendCopy}
        customContentBottom={customScaleContentBottom}
        ref={colorScaleRef}
      />
    </Root>
  );

};

export default Map;
