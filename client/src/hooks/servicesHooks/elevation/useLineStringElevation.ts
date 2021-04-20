import axios from 'axios';
import {useEffect, useState} from 'react';
import {getLineElevationUrl} from '../../../routing/services';
import {Coordinate} from '../../../types/graphQLTypes';
import {
  isUrlQueued,
  pushUrlToQueue,
  readLineElevationCache,
  removeUrlFromQueue,
  SuccessResponse,
  writeLineElevationCache,
} from './simpleCache';

interface Output {
  loading: boolean;
  error: any;
  data: undefined | SuccessResponse;
}

interface Input {
  lineId: string;
  line: null | Coordinate[];
  includeIncline?: boolean;
  includeMinMax?: boolean;
}

const useRoutesToPoint = (input: Input): Output => {
  const {line, includeIncline, includeMinMax, lineId} = input;

  const [output, setOutput] = useState<Output>({loading: true, error: undefined, data: undefined});

  useEffect(() => {
    const incline = includeIncline ? true : false;
    const minMax = includeMinMax ? true : false;
    let mounted = true;
    let attempts = 0;
    const key = `${lineId}${incline}${minMax}`;
    const fetchRoutes = () => {
      const cached = readLineElevationCache(key);
      if (cached) {
        if (mounted) {
          setOutput({loading: false, error: undefined, data: cached.data});
        }
      } else {
        if (!isUrlQueued(key) || attempts > 100) {
          pushUrlToQueue(key);
          if (mounted) {
            setOutput(curr => ({...curr, loading: true}));
          }
          axios({
            method: 'post',
            url: getLineElevationUrl(),
            data: {line, incline, minMax},
          }).then(response => {
              if (mounted) {
                setOutput({loading: false, error: undefined, data: response.data});
              }
              writeLineElevationCache(key, response.data);
              removeUrlFromQueue(key);
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
    if (line !== null && line.length) {
      fetchRoutes();
    }
    return () => {
      mounted = false;
    };
  }, [line, includeIncline, includeMinMax, lineId]);

  return output;
};

export default useRoutesToPoint;
