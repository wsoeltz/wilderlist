import React from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import {
  TrailType,
} from '../../../utilities/getTrails';
import {
  PopupData,
  PopupDataTypes,
  Trail,
} from './types';

interface Props {
  showNearbyTrails: boolean | undefined;
  trailData: Trail[] | undefined;
  setPopupInfo: (value: PopupData | null) => void;
  majorTrailsOn: boolean;
  togglePointer: (mapEl: any, cursor: string) => void;
}

const TrailsLayer = (props: Props) => {
  const {
    showNearbyTrails, trailData, setPopupInfo,
    majorTrailsOn, togglePointer,
  } = props;

  const trails: Array<React.ReactElement<any>> = [];

  if (showNearbyTrails && trailData !== undefined) {
    trailData.forEach(point => {
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
