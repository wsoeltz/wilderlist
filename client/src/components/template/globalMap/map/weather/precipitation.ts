import axios from 'axios';
import orderBy from 'lodash/orderBy';
import mapboxgl from 'mapbox-gl';
import {getWeatherState, updateActiveTime, WeatherOverlay, WeatherState} from './';

interface Input {
  map: mapboxgl.Map;
  sourceId: string;
}

const precipitation = async ({map, sourceId}: Input): Promise<WeatherState | null> => {
  try {
    const response = await axios.get('https://api.rainviewer.com/public/weather-maps.json');
    const {host, radar: {past, nowcast}} = response.data;
    const sortedDatePaths = orderBy([...past, ...nowcast], ['time']);
    const allTimes = sortedDatePaths.map(({time}) => new Date(time * 1000));

    const currentWeatherState = getWeatherState();

    const now = new Date().getTime();
    const indexOfNow = allTimes.findIndex((then, i) => {
      if (currentWeatherState) {
        if (currentWeatherState.activeTime.getTime() === then.getTime()) {
          return true;
        }
      } else {
        const next = allTimes[i + 1];
        if (now >= then.getTime() && now <= next.getTime()) {
          return true;
        }
      }
      return false;
    });

    const activeTime = indexOfNow !== -1 && indexOfNow !== sortedDatePaths.length
      ? sortedDatePaths[indexOfNow] : sortedDatePaths[0];
    const url = host + activeTime.path +
      `/512/{z}/{x}/{y}/4/1_1.png`;

    map.addSource(sourceId, {
      type: 'raster',
      tiles: [url],
      tileSize: 512,
    });
    map.addLayer({
      id: sourceId,
      type: 'raster',
      source: sourceId,
      paint: {
        'raster-opacity': 0.8,
      },
    });

    const setTime = (date: Date) => {
      const indexOfDate = allTimes.findIndex(then => then.getTime() === date.getTime());
      if (map.getLayer(sourceId)) {
        map.removeLayer(sourceId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
      const newActiveTime = indexOfDate !== -1 ? sortedDatePaths[indexOfDate] : sortedDatePaths[0];
      const newUrl = host + newActiveTime.path +
        `/512/{z}/{x}/{y}/4/1_1.png`;
      map.addSource(sourceId, {
        type: 'raster',
        tiles: [newUrl],
        tileSize: 512,
      });
      map.addLayer({
        id: sourceId,
        type: 'raster',
        source: sourceId,
        paint: {
          'raster-opacity': 0.8,
        },
      });
      return updateActiveTime(date);
    };

    return {
      type: WeatherOverlay.precipitation,
      activeTime: new Date(activeTime.time * 1000),
      allTimes,
      setTime,
    };
  } catch (err) {
    console.error(err);
  }
  return null;
};

export default precipitation;
