import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {useEffect, useState} from 'react';
import {DirectionToParkingInput, getDirectionToParkingURL} from '../../../routing/services';
import {
  Destination,
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
  data: undefined | Destination[];
}

export const retrieveCachedDirections = (input: DirectionToParkingInput) => {
  const {start, end, considerDirect} = input;
  // coordinate values are broken out to prevent rerenders
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;
  const url = getDirectionToParkingURL({
    start: [lng1, lat1],
    end: [lng2, lat2],
    considerDirect,
  });
  const cached = readRoutesCache(url);
  if (cached) {
    return cached.data;
  }
  return null;
};

const useDirectionsToParking = (input: DirectionToParkingInput): Output => {
  const {start, end, considerDirect, totalResults} = input;
  // coordinate values are broken out to prevent rerenders
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;
  const [output, setOutput] = useState<Output>({loading: true, error: undefined, data: undefined});

  useEffect(() => {
    let mounted = true;
    const url = getDirectionToParkingURL({
      start: [lng1, lat1],
      end: [lng2, lat2],
      considerDirect,
      totalResults,
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
  }, [lat1, lng1, lat2, lng2, considerDirect, totalResults]);

  return output;
};

export default useDirectionsToParking;
