import sortBy from 'lodash/sortBy';
import React, {
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
  warmRedColor,
  placeholderColor,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ? process.env.REACT_APP_MAPBOX_ACCESS_TOKEN : '';

const Mapbox = ReactMapboxGl({
  accessToken,
  maxZoom: 16,
  scrollZoom: false,
});

const Root = styled.div`
  margin: 2rem 0;
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
  latitude: number;
  longitude: number;
  name: string;
  elevation: number;
}

interface Props {
  id: string;
  coordinates: Coordinate[];
  highlighted?: Coordinate[];
}

const Map = (props: Props) => {
  const { coordinates, highlighted } = props;

  const { minLat, maxLat, minLong, maxLong } = getMinMax(coordinates);

  let initialCenter: [number, number];
  if (highlighted && highlighted.length === 1) {
    initialCenter = [highlighted[0].longitude, highlighted[0].latitude];
  } else if (coordinates.length) {
    initialCenter = [(maxLong + minLong) / 2, (maxLat + minLat) / 2];
  } else {
    initialCenter = [-73.5346381, 43.216461];
  }

  const [popupInfo, setPopupInfo] = useState<Coordinate | null>(null);
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
    }
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
    const onClick = () => {
      setPopupInfo({...point});
      setCenter([point.longitude, point.latitude]);
    };
    return (
      <Feature
        coordinates={[point.longitude, point.latitude]}
        onClick={onClick}
        onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
        onMouseLeave={(event: any) => togglePointer(event.map, '')}
        key={'' + point.latitude + point.longitude}
      />
    );
  });

  const popup = !popupInfo ? <></> : (
    <Popup
      coordinates={[popupInfo.longitude, popupInfo.latitude]}
    >
      <StyledPopup>
        <strong>{popupInfo.name}</strong>
        <br />
        {popupInfo.elevation}ft
        <ClosePopup onClick={() => setPopupInfo(null)}>×</ClosePopup>
      </StyledPopup>
    </Popup>
  );

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
        <Layer type='circle' id='marker' paint={{ 'circle-color': warmRedColor, 'circle-radius': 5 }}>
          {features}
        </Layer>
        {popup}
        <MapContext.Consumer children={mapRenderProps} />
      </Mapbox>
    </Root>
  );

};

export default Map;
