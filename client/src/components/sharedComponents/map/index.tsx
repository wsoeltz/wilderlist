import { GetString } from 'fluent-react';
import sortBy from 'lodash/sortBy';
import React, {
  useContext,
  useEffect,
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
import { listDetailWithMountainDetailLink, mountainDetailLink } from '../../../routing/Utils';
import {
  lightBorderColor,
  linkStyles,
  placeholderColor,
  semiBoldFontBoldWeight,
  tertiaryColor,
} from '../../../styling/styleUtils';
import { Mountain, PeakListVariants } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import {
  VariableDate,
} from '../../peakLists/detail/getCompletionDates';
import MountainCompletionModal from '../../peakLists/detail/MountainCompletionModal';
import {
  formatDate,
  formatGridDate,
} from '../../peakLists/Utils';
import DynamicLink from '../DynamicLink';
import SignUpModal from '../SignUpModal';

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

const ColorScaleLegend = styled.div`
  padding: 0.6rem 0;
  border-top: 1px solid ${lightBorderColor};
  background-color: ${tertiaryColor};
  display: flex;
  justify-content: center;
`;
const LegendItem = styled.div`
  margin: 0 0.3rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Circle = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 4000px;
  margin-bottom: 0.2rem;
`;

const startColor = '#dc4900';
const endColor = '#145500';

const twoColorScale: [string, string] = [
  startColor,
  endColor,
];
const fiveColorScale: [string, string, string, string, string] = [
  startColor,
  '#cb9e00',
  '#99b900',
  '#4a8900',
  endColor,
];
const thirteenColorScale:
  [string, string, string, string, string, string, string, string, string, string, string, string, string] = [
  startColor,
  '#d37700',
  '#ce9200',
  '#cb9e00',
  '#c8aa00',
  '#c5b500',
  '#b5bf00',
  '#99b900',
  '#8ab100',
  '#7ca900',
  '#629900',
  '#4a8900',
  endColor,
];

const GridLegendLabel = styled(LegendItem)`
  white-space: nowrap;
  width: 15px;
`;

const GridLabelStart = styled(GridLegendLabel)`
  align-items: flex-start;
  color: ${startColor};
`;
const GridLabelEnd = styled(GridLegendLabel)`
  align-items: flex-end;
  color: ${endColor};
`;

const SeasonLabelStart = styled(LegendItem)`
  color: ${startColor};
  justify-content: center;
`;
const SeasonLabelEnd = styled(LegendItem)`
  color: ${endColor};
  justify-content: center;
`;
const AddAscentButton = styled.button`
  ${linkStyles}
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.6rem;
`;

const getMinMax = (coordinates: Coordinate[]) => {
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

type CoordinateWithDates = Coordinate & {completionDates: VariableDate | null};

interface Props {
  id: string;
  userId: string | null;
  coordinates: CoordinateWithDates[];
  highlighted?: CoordinateWithDates[];
  peakListType: PeakListVariants;
  isOtherUser?: boolean;
}

const Map = (props: Props) => {
  const { id, coordinates, highlighted, peakListType, userId, isOtherUser } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const { minLat, maxLat, minLong, maxLong } = getMinMax(coordinates);

  let initialCenter: [number, number];
  if (highlighted && highlighted.length === 1) {
    initialCenter = [highlighted[0].longitude, highlighted[0].latitude];
  } else if (coordinates.length) {
    initialCenter = [(maxLong + minLong) / 2, (maxLat + minLat) / 2];
  } else {
    initialCenter = [-73.5346381, 43.216461];
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
    document.body.addEventListener('keydown', enableZoom);
    document.body.addEventListener('keyup', disableZoom);
    document.body.addEventListener('touchstart', disableDragPanOnTouchDevics);

    return () => {
      document.body.removeEventListener('keydown', enableZoom);
      document.body.removeEventListener('keyup', disableZoom);
      document.body.removeEventListener('touchstart', disableDragPanOnTouchDevics);
    };
  }, [map]);

  useEffect(() => {
    const coords = getMinMax(coordinates);
    setFitBounds([[coords.minLong, coords.minLat], [coords.maxLong, coords.maxLat]]);
  }, [coordinates]);

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
    if (completionDates === null) {
      circleColor = twoColorScale[0];
    } else if (completionDates.type === PeakListVariants.standard) {
      circleColor = completionDates.standard !== undefined ? twoColorScale[1] : twoColorScale[0];
    } else if (completionDates.type === PeakListVariants.winter) {
      circleColor = completionDates.winter !== undefined ? twoColorScale[1] : twoColorScale[0];
    } else if (completionDates.type === PeakListVariants.fourSeason) {
      let completionCount: number = 0;
      Object.keys(completionDates).forEach(function(season: keyof VariableDate) {
        if (season !== 'type' && completionDates[season] !== undefined) {
          completionCount += 1;
        }
      });
      circleColor = fiveColorScale[completionCount];
    } else if (completionDates.type === PeakListVariants.grid) {
      let completionCount: number = 0;
      Object.keys(completionDates).forEach(function(month: keyof VariableDate) {
        if (month !== 'type' && completionDates[month] !== undefined) {
          completionCount += 1;
        }
      });
      circleColor = thirteenColorScale[completionCount];
    } else {
      circleColor = twoColorScale[1];
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

  const renderCompletionDates = (dates: VariableDate | null) => {
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
        <MountainCompletionModal
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
    )
  }

  const getAddAscentButton = (mtnId: string) => {
    return isOtherUser ? null : (
      <div>
        <AddAscentButton onClick={() => setEditMountainId(mtnId)}>
          {getFluentString('map-add-ascent')}
        </AddAscentButton>
      </div>
    );
  }

  const popup = !popupInfo ? <></> : (
    <Popup
      coordinates={[popupInfo.longitude, popupInfo.latitude]}
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

  let colorScaleLegend: React.ReactElement<any> | null;
  if (peakListType === PeakListVariants.standard || peakListType === PeakListVariants.winter) {
    colorScaleLegend = (
      <ColorScaleLegend>
        <LegendItem>
          <Circle style={{backgroundColor: twoColorScale[0]}} />
          {getFluentString('global-text-value-not-done')}
        </LegendItem>
        <LegendItem>
          <Circle style={{backgroundColor: twoColorScale[1]}} />
          {getFluentString('global-text-value-done')}
        </LegendItem>
      </ColorScaleLegend>
    );
  } else if (peakListType === PeakListVariants.fourSeason) {
    const seasonCircles = fiveColorScale.map((c) => {
      return (
        <LegendItem key={c}>
          <Circle style={{backgroundColor: c}} />
        </LegendItem>
      );
    });
    colorScaleLegend = (
      <ColorScaleLegend>
        <SeasonLabelStart>
          {getFluentString('map-no-seasons')}
        </SeasonLabelStart>
        {seasonCircles}
        <SeasonLabelEnd>
          {getFluentString('map-all-seasons')}
        </SeasonLabelEnd>
      </ColorScaleLegend>
    );
  } else if (peakListType === PeakListVariants.grid) {
    const monthCircles = thirteenColorScale.map((c, i) => {
      if (i === 0 || i === 12) {
        return null;
      } else {
        return (
          <LegendItem key={c}>
            <Circle style={{backgroundColor: c}} />
          </LegendItem>
        );
      }
    });
    colorScaleLegend = (
      <ColorScaleLegend>
        <GridLabelStart>
          <Circle style={{backgroundColor: thirteenColorScale[0]}} />
          {getFluentString('map-no-months')}
        </GridLabelStart>
        {monthCircles}
        <GridLabelEnd>
          <Circle style={{backgroundColor: thirteenColorScale[12]}} />
          {getFluentString('map-all-months')}
        </GridLabelEnd>
      </ColorScaleLegend>
    );
  } else {
    failIfValidOrNonExhaustive(peakListType, 'invalid value for ' + peakListType);
    colorScaleLegend = null;
  }

  const mapRenderProps = (mapEl: any) => {
    setMap(mapEl);
    return null;
  };

  return (
    <Root>
      <Mapbox
        // eslint-disable-next-line
        style={'mapbox://styles/wsoeltz/ck41nop7o0t7d1cqdtokuavwk'}
        containerStyle={{
          height: '500px',
          width: '100%',
        }}
        center={center}
        onClick={() => setPopupInfo(null)}
        fitBounds={fitBounds}
        fitBoundsOptions={{padding: 50, linear: true}}
        movingMethod={'flyTo'}
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
        <MapContext.Consumer children={mapRenderProps} />
      </Mapbox>
      {colorScaleLegend}
      {editMountainModal}
    </Root>
  );

};

export default Map;
