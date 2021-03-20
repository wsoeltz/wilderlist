import mapboxgl from 'mapbox-gl';
import {getWeatherState, WeatherOverlay, WeatherState} from './';

interface Input {
  map: mapboxgl.Map;
  sourceId: string;
  type: WeatherOverlay;
}

const openweatherMapLayer = async ({map, sourceId, type}: Input): Promise<WeatherState | null> => {
  try {

    const url = `https://tile.openweathermap.org/map/${type}_new/{z}/{x}/{y}.png?appid=${
      process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`;

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

    const setTime = () => {
      if (map.getLayer(sourceId)) {
        map.removeLayer(sourceId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
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
      return getWeatherState();
    };

    return {
      type,
      activeTime: new Date(),
      allTimes: [],
      setTime,
    };
  } catch (err) {
    console.error(err);
  }
  return null;
};

export default openweatherMapLayer;
