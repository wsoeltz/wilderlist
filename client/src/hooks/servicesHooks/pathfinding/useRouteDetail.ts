import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {useEffect, useState} from 'react';
import {getRouteDetailsURL, RouteDetailInput} from '../../../routing/services';
import {
  FeatureCollection,
  isUrlQueued,
  pushUrlToQueue,
  readRoutesCache,
  removeUrlFromQueue,
  writeRoutesCache,
} from './simpleCache';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getRoutesToPoint = axios.create({
  adapter: cache.adapter,
});

interface Output {
  loading: boolean;
  error: any;
  data: undefined | FeatureCollection;
}

export interface Input {
  lat: number;
  lng: number;
  altLat?: number;
  altLng?: number;
  destination?: RouteDetailInput['destination'];
  destinationId: RouteDetailInput['destinationId'];
}

const useRoutesToPoint = (input: Input): Output => {
  const {lat, lng, altLat, altLng, destination, destinationId} = input;
  const [output, setOutput] = useState<Output>({loading: true, error: undefined, data: undefined});

  useEffect(() => {
    let mounted = true;
    const url = getRouteDetailsURL({
      coord: [lng, lat],
      altCoord: altLat && altLng ? [altLng, altLat] : undefined,
      destination, destinationId,
    });
    let attempts = 0;
    const fetchRoutes = () => {
      const cached = readRoutesCache(url);
      if (cached) {
        if (mounted) {
          setOutput({loading: false, error: undefined, data: cached.data});
        }
      } else {
        if (!isUrlQueued(url) || attempts > 100) {
          pushUrlToQueue(url);
          if (mounted) {
            setOutput(curr => ({...curr, loading: true}));
          }
          getRoutesToPoint(url)
            .then(response => {
              if (mounted) {
                setOutput({loading: false, error: undefined, data: response.data});
              }
              writeRoutesCache(url, response.data);
              removeUrlFromQueue(url);
            })
            .catch(error => {
              if (mounted) {
                setOutput({loading: false, error, data: undefined});
              }
            });
        } else {
          attempts++;
          setTimeout(fetchRoutes, 100);
        }
      }
    };
    fetchRoutes();
    return () => {
      mounted = false;
    };
  }, [lat, lng, altLat, altLng, destination, destinationId]);

  return output;
};

export default useRoutesToPoint;
