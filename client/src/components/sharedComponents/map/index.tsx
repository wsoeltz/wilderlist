import { GetString } from 'fluent-react';
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
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { listDetailWithMountainDetailLink, mountainDetailLink } from '../../../routing/Utils';
import {
  lightBorderColor,
  linkStyles,
  placeholderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { Mountain, PeakListVariants } from '../../../types/graphQLTypes';
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
import {legendColorScheme} from './colorScaleColors';

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ? process.env.REACT_APP_MAPBOX_ACCESS_TOKEN : '';

const Mapbox = ReactMapboxGl({
  accessToken,
  maxZoom: 16,
  scrollZoom: false,
});

const Root = styled.div`
  margin: 2rem 0;
  border: 1px solid ${lightBorderColor};
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

// const ColorScaleContainer = styled.div`
//   width: 100%;
// `;

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

export type CoordinateWithDates = Coordinate & {completionDates?: VariableDate | null};

interface Props {
  id: string;
  userId: string | null;
  coordinates: CoordinateWithDates[];
  highlighted?: CoordinateWithDates[];
  isOtherUser?: boolean;
  createOrEditMountain?: boolean;
  showCenterCrosshairs?: boolean;
  returnLatLongOnClick?: (lat: number | string, lng: number | string) => void;
  colorScaleColors: string[];
  colorScaleLabels: string[];
  fillSpace?: boolean;
}

const Map = (props: Props) => {
  const {
    id, coordinates, highlighted,
    userId, isOtherUser, createOrEditMountain,
    showCenterCrosshairs, returnLatLongOnClick,
    colorScaleColors, colorScaleLabels, fillSpace,
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

  const [popupInfo, setPopupInfo] = useState<CoordinateWithDates | null>(null);
  const [editMountainId, setEditMountainId] = useState<Mountain['id'] | null>(null);
  const closeEditMountainModalModal = () => {
    setEditMountainId(null);
  };
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [fitBounds, setFitBounds] =
    useState<[[number, number], [number, number]] | undefined>([[minLong, minLat], [maxLong, maxLat]]);
  const [map, setMap] = useState<any>(null);

  const [colorScaleHeight, setColorScaleHeight] = useState<number>(0);

  const colorScaleRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (colorScaleRef && colorScaleRef.current) {
      setColorScaleHeight(colorScaleRef.current.offsetHeight);
    }
  }, [colorScaleRef, setColorScaleHeight]);

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
      setPopupInfo({...highlighted[0]});
      setCenter([highlighted[0].longitude, highlighted[0].latitude]);
    } else if (coordinates.length === 1) {
      setPopupInfo({...coordinates[0]});
      setCenter([coordinates[0].longitude, coordinates[0].latitude]);
    }
  }, [highlighted, setPopupInfo, setCenter, coordinates]);

  const togglePointer = (mapEl: any, cursor: string) => {
    mapEl.getCanvas().style.cursor = cursor;
  };

  const features = coordinates.map(point => {
    const { completionDates } = point;
    const onClick = () => {
      setPopupInfo({...point});
      setCenter([point.longitude, point.latitude]);
    };
    let circleColor: string;
    if (colorScaleColors.length === 0) {
      circleColor = legendColorScheme.primary;
    } else if (completionDates === null || completionDates === undefined) {
      if (createOrEditMountain === true && highlighted && highlighted.length &&
        (point.latitude === highlighted[0].latitude && point.longitude === highlighted[0].longitude)) {
        circleColor = colorScaleColors[1];
      } else {
        circleColor = colorScaleColors[0];
      }
    } else if (completionDates.type === PeakListVariants.standard) {
      circleColor = completionDates.standard !== undefined ? colorScaleColors[1] : colorScaleColors[0];
    } else if (completionDates.type === PeakListVariants.winter) {
      circleColor = completionDates.winter !== undefined ? colorScaleColors[1] : colorScaleColors[0];
    } else if (completionDates.type === PeakListVariants.fourSeason) {
      let completionCount: number = 0;
      Object.keys(completionDates).forEach(function(season: keyof VariableDate) {
        if (season !== 'type' && completionDates[season] !== undefined) {
          completionCount += 1;
        }
      });
      circleColor = colorScaleColors[completionCount];
    } else if (completionDates.type === PeakListVariants.grid) {
      let completionCount: number = 0;
      Object.keys(completionDates).forEach(function(month: keyof VariableDate) {
        if (month !== 'type' && completionDates[month] !== undefined) {
          completionCount += 1;
        }
      });
      circleColor = colorScaleColors[completionCount];
    } else {
      circleColor = colorScaleColors[1];
    }
    return (
      <Feature
        coordinates={[point.longitude, point.latitude]}
        onClick={onClick}
        onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
        onMouseLeave={(event: any) => togglePointer(event.map, '')}
        properties={{
          'circle-color': circleColor,
        }}
        key={'' + point.latitude + point.longitude}
      />
    );
  });

  const renderCompletionDates = (dates: VariableDate | null | undefined) => {
    if (dates) {
      if (dates.type === PeakListVariants.standard) {
        if (dates.standard !== undefined) {
          return (
            <Date>
              <strong>{getFluentString('map-completed')}: </strong>
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
            'mountain-name': popupInfo.name,
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
          mountainName={popupInfo.name}
          variant={PeakListVariants.standard}
        />
      );
    }
  }

  const getDesktopUrl = (mountainId: Mountain['id']) => {
    if (id === mountainId) {
      return mountainDetailLink(mountainId);
    } else {
      return listDetailWithMountainDetailLink(id, mountainId);
    }
  };

  const getMountainPopupName = (mtnId: string, mtnName: string) => {
    return isOtherUser ? <strong>{mtnName}</strong> : (
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

  const popup = !popupInfo ? <></> : (
    <Popup
      coordinates={[popupInfo.longitude, popupInfo.latitude]}
      style={{opacity: 0.85}}
    >
      <StyledPopup>
        {getMountainPopupName(popupInfo.id, popupInfo.name)}
        <br />
        {popupInfo.elevation}ft
        {renderCompletionDates(popupInfo.completionDates)}
        {getAddAscentButton(popupInfo.id)}
        <ClosePopup onClick={() => setPopupInfo(null)}>×</ClosePopup>
      </StyledPopup>
    </Popup>
  );

  const mapRenderProps = (mapEl: any) => {
    setMap(mapEl);
    return null;
  };

  const crosshairs = showCenterCrosshairs === true ? <Crosshair /> : <React.Fragment />;

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
        key={`mapkey-${colorScaleHeight}`}
      >
        <ZoomControl />
        <RotationControl style={{ top: 80 }} />
        <Layer
          type='circle'
          id='marker'
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
        {popup}
        {crosshairs}
        <MapContext.Consumer children={mapRenderProps} />
      </Mapbox>
      <ColorScale
        centerCoords={centerCoords}
        showCenterCrosshairs={showCenterCrosshairs}
        returnLatLongOnClick={returnLatLongOnClick}
        colorScaleColors={colorScaleColors}
        colorScaleLabels={colorScaleLabels}
        ref={colorScaleRef}
      />
      {editMountainModal}
    </Root>
  );

};

export default Map;
