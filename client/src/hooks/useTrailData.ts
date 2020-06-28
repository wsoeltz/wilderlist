import {useEffect, useState} from 'react';
import { Trail } from '../components/sharedComponents/map/types';
import getTrails, {
  TrailsDatum,
} from '../utilities/getTrails';
import {latLonKey} from '../Utils';
import usePrevious from './usePrevious';

interface Input {
  lat: number;
  lon: number;
  active: boolean;
}

interface CachedDatum {
  key: string;
  trails: Trail[];
}

interface Output {
  trails: Trail[] | undefined;
}

const getTrailsData = async (
  lat: number, lon: number,
  setTrailData: (input: Trail[]) => void,
  pushToCache: (input: CachedDatum) => void,
) => {
  try {
    const res = await getTrails({params: {lat, lon, maxDistance: 70}});
    if (res && res.data && res.data.trails) {
      const rawData: TrailsDatum[] = res.data.trails;
      const cleanedTrailData: Trail[] = rawData.map(trailDatum => {
        return {
          id: trailDatum.id.toString(),
          latitude: trailDatum.latitude,
          longitude: trailDatum.longitude,
          name: trailDatum.name,
          elevation: trailDatum.ascent,
          url: trailDatum.url,
          mileage: trailDatum.length,
          type: trailDatum.type,
          summary: trailDatum.summary,
          difficulty: trailDatum.difficulty,
          location: trailDatum.location,
          image: trailDatum.imgMedium,
          conditionStatus: trailDatum.conditionStatus,
          conditionDetails: trailDatum.conditionDetails,
          conditionDate: new Date(trailDatum.conditionDate),
          highPoint: trailDatum.high,
          lowPoint: trailDatum.low,
        };
      });
      setTrailData([...cleanedTrailData]);
      pushToCache({
        key: latLonKey({lat, lon}),
        trails: [...cleanedTrailData],
      });
    } else {
      console.error('There was an error getting the location response');
    }
  } catch (err) {
    console.error(err);
  }
};

export default (input: Input): Output => {
  const [trailData, setTrailData] = useState<Trail[] | undefined>(undefined);
  const [cache, setCache] = useState<CachedDatum[]>([]);

  const prevInput = usePrevious(input);

  useEffect(() => {
    if (input.active === false && trailData !== undefined) {
      setTrailData(undefined);
    } else if (prevInput === undefined ||
              (prevInput.lat !== input.lat && prevInput.lon !== input.lon)
       ) {
      const lat = parseFloat(input.lat.toFixed(2));
      const lon = parseFloat(input.lon.toFixed(2));
      const key = latLonKey({lat, lon});
      const cachedValue = cache.find(c => c.key === key);
      if (cachedValue) {
        setTrailData([...cachedValue.trails]);
      } else {
        const updateCache = (newCacheDatum: CachedDatum) => {
          const newCache = [...cache, {key: newCacheDatum.key, trails: newCacheDatum.trails}];
          setCache([...newCache]);
        };
        getTrailsData(lat, lon, setTrailData, updateCache);
      }
    }
  }, [input, prevInput, trailData, cache]);

  return {trails: trailData};
};
