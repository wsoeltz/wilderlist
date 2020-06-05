import axios from 'axios';
import {useEffect, useState} from 'react';

interface Input {
  latitude: number | undefined;
  longitude: number | undefined;
}

interface Output {
  loading: boolean;
  error: string | undefined;
  data: undefined | {
    state: string | null;
  };
}

export default (input: Input) => {
  const {latitude, longitude} = input;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<Output['data']>(undefined);

  useEffect(() => {
    const getUsersIpLocation = async () => {
      try {
        const key = process.env.REACT_APP_GEO_PLUGIN_API_KEY;
        const res = await axios.get(
          `https://ssl.geoplugin.net/extras/location.gp?lat=${latitude}&lon=${longitude}&format=json&k=${key}`,
        );
        if (res && res.data && res.data.geoplugin_region) {
          setData({state: res.data.geoplugin_region});
          setLoading(false);
        } else {
          setData({state: null});
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        setError('Unable to fetch state data');
        setLoading(false);
      }
    };
    getUsersIpLocation();
  }, [latitude, longitude, setLoading, setError, setData]);

  return {loading, error, data};
};
