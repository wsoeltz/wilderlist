import {useEffect, useState} from 'react';
import getCampsites, {
  Campsite,
} from '../utilities/getCampsites';
import {latLonKey} from '../Utils';
import usePrevious from './usePrevious';

interface Input {
  lat: number;
  lon: number;
  active: boolean;
}

interface CachedDatum {
  key: string;
  campsites: Campsite[];
}

interface Output {
  campsites: Campsite[] | undefined;
}

const getCampsitesData = async (
  lat: number,
  lng: number,
  setCampsiteData: (input: Campsite[]) => void,
  pushToCache: (input: CachedDatum) => void,
  ) => {
  try {
    const res = await getCampsites({params: {lat, lng, maxDistance: 25}});
    if (res && res.data) {
      const data: Campsite[] = res.data;
      setCampsiteData([...data]);
      pushToCache({
        key: latLonKey({lat, lon: lng}),
        campsites: [...data],
      });
    } else {
      console.error('There was an error getting the location response');
    }
  } catch (err) {
    console.error(err);
  }
};

export default (input: Input): Output => {
  const [campsiteData, setCampsiteData] = useState<Campsite[] | undefined>(undefined);
  const [cache, setCache] = useState<CachedDatum[]>([]);

  const prevInput = usePrevious(input);

  useEffect(() => {
    if (input.active === false && campsiteData !== undefined) {
      setCampsiteData(undefined);
    } else if (prevInput === undefined ||
              (prevInput.lat !== input.lat && prevInput.lon !== input.lon)
       ) {
      const lat = parseFloat(input.lat.toFixed(2));
      const lon = parseFloat(input.lon.toFixed(2));
      const key = latLonKey({lat, lon});
      const cachedValue = cache.find(c => c.key === key);
      if (cachedValue) {
        setCampsiteData([...cachedValue.campsites]);
      } else {
        const updateCache = (newCacheDatum: CachedDatum) => {
          const newCache = [...cache, {key: newCacheDatum.key, campsites: newCacheDatum.campsites}];
          setCache([...newCache]);
        };
        getCampsitesData(lat, lon, setCampsiteData, updateCache);
      }
    }
  }, [input, prevInput, campsiteData, cache]);

  return {campsites: campsiteData};
};
