import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, {useEffect, useState} from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import usePrevious from '../../../hooks/usePrevious';
import { Mountain } from '../../../types/graphQLTypes';
import {getDistanceFromLatLonInMiles} from '../../../Utils';
import {legendSymbolScheme} from './colorScaleColors';
import {CoordinateWithDates} from './types';

const GET_NEARBY_MOUNTAINS = gql`
  query getNearbyMountains(
    $latitude: Float!, $longitude: Float!, $latDistance: Float!, $longDistance: Float!, $limit: Int!) {
  mountains: nearbyMountains(
    latitude: $latitude,
    longitude: $longitude,
    latDistance: $latDistance,
    longDistance: $longDistance,
    limit: $limit,
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
  limit: number;
}

interface Props {
  showOtherMountains: boolean | undefined;
  otherMountainsOn: boolean;
  latitude: number;
  longitude: number;
  currentZoom: number | undefined;
  mountainsToIgnore: string[];
  onFeatureClick: (point: CoordinateWithDates) => void;
  togglePointer: (mapEl: any, cursor: string) => void;
  useGenericFunctionality: boolean | undefined;
}

const Map = (props: Props) => {
  const {
    latitude, longitude, mountainsToIgnore,
    onFeatureClick, togglePointer,
    showOtherMountains, otherMountainsOn,
    useGenericFunctionality,
    currentZoom,
  } = props;

  const [coords, setCoords] = useState<{latitude: number, longitude: number, distance: number, limit: number}>({
    latitude, longitude,
    distance: 0.6,
    limit: 1000,
  });

  useEffect(() => {
    const distance = getDistanceFromLatLonInMiles({
      lat1: coords.latitude,
      lon1: coords.longitude,
      lat2: latitude,
      lon2: longitude,
    });
    if (distance > 25) {
      let newDistance: number;
      if (currentZoom && currentZoom < 4) {
        newDistance = 20;
      } else if (currentZoom && currentZoom < 4) {
        newDistance = 5;
      } else if (currentZoom && currentZoom < 7.5) {
        newDistance = 1;
      } else {
        newDistance = 0.45;
      }
      setCoords({latitude, longitude, distance: newDistance, limit: 1000});
    }
  }, [latitude, longitude, coords, currentZoom]);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_NEARBY_MOUNTAINS, {
    variables: { ...coords, latDistance: coords.distance, longDistance: coords.distance * 1.1 },
  });

  const prevData = usePrevious(data);

  if (!(showOtherMountains && otherMountainsOn)) {
    return <></>;
  }

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

  if (nearbyMountains && nearbyMountains.length) {
    const features = nearbyMountains.map(point => {
      const onClick = () => onFeatureClick(point);
      return (
        <Feature
          coordinates={[point.longitude, point.latitude]}
          onClick={onClick}
          onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
          onMouseLeave={(event: any) => togglePointer(event.map, '')}
          properties={{
            'icon-image': useGenericFunctionality ? legendSymbolScheme.primary : legendSymbolScheme.secondary,
          }}
          key={'' + point.latitude + point.longitude}
        />
      );
    });

    return (
      <Layer
        type='symbol'
        id='nearby-mountains-icon'
        layout={{
          'icon-image': ['get', 'icon-image'],
          'icon-size': {
            base: 0.5,
            stops: [
              [1, 0.1],
              [5, 0.2],
              [10, 0.5],
              [12, 0.7],
              [17, 1],
            ],
          },
          'icon-allow-overlap': coords.distance > 4,
        }}
      >
        {features}
      </Layer>
    );
  } else {
    return <></>;
  }

};

export default Map;
