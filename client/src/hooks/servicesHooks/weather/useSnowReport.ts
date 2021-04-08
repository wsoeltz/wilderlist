import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {useEffect, useState} from 'react';
import {getSnowReportURL, SnowReportInput} from '../../../routing/services';
import {
  isUrlQueued,
  pushUrlToQueue,
  readSnowCache,
  removeUrlFromQueue,
  SnowReport,
  writeSnowCache,
} from './simpleCache';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getSnowReport = axios.create({
  adapter: cache.adapter,
});

interface Output {
  loading: boolean;
  error: any;
  data: undefined | SnowReport;
}

const useSnowReport = (input: SnowReportInput): Output => {
  const {coord, stateAbbr} = input;
  // coordinate values are broken out to prevent rerenders
  const [lng, lat] = coord;
  const [output, setOutput] = useState<Output>({loading: true, error: undefined, data: undefined});

  useEffect(() => {
    let mounted = true;
    const url = getSnowReportURL({
      coord: [lng, lat],
      stateAbbr,
    });
    let attempts = 0;
    const fetchRoutes = () => {
      const cached = readSnowCache(url);
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
          getSnowReport(url)
            .then(response => {
              if (mounted) {
                setOutput({loading: false, error: undefined, data: response.data});
              }
              writeSnowCache(url, response.data);
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
  }, [lat, lng, stateAbbr]);

  return output;
};

export default useSnowReport;
