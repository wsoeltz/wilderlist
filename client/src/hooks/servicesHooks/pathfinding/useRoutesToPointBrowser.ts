import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {useEffect, useState} from 'react';
import {getRoutesToPointRawDataURL, RoutesToPointInput} from '../../../routing/services';
import {
  FeatureCollection,
  readRoutesCache,
  writeRoutesCache,
} from './simpleCache';
import findRoutesInBrowser from './findRoutesInBrowser';

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
    let mounted = true;
    const url = getRoutesToPointRawDataURL({
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
          findRoutesInBrowser({
              geojson: response.data.geojson,
              destinations: response.data.destinations,
              lat, lng, destinationType: destination,
            })
            .then((data: FeatureCollection) => {
              if (mounted) {
                setOutput({loading: false, error: undefined, data});
              }
              writeRoutesCache(url, data);
            })
            .catch(error => {
              if (mounted) {
                setOutput({loading: false, error, data: undefined});
              }
            });
        })
        .catch(error => {
          if (mounted) {
            setOutput({loading: false, error, data: undefined});
          }
        });
    }
    return () => {
      mounted = false
    }
  }, [lat, lng, altLat, altLng, destination]);

  return output;
};

export default useRoutesToPoint;
