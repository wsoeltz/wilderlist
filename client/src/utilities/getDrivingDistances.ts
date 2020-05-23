import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache: any = setupCache({
  maxAge: 5 * 24 * 60 * 60 * 1000, // days * hours * minutes * seconds * milliseconds
});

const fetchDrivingData = axios.create({
  adapter: cache.adapter,
});

interface RouteDatum {
  distance: number;
  duration: number;
  geometry: {
    coordinates: Array<[number, number]>;
  };
}

export interface DrivingData {
  hours: number;
  minutes: number;
  miles: number;
  coordinates: Array<[number, number]>;
}

const getDrivingDistance = async (lat1: number, long1: number, lat2: number, long2: number) => {
  try {
    const res = await fetchDrivingData(
      /* tslint:disable:max-line-length */
      `https://api.mapbox.com/directions/v5/mapbox/driving/${long1},${lat1};${long2},${lat2}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}&geometries=geojson&overview=full`,
    );
    if (res && res.data && res.data.routes && res.data.routes[0] &&
        res.data.routes[0].distance && res.data.routes[0].duration) {
      const {distance, duration, geometry: {coordinates}}: RouteDatum = res.data.routes[0];
      const hours = Math.floor(duration / 60 / 60);
      const minutes = Math.round(((duration / 60 / 60) - hours) * 60);
      const miles = Math.round(distance * 0.00062137);
      return {hours, minutes, miles, coordinates};
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};
export default getDrivingDistance;
