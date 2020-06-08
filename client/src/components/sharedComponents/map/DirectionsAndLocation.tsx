import React from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import {DrivingData} from '../../../utilities/getDrivingDistances';
import {
  DestinationDatum,
  IUserLocation,
} from './types';

interface Props {
  usersLocation: IUserLocation;
  destination: DestinationDatum | undefined;
  directionsData: DrivingData | undefined;
  yourLocationOn: boolean;
  showYourLocation: boolean | undefined;
  togglePointer: (mapEl: any, cursor: string) => void;
}

const DirectionsAndLocation = (props: Props) => {
  const {
    usersLocation, directionsData, yourLocationOn, showYourLocation, destination,
    togglePointer,
  } = props;

  const yourLocationLayer = showYourLocation && yourLocationOn && usersLocation.coordinates !== undefined ? (
    <Layer
      type='symbol'
      id='your-location'
      layout={{
        'icon-image': 'your-location',
        'icon-size': 1,
        'icon-allow-overlap': true,
      }}
    >
      <Feature
        coordinates={[usersLocation.coordinates.longitude, usersLocation.coordinates.latitude]}
        onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
        onMouseLeave={(event: any) => togglePointer(event.map, '')}
      />
    </Layer>
  ) : <></>;

  const directionsLayer = showYourLocation && yourLocationOn && directionsData !== undefined ? (
    <Layer
       type='line'
       id='directions-layer'
       layout={{ 'line-cap': 'round', 'line-join': 'round' }}
       paint={{ 'line-color': '#206ca6', 'line-width': 4 }}>
       <Feature coordinates={directionsData.coordinates}/>
    </Layer>
  ) : <></>;

  const directionsExtensionLayer =
    showYourLocation && yourLocationOn && directionsData !== undefined && destination !== undefined ? (
    <Layer
       type='line'
       id='directions-layer-extension'
       layout={{ 'line-cap': 'round', 'line-join': 'round' }}
       paint={{ 'line-color': '#206ca6', 'line-width': 4, 'line-dasharray': [0.1, 1.8] }}>
       <Feature coordinates={[
         directionsData.coordinates[directionsData.coordinates.length - 1],
         [destination.longitude, destination.latitude],
       ]}/>
    </Layer>
  ) : <></>;

  return (
    <>
      {yourLocationLayer}
      {directionsLayer}
      {directionsExtensionLayer}
    </>
  );
};

export default DirectionsAndLocation;
