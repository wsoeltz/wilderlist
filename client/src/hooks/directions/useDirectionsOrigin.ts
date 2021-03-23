import localforage from 'localforage';
import {useCallback, useEffect, useState} from 'react';
import {Coordinate} from '../../types/graphQLTypes';

export interface OriginLocation {
  name: string;
  locationName?: string;
  coordinates: Coordinate;
}

interface LocationResponse {
  loading: boolean;
  error: undefined | any;
  data: undefined | null | OriginLocation;
}

const LOCALFORAGE_KEY = 'userOriginLocationData';

const useDirectionsOrigin = () => {
  const [location, setLocation] = useState<LocationResponse>({loading: true, error: undefined, data: undefined});

  const updateLocation = useCallback((newLocation: OriginLocation | null, loading?: boolean, error?: any) => {
    setLocation({
      loading: loading ? loading : false,
      error,
      data: newLocation,
    });
    localforage.setItem(LOCALFORAGE_KEY, newLocation);
  }, [setLocation]);

  useEffect(() => {
    localforage
      .getItem(LOCALFORAGE_KEY)
      .then((data: OriginLocation | undefined) => {
        if (data) {
          setLocation({loading: false, error: undefined, data});
        } else {
          setLocation({loading: false, error: undefined, data: undefined});
        }
      })
      .catch(error => {
        setLocation({loading: false, error, data: undefined});
      });
  }, []);

  const getUsersLocation = useCallback(() => {
    if (!navigator.geolocation) {
      updateLocation(null, false, 'Geolocation is not supported by your browser');
    } else {
      updateLocation(null, true);
      navigator.geolocation.getCurrentPosition(position => {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        updateLocation({
          name: 'Your Location',
          coordinates: [longitude, latitude],
        });
      }, error => {
          console.error(error);
          updateLocation(null, false, 'Unable to retrieve your location');
      },
      {timeout: 10000});
    }
  }, [updateLocation]);

  return {location, updateLocation, getUsersLocation};
};

export default useDirectionsOrigin;
