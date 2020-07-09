import React, {useEffect, useState} from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import useTrails from '../../../hooks/useTrailData';
import {
  TrailType,
} from '../../../utilities/getTrails';
import {getDistanceFromLatLonInMiles} from '../../../Utils';
import {
  PopupData,
  PopupDataTypes,
} from './types';

interface Props {
  showNearbyTrails: boolean | undefined;
  centerCoords: [string, string];
  setPopupInfo: (value: PopupData | null) => void;
  majorTrailsOn: boolean;
  togglePointer: (mapEl: any, cursor: string) => void;
}

const TrailsLayer = (props: Props) => {
  const {
    showNearbyTrails, setPopupInfo, centerCoords,
    majorTrailsOn, togglePointer,
  } = props;

  const [coords, setCoords] = useState<{latitude: number, longitude: number}>({
    latitude: parseFloat(centerCoords[0]), longitude: parseFloat(centerCoords[1]),
  });

  useEffect(() => {
    const distance = getDistanceFromLatLonInMiles({
      lat1: coords.latitude,
      lon1: coords.longitude,
      lat2: parseFloat(centerCoords[0]),
      lon2: parseFloat(centerCoords[1]),
    });
    if (distance > 80) {
      setCoords({latitude: parseFloat(centerCoords[0]), longitude: parseFloat(centerCoords[1])});
    }
  }, [centerCoords, coords]);

  const trailData = useTrails({
    lat: coords.latitude,
    lon: coords.longitude,
    active: showNearbyTrails === true && majorTrailsOn,
  });

  const trails: Array<React.ReactElement<any>> = [];

  if (showNearbyTrails && trailData !== undefined && trailData.trails) {
    trailData.trails.forEach(point => {
      const onClick = () => {
        setPopupInfo({type: PopupDataTypes.Trail, data: {...point}});
      };
      if (point.type !== TrailType.Connector && majorTrailsOn) {
        const iconImage = 'trail-default';
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

  return trailLayer;
};

export default TrailsLayer;
