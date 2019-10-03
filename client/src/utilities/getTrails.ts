import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache: any = setupCache({
  maxAge: 5 * 24 * 60 * 60 * 1000, // days * hours * minutes * seconds * milliseconds
});

const getTrails = axios.create({
  /* tslint:disable:max-line-length */
  baseURL: `https://www.hikingproject.com/data/get-trails?key=${process.env.REACT_APP_HIKING_PROJECT_KEY}&maxDistance=1&sort=distance&maxResults=300`,
  adapter: cache.adapter,
});

export default getTrails;
