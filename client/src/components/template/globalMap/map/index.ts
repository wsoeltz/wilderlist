import mapboxgl from 'mapbox-gl';
import {Coordinate} from '../../../../types/graphQLTypes';

// eslint-disable-next-line
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface Input {
  container: HTMLElement;
}

export interface Output {
  map: mapboxgl.Map;
  setNewCenter: (center: Coordinate) => void;
}


const initMap = ({container}: Input) => {
  if (process.env.REACT_APP_MAPBOX_ACCESS_TOKEN) {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  }

  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/wsoeltz/ckis2a1er0czp19qjthgqy9l5', // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    maxZoom: 16,
  });

  const setNewCenter = (center: Coordinate) => {
    map.jumpTo({
      center,
      zoom: 12,
    });
  }

  return {map, setNewCenter}
}

export default initMap;