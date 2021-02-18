/* tslint:disable:await-promise */
const { point } = require('@turf/helpers');
const distance = require('@turf/distance');
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cacheGeoCode: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getGeoCode = axios.create({
  adapter: cacheGeoCode.adapter,
});

interface Input {
  lat: number;
  lng: number;
  search: string;
}

const mapboxGeocode = async (input: Input) => {
  try {
    const url = encodeURI(`https://api.mapbox.com/geocoding/v5/mapbox.places/${
      input.search
    }.json?country=US&proximity=${
      Math.round(input.lng)
    },${
      Math.round(input.lat)
    }&autocomplete&limit=15&access_token=${
      process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    }`);
    const geoCodeRes = await getGeoCode(url) as any;
    const sourcePoint = point([input.lng, input.lat]);
    return geoCodeRes.data.features.map((f: any) => ({
      name: f.text,
      type: 'geolocation',
      locationName: f.place_name.startsWith(f.text + ',')
        ? f.place_name.replace(f.text + ',', '').trim() : f.place_name,
      distance: distance(point(f.center), sourcePoint, {units: 'miles'}),
      coordinates: f.center,
      bbox: f.bbox,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getGeoSearch = async (input: Input) => {
  try {
    const geoResults = await mapboxGeocode(input) as any[];
    return geoResults.slice(0, 15);
  } catch (err) {
    console.error(err);
  }
};

export default getGeoSearch;
