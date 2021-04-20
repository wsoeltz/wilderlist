import { useEffect, useState } from 'react';
import {defaultCenter} from '../components/template/globalMap/map';
import {Coordinate} from '../types/graphQLTypes';
import useMapContext from './useMapContext';

const lngLatLikeToCoordinate = ({lng, lat}: {lng: number, lat: number}): Coordinate => [lng, lat];

const useMapCenter = () => {
  const mapContext = useMapContext();
  const currentCenter = mapContext.intialized ? lngLatLikeToCoordinate(mapContext.map.getCenter()) : defaultCenter;
  const [center, setCenter] = useState<Coordinate>(currentCenter);

  useEffect(() => {
    const getMapCenter = () => {
      if (mapContext.intialized) {
        const newCenter = mapContext.map.getCenter();
        setCenter([newCenter.lng, newCenter.lat]);
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
  }, [mapContext]);

  return center;
};

export default useMapCenter;
