import React from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import {getImageAndIcon} from './colorScaleColors';
import {
  CoordinateWithDates,
  PopupDataTypes,
} from './types';

interface Props {
  coordinates: CoordinateWithDates[];
  onFeatureClick: (point: CoordinateWithDates) => void;
  colorScaleColors: string[];
  colorScaleSymbols: string[];
  createOrEditMountain?: boolean;
  highlighted?: CoordinateWithDates[];
  togglePointer: (mapEl: any, cursor: string) => void;
}

const PrimaryMountains = (props: Props) => {
  const {
    coordinates, onFeatureClick, colorScaleColors,
    createOrEditMountain, highlighted, colorScaleSymbols, togglePointer,
  } = props;

  const features = coordinates.map(point => {
    const onClick = () => onFeatureClick(point);
    const {circleColor, iconImage} = getImageAndIcon({
      colorScaleColors, point, createOrEditMountain,
      highlighted, colorScaleSymbols, popUpDataType: PopupDataTypes.Coordinate,
    });
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

  return (
    <>
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
    </>
  );
};

export default PrimaryMountains;
