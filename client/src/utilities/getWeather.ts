import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getWeather = axios.create({
  adapter: cache.adapter,
});

export default getWeather;
