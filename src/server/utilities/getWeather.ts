import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getOpenWeather = axios.create({
  adapter: cache.adapter,
});

interface NWSData {
  operationalMode: string;
  srsName: string;
  creationDate: string;
  creationDateLocal: string;
  productionCenter: string;
  credit: string;
  moreInformation: string;
  location: {
    region: string,
    latitude: string,
    longitude: string,
    elevation: string,
    wfo: string,
    timezone: string,
    areaDescription: string,
    radar: string,
    zone: string,
    county: string,
    firezone: string,
    metar: string,
  };
  time: {
    layoutKey: string,
    startPeriodName: string[],
    startValidTime: Date[],
    tempLabel: Array<'High' | 'Low'>,
  };
  data: {
    temperature: string[],
    pop: Array<string | null>, // percent of precipitation
    weather: string[], // shortForecast
    iconLink: string[],
    hazard: [],
    hazardUrl: [],
    text: string[], // detailedForecast
  };
  currentobservation: {
    id: string,
    name: string,
    elev: string,
    latitude: string,
    longitude: string,
    Date: string,
    Temp: string,
    Dewp: string,
    Relh: string,
    Winds: string,
    Windd: string,
    Gust: string,
    Weather: string,
    Weatherimage: string,
    Visibility: string,
    Altimeter: string,
    SLP: string,
    timezone: string,
    state: string,
    WindChill: string,
  };
}

interface NWSForecastPeriod {
  number: number;
  name: string;
  startTime: Date;
  // endTime: Date,
  isDaytime: boolean;
  temperature: number;
  // temperatureUnit: string,
  // temperatureTrend: null,
  icon: string;
  shortForecast: string;
  detailedForecast: string;
  precipitation: number;
}

const getNWSData = async (latitude: string, longitude: string) => {
  try {
    const fixedLatitude = parseFloat(latitude).toFixed(4);
    const fixedLongitude = parseFloat(longitude).toFixed(4);
    const nws: null | {data?: NWSData} = await axios({
      method: 'get',
      url: `https://forecast.weather.gov/MapClick.php?lat=${fixedLatitude}&lon=${fixedLongitude}&FcstType=json`,
      headers: { 'User-Agent': '(wilderlist.app, dev@wilderlist.app)' },
    });
    const periods: NWSForecastPeriod[] = [];
    if (nws && nws.data) {
      const {
        time,
        data: {temperature, iconLink, weather, text, pop},
      } = nws.data;
      time.startPeriodName.forEach((name, i) => {
        periods.push({
          number: i + 1,
          name,
          startTime: time.startValidTime[i],
          isDaytime: !name.toLowerCase().includes('night'),
          temperature: parseInt(temperature[i], 10),
          icon: iconLink[i],
          shortForecast: weather[i],
          detailedForecast: text[i],
          precipitation: pop[i] !== null ? parseInt(pop[i] as string, 10) : 0,
        });
      });
    }
    if (periods.length) {
      return periods;
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
    const nwsData = await getNWSData(latitude, longitude);
    if (nwsData) {
      return {source: ForecastSource.NWS, data: nwsData};
    } else {
      const openWeatherData = await getOpenWeatherData(latitude, longitude);
      if (openWeatherData && openWeatherData.data) {
        return {source: ForecastSource.OpenWeatherMap, data: openWeatherData.data};
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
