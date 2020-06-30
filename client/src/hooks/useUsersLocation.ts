import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {useEffect, useState} from 'react';

const localstorageUserAllowsLocationKey = 'localstorageUserAllowsLocationKey';
export const userAllowsPreciseLocation = () => {
  const value = localStorage.getItem(localstorageUserAllowsLocationKey);
  if (value === null) {
    return undefined;
  } else if (value === 'false') {
    return false;
  } else if (value === 'true') {
    return true;
  }
};
const setUserAllowsPreciseLocation = (val: boolean) => {
  localStorage.setItem(localstorageUserAllowsLocationKey, val.toString());
};

const cacheIp: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const cacheState: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getUsersIAndpLocation = axios.create({
  adapter: cacheIp.adapter,
});
const getStateByAbbr = axios.create({
  adapter: cacheState.adapter,
});

const getStateData = async (abbr: string) => {
  try {
    if (abbr) {
      const res: undefined | {data: Array<{_id: string}>} = await getStateByAbbr.get(
        `/api/state-by-abbreviation?abbr=${abbr}`,
      );
      if (res && res.data && res.data[0]) {
        return res.data[0]._id;
      }
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

interface GeoPluginDatum {
  geoplugin_areaCode: string;
  geoplugin_city: string;
  geoplugin_continentCode: string;
  geoplugin_continentName: string;
  geoplugin_countryCode: string;
  geoplugin_countryName: string;
  geoplugin_credit: string;
  geoplugin_currencyCode: string;
  geoplugin_currencyConverter: number;
  geoplugin_currencySymbol: string;
  geoplugin_currencySymbol_UTF8: string;
  geoplugin_delay: string;
  geoplugin_dmaCode: string;
  geoplugin_euVATrate: boolean;
  geoplugin_inEU: number;
  geoplugin_latitude: string;
  geoplugin_locationAccuracyRadius: string;
  geoplugin_longitude: string;
  geoplugin_region: string;
  geoplugin_regionCode: string;
  geoplugin_regionName: string;
  geoplugin_request: string;
  geoplugin_status: number;
  geoplugin_timezone: string;
}

interface LocationResponse {
  loading: boolean;
  error: undefined | {message: string};
  data: undefined | {
    coordinates: {lat: number, lng: number};
    text: string;
    city: string | null;
    stateAbbreviation: string | null;
    stateId: string | null;
  };
  isPrecise: boolean;
}

export interface UsersLocation extends LocationResponse {
  requestAccurateLocation: () => void;
}

export default (): UsersLocation => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [output, setOuput] = useState<LocationResponse>({
    loading: true, error: undefined, data: undefined, isPrecise: false,
  });

  const requestAccurateLocation = () => {
    const currentData = output && output.data ? {...output.data} : undefined;
    const onSuccess = ({coords: {latitude, longitude}}: Position) => {
      const text = 'your location';
      const coordinates = {lat: latitude, lng: longitude};
      const city = currentData && currentData.city ? currentData.city : null;
      const stateAbbreviation = currentData && currentData.city ? currentData.city : null;
      const stateId = currentData && currentData.city ? currentData.city : null;
      setOuput({
        loading: false,
        error: undefined,
        data: { text, coordinates, city, stateAbbreviation, stateId },
        isPrecise: true,
      });
      setUserAllowsPreciseLocation(true);
    };
    const onError = () => {
      setOuput({
        data: currentData,
        error: {message: 'You must enable location services for directions'},
        loading: false,
        isPrecise: false,
      });
      setUserAllowsPreciseLocation(false);
    };
    if (!navigator.geolocation) {
      setOuput({
        data: currentData,
        error: {message: 'Geolocation is not supported by your browser'},
        loading: false,
        isPrecise: false,
      });
    } else {
      setOuput({loading: true, error: undefined, data: output.data, isPrecise: false});
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  };

  useEffect(() => {
    const getUsersIpLocation = async () => {
      try {
        const key = process.env.REACT_APP_GEO_PLUGIN_API_KEY;
        const res: undefined | {data: GeoPluginDatum} = await getUsersIAndpLocation.get(
          `https://ssl.geoplugin.net/json.gp?k=${key}`,
        );
        if (res && res.data) {
          const {
            geoplugin_latitude, geoplugin_longitude,
            geoplugin_city, geoplugin_regionCode,
          } = res.data;
          const stateId = await getStateData(geoplugin_regionCode);
          setOuput({
            loading: false,
            error: undefined,
            data: {
              coordinates: {
                lat: parseFloat(geoplugin_latitude),
                lng: parseFloat(geoplugin_longitude),
              },
              text: geoplugin_city + ', ' + geoplugin_regionCode,
              stateAbbreviation: geoplugin_regionCode,
              city: geoplugin_city,
              stateId,
            },
            isPrecise: false,
          });
        } else {
          setOuput({
            loading: false,
            error: {message: 'Unable to get users location'},
            data: undefined,
            isPrecise: false,
          });
        }
      } catch (e) {
        console.error(e);
        setOuput({
          loading: false,
          error: {message: e},
          data: undefined,
          isPrecise: false,
        });
      }
    };
    if (output.data === undefined && output.error === undefined && mounted === false) {
      getUsersIpLocation();
      setMounted(true);
    }
  }, [output, setOuput, mounted, setMounted]);

  return {...output, requestAccurateLocation};
};
