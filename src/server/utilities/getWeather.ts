import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getOpenWeather = axios.create({
  adapter: cache.adapter,
});

const getNWSData = async (latitude: string, longitude: string) => {
  try {
    const res = await axios(`https://api.weather.gov/points/${latitude},${longitude}`);
    if (res && res.data && res.data.properties && res.data.properties.forecast) {
      const forecastData = await axios(res.data.properties.forecast);
      if (forecastData && forecastData.data && forecastData.data.properties
        && forecastData.data.properties.periods) {
        return forecastData.data.properties.periods;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

enum ForecastSource {
  NWS = 'nws',
  OpenWeatherMap = 'openweathermap',
}

const getOpenWeatherData = async (latitude: string, longitude: string) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${
      latitude
    }&lon=${
      longitude
    }&exclude=current,minutely&units=imperial&appid=${
      process.env.OPENWEATHERMAP_API_KEY
    }`;
    const res = await getOpenWeather(url);
    if (res && res.data) {
      return res;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getWeatherData = async (latitude: string, longitude: string) => {
  try {
    const openWeatherData = await getOpenWeatherData(latitude, longitude);
    if (openWeatherData && openWeatherData.data) {
      return {source: ForecastSource.OpenWeatherMap, data: openWeatherData.data};
    } else {
      const nwsData = await getNWSData(latitude, longitude);
      if (nwsData) {
        return {source: ForecastSource.NWS, data: nwsData};
      } else {
        return {error: 'There was an error retrieving the weather'};
      }
    }
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getWeatherData;
