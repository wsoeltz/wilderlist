import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getWeather = axios.create({
  adapter: cache.adapter,
});

const getWeatherData = async (latitude: string, longitude: string) => {
  try {
    const res = await getWeather(`https://api.weather.gov/points/${latitude},${longitude}`);
    if (res && res.data && res.data.properties && res.data.properties.forecast) {
      const forecastData = await getWeather(res.data.properties.forecast);
      if (forecastData && forecastData.data && forecastData.data.properties
        && forecastData.data.properties.periods) {
        return forecastData.data.properties.periods;
      } else {
        return {error: 'There was an error getting the forecast'};
      }
    } else {
      return {error: 'There was an error getting the location response'};
    }
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getWeatherData;
