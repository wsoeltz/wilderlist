import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {useEffect, useState} from 'react';
import {getRoutesToPointURL, RoutesToPointInput} from '../../../routing/services';
import {
  FeatureCollection,
  readRoutesCache,
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

interface Input {
  lat: number;
  lng: number;
  altLat?: number;
  altLng?: number;
  destination?: RoutesToPointInput['destination'];
}

const useRoutesToPoint = (input: Input): Output => {
  const {lat, lng, altLat, altLng, destination} = input;
  const [output, setOutput] = useState<Output>({loading: true, error: undefined, data: undefined});

  useEffect(() => {
    const url = getRoutesToPointURL({
      coord: [lng, lat],
      altCoord: altLat && altLng ? [altLng, altLat] : undefined,
      destination,
    });
    const cached = readRoutesCache(url);
    if (cached) {
      setOutput({loading: false, error: undefined, data: cached.data});
    } else {
      setOutput(curr => ({...curr, loading: true}));
      getRoutesToPoint(url)
        .then(response => {
          setOutput({loading: false, error: undefined, data: response.data});
          writeRoutesCache(url, response.data);
        })
        .catch(error => setOutput({loading: false, error, data: undefined}));
    }
  }, [lat, lng, altLat, altLng, destination]);

  return output;
};

export default useRoutesToPoint;
