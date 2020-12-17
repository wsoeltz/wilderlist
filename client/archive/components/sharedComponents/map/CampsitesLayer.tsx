import React, {useEffect, useState} from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import useCampsites from '../../../hooks/useCampsiteData';
import {getDistanceFromLatLonInMiles} from '../../../Utils';
import {
  PopupData,
  PopupDataTypes,
} from './types';

interface Props {
  showCampsites: boolean | undefined;
  centerCoords: [string, string];
  setPopupInfo: (value: PopupData | null) => void;
  campsitesOn: boolean;
  togglePointer: (mapEl: any, cursor: string) => void;
}

const CampsiteLayer = (props: Props) => {
  const {
    showCampsites, setPopupInfo, centerCoords,
    campsitesOn, togglePointer,
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
    if (distance > 50) {
      setCoords({latitude: parseFloat(centerCoords[0]), longitude: parseFloat(centerCoords[1])});
    }
  }, [centerCoords, coords]);

  const campsiteData = useCampsites({
    lat: coords.latitude,
    lon: coords.longitude,
    active: showCampsites === true && campsitesOn,
  });
  const campsites: Array<React.ReactElement<any>> = [];

  if (showCampsites && campsiteData !== undefined && campsiteData.campsites && campsitesOn) {
    campsiteData.campsites.forEach(point => {
      const onClick = () => {
        setPopupInfo({type: PopupDataTypes.Campsite, data: {...point}});
      };
      campsites.push(
        <Feature
          coordinates={[point.longitude, point.latitude]}
          onClick={onClick}
          onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
          onMouseLeave={(event: any) => togglePointer(event.map, '')}
          properties={{
            'icon-image': 'tent-default',
          }}
          key={point.id + point.latitude + point.longitude}
        />,
      );
    });
  }

  const campsiteLayer = campsites && campsites.length ? (
    <Layer
      type='symbol'
      id='nearby-campsites'
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
      {campsites}
    </Layer>
  ) : <></>;

  return campsiteLayer;
};

export default CampsiteLayer;