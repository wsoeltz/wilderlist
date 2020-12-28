import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {useEffect, useState} from 'react';
import {Coordinate} from '../types/graphQLTypes';

const cacheIp: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

export const getUsersIAndpLocation = axios.create({
  adapter: cacheIp.adapter,
});

export interface GeoPluginDatum {
  geoplugin_areaCode: string | '';
  geoplugin_city: string | '';
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
  location: Coordinate | undefined;
}

const useUsersLocation = (): LocationResponse => {
  const [output, setOuput] = useState<LocationResponse>({
    loading: true, error: undefined, location: undefined,
  });

  useEffect(() => {
    const getUsersIpLocation = async () => {
      try {
        const key = process.env.REACT_APP_GEO_PLUGIN_API_KEY;
        const res: undefined | {data: GeoPluginDatum} = await getUsersIAndpLocation.get(
          `https://ssl.geoplugin.net/json.gp?k=${key}`,
        );
        let location: Coordinate | undefined;
        let error: {message: string} | undefined;
        if (res && res.data) {
          const {
            geoplugin_latitude, geoplugin_longitude,
          } = res.data;
          if (geoplugin_latitude && geoplugin_longitude) {
            location = [parseFloat(geoplugin_longitude), parseFloat(geoplugin_latitude) ];
            error = undefined;
          }
        }
        setOuput({
          loading: false,
          error,
          location,
        });
      } catch (error) {
        console.error(error);
        setOuput({
          loading: false,
          error,
          location: undefined,
        });
      }
    };
    if (output.location === undefined && output.error === undefined) {
      getUsersIpLocation();
    }
  }, [output, setOuput]);

  return output;
};

export default useUsersLocation;
