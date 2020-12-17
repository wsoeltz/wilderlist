import {
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { GetString } from 'fluent-react/compat';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import mapboxgl from 'mapbox-gl';
import React, {
  useCallback,
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
import getDrivingDistances, {DrivingData} from '../../../utilities/getDrivingDistances';
import {AppContext} from '../../App';
import CampsitesLayer from './CampsitesLayer';
import DirectionsAndLocation from './DirectionsAndLocation';
import ErrorBoundary from './ErrorBoundary';
import MapLegend from './MapLegend';
import MapPopup from './MapPopup';
import NearbyMountains from './NearbyMountains';
import PrimaryMountains from './PrimaryMountains';
import TrailsLayer from './TrailsLayer';
import {
  Coordinate,
  CoordinateWithDates,
  DestinationDatum,
  PopupData,
  PopupDataTypes,
} from './types';

export const MapContainer = styled.div`
  margin: 2rem 0;
`;

const Root = styled.div`
  border: 1px solid ${lightBorderColor};
  display: grid;
  grid-template-rows: 1fr auto;

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
  highlighted?: CoordinateWithDates[];
  isOtherUser?: boolean;
  otherUserId?: string;
  createOrEditMountain?: boolean;
  showCenterCrosshairs?: boolean;
  returnLatLongOnClick?: (lat: number | string, lng: number | string) => void;
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
  centerCoordsCallback?: (coords: {latitude: number, longitude: number}) => void;
  toggleVisibility?: boolean | null | string | number;
  useGenericFunctionality?: boolean;
}

const Map = (props: Props) => {
  const {
    mountainId, peakListId, coordinates, highlighted,
    userId, isOtherUser, otherUserId, createOrEditMountain,
    showCenterCrosshairs, returnLatLongOnClick,
    colorScaleColors, fillSpace,
    showNearbyTrails, colorScaleSymbols,
    showYourLocation, defaultMajorTrailsOn,
    localstorageKeys, defaultLocationOn, showOtherMountains,
    defaultOtherMountainsOn, completedAscents,
    defaultCampsitesOn, showCampsites, movingMethod,
    addRemoveMountains, primaryMountainLegendCopy, customScaleContentBottom,
    centerCoordsCallback, toggleVisibility, useGenericFunctionality,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {usersLocation} = useContext(AppContext);

  const Mapbox = useContext(MapboxContext);

  const history = useHistory();

  const { minLat, maxLat, minLong, maxLong } = getMinMax(coordinates);

  let initialCenter: [number, number];
  if (highlighted && highlighted.length === 1) {
    initialCenter = [highlighted[0].longitude, highlighted[0].latitude];
  } else if (coordinates.length) {
    initialCenter = [(maxLong + minLong) / 2, (maxLat + minLat) / 2];
  } else if (usersLocation && usersLocation.data && usersLocation.data.localCoordinates) {
    const {lat, lng} = usersLocation.data.localCoordinates;
    initialCenter = [lng, lat];
  } else {
    initialCenter = [-71.52769471, 43.20415146];
  }
  const initialBounds: [[number, number], [number, number]] = coordinates.length
    ? [[minLong, minLat], [maxLong, maxLat]]
    : [[initialCenter[0] + 1, initialCenter[1] - 1], [initialCenter[0] - 1, initialCenter[1] + 1]];
  const [mapReloadCount, setMapReloadCount] = useState<number>(0);
  const incReload = () => setMapReloadCount(mapReloadCount + 1);
  const [popupInfo, setPopupInfo] = useState<PopupData | null>(null);
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [fitBounds, setFitBounds] =
    useState<[[number, number], [number, number]] | undefined>(initialBounds);
  const [map, setMap] = useState<any>(null);

  const [mapLegendHeight, setMapLegendHeight] = useState<number>(0);

  const initialMajorTrailsSetting = defaultMajorTrailsOn ? true : false;
  const [majorTrailsOn, setMajorTrailsOn] = useState<boolean>(initialMajorTrailsSetting);
  const toggleMajorTrails = () => {
    const newValue = !majorTrailsOn;
    setMajorTrailsOn(newValue);
    if (localstorageKeys && localstorageKeys.majorTrail) {
      localStorage.setItem(localstorageKeys.majorTrail, newValue.toString());
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
  };

  const initiaYourLocationSetting = defaultLocationOn ? true : false;
  const [yourLocationOn, setYourLocationOn] = useState<boolean>(initiaYourLocationSetting);
  const updateYourLocationOn = (newValue: boolean) => {
    setYourLocationOn(newValue);
    if (localstorageKeys && localstorageKeys.yourLocation) {
      localStorage.setItem(localstorageKeys.yourLocation, newValue.toString());
    }
    if (newValue === true &&
        usersLocation &&
        usersLocation.data &&
        !usersLocation.data.preciseCoordinates &&
        usersLocation.requestAccurateLocation
      ) {
      usersLocation.requestAccurateLocation();
    }
  };
  const toggleYourLocation = () => {
    updateYourLocationOn(!yourLocationOn);
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

  const [hasGeoCoder, setHasGeoCoder] = useState<boolean>(false);

  useEffect(() => {
    if (usersLocation &&
        usersLocation.loading === false &&
        usersLocation.data !== undefined &&
        usersLocation.data.preciseCoordinates !== undefined &&
        destination !== undefined) {
      const cachedData = directionsCache.find(({key}) => key === destination.key);
      if (cachedData) {
        setDirectionsData(cachedData);
      } else {
        getDrivingDistances(
          usersLocation.data.preciseCoordinates.lat, usersLocation.data.preciseCoordinates.lng,
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

  const mapLegendRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (mapLegendRef && mapLegendRef.current) {
      setMapLegendHeight(mapLegendRef.current.offsetHeight);
    }
  }, [mapLegendRef, setMapLegendHeight]);

  const [currentZoom, setCurrentZoom] = useState<number | undefined>(undefined);

  const latLngDecimalPoints = 8;
  const [centerCoords, setCenterCoords] = useState<[string, string]>(
    [initialCenter[1].toFixed(latLngDecimalPoints), initialCenter[0].toFixed(latLngDecimalPoints)]);
  const updateCenterCoords = useCallback((coords: [string, string]) => {
      setCenterCoords([coords[0], coords[1]]);
      if (centerCoordsCallback !== undefined) {
        centerCoordsCallback({latitude: parseFloat(coords[0]), longitude: parseFloat(coords[1])});
      }
    },
    [centerCoordsCallback],
  );

  useEffect(() => {
    const enableZoom = (e: KeyboardEvent) => {
      if (e.shiftKey && map) {
        map.scrollZoom.enable();
      }
    };
    const disableZoom = () => {
      if (map && fillSpace !== true) {
        map.scrollZoom.disable();
      }
    };
    const disableDragPanOnTouchDevics = () => {
      if (map && fillSpace !== true) {
        map.dragPan.disable();
      }
    };

    if (map && fillSpace === true) {
      map.scrollZoom.enable();
    }

    document.body.addEventListener('keydown', enableZoom);
    document.body.addEventListener('keyup', disableZoom);
    document.body.addEventListener('touchstart', disableDragPanOnTouchDevics);

    const getPreciseCenterCoords = debounce(() => {
      if (map) {
        const {lat, lng}: {lat: number, lng: number} = map.getCenter();
        updateCenterCoords([lat.toFixed(latLngDecimalPoints), lng.toFixed(latLngDecimalPoints)]);
        const zoom = map.getZoom();
        setCurrentZoom(zoom);
      }
    }, 800);

    if (map && (showOtherMountains || showNearbyTrails || showCenterCrosshairs)) {
      map.on('dragend', getPreciseCenterCoords);
      map.on('zoomend', getPreciseCenterCoords);
    }

    return () => {
      document.body.removeEventListener('keydown', enableZoom);
      document.body.removeEventListener('keyup', disableZoom);
      document.body.removeEventListener('touchstart', disableDragPanOnTouchDevics);
      if (map && (showOtherMountains || showNearbyTrails || showCenterCrosshairs)) {
        map.off('dragend', getPreciseCenterCoords);
        map.off('zoomend', getPreciseCenterCoords);
        // destroy the map on unmount
        map.remove();
      }
    };
  }, [map, showCenterCrosshairs, showOtherMountains, showNearbyTrails, updateCenterCoords, fillSpace]);

  useEffect(() => {
    if (map) {
      map.resize();
    }
  }, [map, toggleVisibility]);

  useEffect(() => {
    if (map && !hasGeoCoder) {
      map.addControl(
        new MapboxGeocoder({
          accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
          mapboxgl,
          placeholder: 'Find a location',
          countries: 'us',
          marker: false,
          flyTo: {
            bearing: 1,
            // These options control the flight curve, making it move
            // slowly and zoom out almost completely before starting
            // to pan.
            speed: 4, // make the flying slow
            curve: 1, // change the speed at which it zooms out
            // This can be any easing function: it takes a number between
            // 0 and 1 and returns another number between 0 and 1.
            easing(t: any) {
              return t;
            },
          },
        }),
        'top-left',
      );
      setHasGeoCoder(true);
    }
  }, [map, hasGeoCoder, useGenericFunctionality]);

  const previousUserLocation = usePrevious(usersLocation);
  useEffect(() => {
    if (!createOrEditMountain && !addRemoveMountains) {
      setTimeout(() => {
        const coords = getMinMax(coordinates);
        if (coordinates.length) {
          if (fitBounds === undefined || (
              coords.minLong !== fitBounds[0][0] || coords.minLat !== fitBounds[0][1] ||
              coords.maxLong !== fitBounds[1][0] || coords.maxLat !== fitBounds[1][1]
             )) {
            setFitBounds([[coords.minLong, coords.minLat], [coords.maxLong, coords.maxLat]]);
          }
        } else if (previousUserLocation !== undefined && usersLocation !== undefined) {
          if (usersLocation.data !== undefined && usersLocation.data.localCoordinates && (
               previousUserLocation.data === undefined ||
               (previousUserLocation.data.text !== usersLocation.data.text)
             )) {
            const {lat, lng}: {lat: number, lng: number} = usersLocation.data.localCoordinates;
            setFitBounds([
              [lng - 0.05, lat + 0.05],
              [lng + 0.05, lat - 0.05],
            ]);
            updateCenterCoords([lat.toFixed(latLngDecimalPoints), lng.toFixed(latLngDecimalPoints)]);
          }
        }
      }, 0);
    }
  }, [coordinates, createOrEditMountain, peakListId, mountainId,
      fitBounds, addRemoveMountains, usersLocation, previousUserLocation, updateCenterCoords]);

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

  const previousCoordinates = usePrevious(coordinates);

  useEffect(() => {
    if ((coordinates && coordinates.length) &&
        (!previousCoordinates || previousCoordinates.length !== coordinates.length)
      ) {
        const newCoords = getMinMax(coordinates);
        updateCenterCoords([
          ((newCoords.maxLat + newCoords.minLat) / 2).toFixed(2),
          ((newCoords.maxLong + newCoords.minLong) / 2).toFixed(2),
        ]);
    }
  }, [previousCoordinates, coordinates, updateCenterCoords]);

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
      <ErrorBoundary>
        <Mapbox
          // eslint-disable-next-line
          style={'mapbox://styles/wsoeltz/ck41nop7o0t7d1cqdtokuavwk'}
          containerStyle={{
            height: fillSpace === true ? `100%` : '500px',
            //height: fillSpace === true ? `calc(100% - ${mapLegendHeight}px)` : '500px',
            width: '100%',
          }}
          center={center}
          onClick={() => setPopupInfo(null)}
          fitBounds={fitBounds}
          fitBoundsOptions={{padding: 50, linear: true}}
          movingMethod={movingMethod ? movingMethod : 'flyTo'}
          key={`mapkey-${mapLegendHeight}-${mapReloadCount}`}
          onWebGlContextLost={incReload}
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
            centerCoords={centerCoords}
            setPopupInfo={setPopupInfo}
            majorTrailsOn={majorTrailsOn}
            togglePointer={togglePointer}
          />
          <CampsitesLayer
            showCampsites={showCampsites}
            centerCoords={centerCoords}
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
            useGenericFunctionality={useGenericFunctionality}
            currentZoom={currentZoom}
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
            setYourLocationOn={updateYourLocationOn}
            colorScaleColors={colorScaleColors}
            colorScaleSymbols={colorScaleSymbols}
            createOrEditMountain={createOrEditMountain}
            highlighted={highlighted}
            addRemoveMountains={addRemoveMountains}
            useGenericFunctionality={useGenericFunctionality}
          />
          {crosshairs}
          <ReloadMapContainer
            onClick={incReload}
          >
            <BasicIconInText icon={faSync} />
            {getFluentString('map-refresh-map')}
          </ReloadMapContainer>
          <MapContext.Consumer children={mapRenderProps} />
        </Mapbox>
      </ErrorBoundary>
      <div>
        <MapLegend
          centerCoords={centerCoords}
          showCenterCrosshairs={showCenterCrosshairs}
          returnLatLongOnClick={returnLatLongOnClick}
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
          useGenericFunctionality={useGenericFunctionality}
          ref={mapLegendRef}
        />
      </div>
    </Root>
  );

};

export default Map;