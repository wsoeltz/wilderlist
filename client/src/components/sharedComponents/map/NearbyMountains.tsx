import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import usePrevious from '../../../hooks/usePrevious';
import { Mountain } from '../../../types/graphQLTypes';
import {CoordinateWithDates} from './';
import {legendColorScheme, legendSymbolScheme} from './colorScaleColors';

const GET_NEARBY_MOUNTAINS = gql`
  query getNearbyMountains(
    $latitude: Float!, $longitude: Float!, $latDistance: Float!, $longDistance: Float!) {
  mountains: nearbyMountains(
    latitude: $latitude,
    longitude: $longitude,
    latDistance: $latDistance,
    longDistance: $longDistance,
  ) {
    id
    name
    latitude
    longitude
    elevation
  }
}
`;

interface SuccessResponse {
  mountains: null | Array<{
    id: Mountain['id'];
    name: Mountain['name'];
    latitude: Mountain['latitude'];
    longitude: Mountain['longitude'];
    elevation: Mountain['elevation'];
  }>;
}

interface Variables {
  latitude: number;
  longitude: number;
  latDistance: number;
  longDistance: number;
}

interface Props {
  latitude: number;
  longitude: number;
  mountainsToIgnore: string[];
  onFeatureClick: (point: CoordinateWithDates) => void;
  togglePointer: (mapEl: any, cursor: string) => void;
}

const Map = (props: Props) => {
  const {
    latitude, longitude, mountainsToIgnore,
    onFeatureClick, togglePointer,
  } = props;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_NEARBY_MOUNTAINS, {
    variables: { latitude, longitude, latDistance: 0.4, longDistance: 0.4 },
  });

  const prevData = usePrevious(data);

  let nearbyMountains: CoordinateWithDates[];
  if (loading || error) {
    if (prevData !== undefined && prevData.mountains) {
      nearbyMountains = prevData.mountains.filter(mtn => !mountainsToIgnore.includes(mtn.id));
    } else {
      nearbyMountains = [];
    }
  } else if (data !== undefined && data.mountains) {
    nearbyMountains = data.mountains.filter(mtn => !mountainsToIgnore.includes(mtn.id));
  } else {
    nearbyMountains = [];
  }

  const features = nearbyMountains.map(point => {
    const onClick = () => onFeatureClick(point);
    return (
      <Feature
        coordinates={[point.longitude, point.latitude]}
        onClick={onClick}
        onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
        onMouseLeave={(event: any) => togglePointer(event.map, '')}
        properties={{
          'circle-color': legendColorScheme.secondary,
          'icon-image': legendSymbolScheme.secondary,
        }}
        key={'' + point.latitude + point.longitude}
      />
    );
  });

  return (
    <>
      <Layer
        type='circle'
        id='nearby-mountains-circle'
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
        id='nearby-mountains-icon'
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

export default Map;
