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
  Feature,
  Layer,
  MapContext,
  Popup,
  RotationControl,
  ZoomControl,
} from 'react-mapbox-gl';
import styled from 'styled-components';
import HikingProjectSvgLogo from '../../../assets/images/hiking-project-logo.svg';
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
  lightBorderColor,
  linkStyles,
  placeholderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import getTrails, {TrailsDatum, TrailType} from '../../../utilities/getTrails';
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
import {legendColorScheme, legendSymbolScheme} from './colorScaleColors';

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
  text-align: center;
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

const PopupDates = styled.div`
  display: flex;
  justify-content: center;
`;

const Date = styled.div`
  margin: 0 0.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
`;

const GridNumbers = styled.div`
  letter-spacing: -1px;
`;

const AddAscentButton = styled.button`
  ${linkStyles}
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.6rem;
  background-color: transparent;
`;

const ExternalLink = styled.a`
  ${linkStyles}
`;

const HikingProjectLink = styled.a`
  width: 100px;
  display: flex;
  justify-content: center;
  margin: 0.6rem auto;

  img {
    width: 100%;
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
    localstorageKeys,
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

  const colorScaleRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (colorScaleRef && colorScaleRef.current) {
      setColorScaleHeight(colorScaleRef.current.offsetHeight);
    }
  }, [colorScaleRef, setColorScaleHeight]);

  useEffect(() => {
    if (showNearbyTrails === true && trailData === undefined) {
      const getTrailsData = async () => {
        try {
          const res = await getTrails({params: {lat: center[1], lon: center[0], maxDistance: 180}});
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
      getTrailsData();
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
    }
  }, [highlighted, setPopupInfo, setCenter, coordinates]);

  const togglePointer = (mapEl: any, cursor: string) => {
    mapEl.getCanvas().style.cursor = cursor;
  };

  const features = coordinates.map(point => {
    const { completionDates } = point;
    const onClick = () => {
      setPopupInfo({type: PopupDataTypes.Coordinate, data: {...point}});
      setCenter([point.longitude, point.latitude]);
    };
    let circleColor: string;
    let iconImage: string;
    if (colorScaleColors.length === 0) {
      circleColor = legendColorScheme.primary;
      iconImage = legendSymbolScheme.primary;
    } else if (completionDates === null || completionDates === undefined) {
      if (createOrEditMountain === true && highlighted && highlighted.length &&
        (point.latitude === highlighted[0].latitude && point.longitude === highlighted[0].longitude)) {
        circleColor = colorScaleColors[1];
        iconImage = colorScaleSymbols[1];
      } else {
        circleColor = colorScaleColors[0];
        iconImage = colorScaleSymbols[0];
      }
    } else if (completionDates.type === PeakListVariants.standard) {
      circleColor = completionDates.standard !== undefined ? colorScaleColors[1] : colorScaleColors[0];
      iconImage = completionDates.standard !== undefined ? colorScaleSymbols[1] : colorScaleSymbols[0];
    } else if (completionDates.type === PeakListVariants.winter) {
      circleColor = completionDates.winter !== undefined ? colorScaleColors[1] : colorScaleColors[0];
      iconImage = completionDates.winter !== undefined ? colorScaleSymbols[1] : colorScaleSymbols[0];
    } else if (completionDates.type === PeakListVariants.fourSeason) {
      let completionCount: number = 0;
      Object.keys(completionDates).forEach(function(season: keyof VariableDate) {
        if (season !== 'type' && completionDates[season] !== undefined) {
          completionCount += 1;
        }
      });
      circleColor = colorScaleColors[completionCount];
      iconImage = colorScaleSymbols[completionCount];
    } else if (completionDates.type === PeakListVariants.grid) {
      let completionCount: number = 0;
      Object.keys(completionDates).forEach(function(month: keyof VariableDate) {
        if (month !== 'type' && completionDates[month] !== undefined) {
          completionCount += 1;
        }
      });
      circleColor = colorScaleColors[completionCount];
      iconImage = colorScaleSymbols[completionCount];
    } else {
      circleColor = colorScaleColors[1];
      iconImage = colorScaleSymbols[1];
    }
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
          <PopupDates>
            {datesElm}
          </PopupDates>
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
          <PopupDates>
            {datesElm}
          </PopupDates>
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

  const getMountainPopupName = (mtnId: string, mtnName: string) => {
    return (
      <DynamicLink
        mobileURL={mountainDetailLink(mtnId)}
        desktopURL={getDesktopUrl(mtnId)}
      >
        <strong>{mtnName}</strong>
      </DynamicLink>
    );
  };

  const getAddAscentButton = (mtnId: string) => {
    return isOtherUser ? null : (
      <div>
        <AddAscentButton onClick={() => setEditMountainId(mtnId)}>
          {getFluentString('map-add-ascent')}
        </AddAscentButton>
      </div>
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

  let popup: React.ReactElement<any>;
  if (!popupInfo) {
    popup = <></>;
  } else if (popupInfo.type === PopupDataTypes.Coordinate) {
    const {data: popupData} = popupInfo;
    popup = (
      <Popup
        coordinates={[popupData.longitude, popupData.latitude]}
      >
        <StyledPopup>
          {getMountainPopupName(popupData.id, popupData.name)}
          <br />
          {popupData.elevation}ft
          {renderCompletionDates(popupData.completionDates)}
          {getAddAscentButton(popupData.id)}
          <ClosePopup onClick={() => setPopupInfo(null)}>×</ClosePopup>
        </StyledPopup>
      </Popup>
    );
  } else if (popupInfo.type === PopupDataTypes.Trail) {
    const {data: popupData} = popupInfo;
    popup = (
      <Popup
        coordinates={[popupData.longitude, popupData.latitude]}
      >
        <StyledPopup>
          <ExternalLink
            href={popupData.url}
            target='_blank'
          >
            {popupData.name}
          </ExternalLink>
          <br />
          {popupData.mileage} miles long
          <br />
          {popupData.elevation}ft of elevation gain
          <HikingProjectLink
            href={popupData.url}
            target='_blank'
          >
            <img src={HikingProjectSvgLogo} alt='The Hiking Project' />
          </HikingProjectLink>
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
        ref={colorScaleRef}
      />
      {editMountainModal}
    </Root>
  );

};

export default Map;
