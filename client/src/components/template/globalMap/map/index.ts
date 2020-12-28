import mapboxgl from 'mapbox-gl';
import {
  contentColumnIdeal,
  contentColumnMax,
  contentColumnMin,
} from '../../../../styling/Grid';
import {Coordinate, Latitude, Longitude} from '../../../../types/graphQLTypes';
import {mobileSize} from '../../../../Utils';
import {logoSmallWidth, logoSmallWindoWidth, sideContentWidth} from '../../navigation/Header';

// eslint-disable-next-line
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface Input {
  container: HTMLElement;
}

export interface Output {
  map: mapboxgl.Map;
  setNewCenter: (center: Coordinate, zoom: number) => void;
  setNewBounds: (bbox: [Longitude, Latitude, Longitude, Latitude]) => void;
}

const initMap = ({container}: Input): Output => {
  if (process.env.REACT_APP_MAPBOX_ACCESS_TOKEN) {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  }

  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/wsoeltz/ckis2a1er0czp19qjthgqy9l5', // stylesheet location
    center: [-98.5795, 39.8283], // starting position [lng, lat]
    zoom: 3.5, // starting zoom
    maxZoom: 15.5,
  });

  const setPadding = () => {
    const windowWidth = window.innerWidth;
    let left: number = windowWidth * contentColumnIdeal;
    if (windowWidth <= mobileSize) {
      left = 0;
    } else if (left > contentColumnMax) {
      left = contentColumnMax;
    } else if (left < contentColumnMin) {
      left = contentColumnMin;
    }
    let right: number = sideContentWidth;
    if (windowWidth <= mobileSize) {
      right = 0;
    } else if (windowWidth <= logoSmallWindoWidth) {
      right = logoSmallWidth;
    }
    map.setPadding({
      left,
      top: 110,
      bottom: windowWidth <= mobileSize ? window.innerHeight * 0.55 : window.innerHeight * 0.25,
      right,
    });
  };

  const setNewCenter = (center: Coordinate, zoom: number) => {
    setPadding();
    map.jumpTo({
      center,
      zoom,
    });
  };

  const setNewBounds = (bbox: [Longitude, Latitude, Longitude, Latitude]) => {
    setPadding();
    map.fitBounds(bbox, {
      padding: window.innerWidth * 0.05,
      animate: false,
    });
  };

  return {map, setNewCenter, setNewBounds};
};

export default initMap;
