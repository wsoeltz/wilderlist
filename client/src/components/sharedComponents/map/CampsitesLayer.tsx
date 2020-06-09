import React from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import getCampsites, {
  Campsite,
} from '../../../utilities/getCampsites';
import {
  PopupData,
  PopupDataTypes,
} from './types';

export const getCampsitesData = async (lat: number, lng: number, setCampsiteData: (input: Campsite[]) => void) => {
  try {
    const res = await getCampsites({params: {lat, lng, maxDistance: 25}});
    if (res && res.data) {
      const data: Campsite[] = res.data;
      setCampsiteData([...data]);
    } else {
      console.error('There was an error getting the location response');
    }
  } catch (err) {
    console.error(err);
  }
};

interface Props {
  showCampsites: boolean | undefined;
  campsiteData: Campsite[] | undefined;
  setPopupInfo: (value: PopupData | null) => void;
  campsitesOn: boolean;
  togglePointer: (mapEl: any, cursor: string) => void;
}

const CampsiteLayer = (props: Props) => {
  const {
    showCampsites, campsiteData, setPopupInfo,
    campsitesOn, togglePointer,
  } = props;

  const campsites: Array<React.ReactElement<any>> = [];

  if (showCampsites && campsiteData !== undefined && campsitesOn) {
    campsiteData.forEach(point => {
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
