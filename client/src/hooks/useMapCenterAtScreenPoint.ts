import {Point} from 'mapbox-gl';
import { useEffect, useState } from 'react';
import {defaultCenter} from '../components/template/globalMap/map';
import {Coordinate} from '../types/graphQLTypes';
import useMapContext from './useMapContext';

const lngLatLikeToCoordinate = ({lng, lat}: {lng: number, lat: number}): Coordinate => [lng, lat];

const useMapCenter = (x: number, y: number) => {
  const mapContext = useMapContext();
  const currentCenter = mapContext.intialized ? lngLatLikeToCoordinate(mapContext.map.getCenter()) : defaultCenter;
  const [center, setCenter] = useState<Coordinate>(currentCenter);

  useEffect(() => {
    const getMapCenter = () => {
      if (mapContext.intialized) {
        const point = new Point(x, y);
        const latLng = mapContext.map.unproject(point);
        const newCenter = lngLatLikeToCoordinate(latLng);
        setCenter(newCenter);
      }
    };
    if (mapContext.intialized) {
      const {map} = mapContext;
      map.on('moveend', getMapCenter);
    }

    return () => {
      if (mapContext.intialized) {
        const {map} = mapContext;
        map.off('moveend', getMapCenter);
      }
    };
  }, [mapContext, x, y]);

  return center;
};

export default useMapCenter;
