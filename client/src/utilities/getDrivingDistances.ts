import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache: any = setupCache({
  maxAge: 5 * 24 * 60 * 60 * 1000, // days * hours * minutes * seconds * milliseconds
});

const getDrivingDistance = async (lat1: number, long1: number, lat2: number, long2: number) => {
  const fetchDrivingData = axios.create({
    adapter: cache.adapter,
  });
  try {
    const res = await fetchDrivingData(
      /* tslint:disable:max-line-length */
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${long1},${lat1};${long2},${lat2}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`,
    );
    if (res && res.data && res.data.routes && res.data.routes[0] &&
        res.data.routes[0].distance && res.data.routes[0].duration) {
      const {distance, duration}: {distance: number, duration: number} = res.data.routes[0];
      const hours = Math.floor(duration / 60 / 60);
      const minutes = Math.round(((duration / 60 / 60) - hours) * 60);
      const miles = Math.round(distance * 0.00062137);
      return {hours, minutes, miles};
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};
export default getDrivingDistance;
