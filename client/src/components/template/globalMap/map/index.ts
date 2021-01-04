const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import { GetString } from 'fluent-react/compat';
import mapboxgl from 'mapbox-gl';
import {
  contentColumnIdeal,
  contentColumnMax,
  contentColumnMin,
} from '../../../../styling/Grid';
import {Coordinate, Latitude, Longitude} from '../../../../types/graphQLTypes';
import {mobileSize} from '../../../../Utils';
import {logoSmallWidth, logoSmallWindoWidth, sideContentWidth} from '../../navigation/Header';
import initInteractions from './interactions';
import initLayers, {
  defaultGeoJsonPoint,
  highlightedPointsLayerId,
} from './layers';

// eslint-disable-next-line
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface Input {
  container: HTMLElement;
  push: (url: string) => void;
  getString: GetString;
}

export const defaultCenter: Coordinate = [-98.5795, 39.8283];

export interface Output {
  map: mapboxgl.Map;
  setNewCenter: (center: Coordinate, zoom: number) => void;
  setNewBounds: (bbox: [Longitude, Latitude, Longitude, Latitude]) => void;
  setHighlightedPoints: (data: mapboxgl.GeoJSONSourceOptions['data']) => void;
  clearMap: () => void;
}

const initMap = ({container, push, getString}: Input): Output => {
  if (process.env.REACT_APP_MAPBOX_ACCESS_TOKEN) {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  }

  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/wsoeltz/ckis2a1er0czp19qjthgqy9l5', // stylesheet location
    center: defaultCenter, // starting position [lng, lat]
    zoom: 3.5, // starting zoom
    maxZoom: 15.5,
  });

  let mapLoaded = false;

  map.on('load', () => {
    mapLoaded = true;
    initLayers({map});
    initInteractions({map, push, getString});
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
    const {lat, lng} = map.getCenter();
    const dist = distance(point([lng, lat]), center, {units: 'miles'});
    if (dist < 30) {
      map.flyTo({
        center,
        zoom,
      });
    } else {
      map.jumpTo({
        center,
        zoom,
      });
    }
  };

  const setNewBounds = (bbox: [Longitude, Latitude, Longitude, Latitude]) => {
    setPadding();
    map.fitBounds(bbox, {
      padding: window.innerWidth * 0.05,
      animate: false,
    });
  };

  const clearHighlightedMountains = () =>
    (map.getSource(highlightedPointsLayerId) as any).setData(defaultGeoJsonPoint);

  const updateSource = (data: mapboxgl.GeoJSONSourceOptions['data']) =>
    (map.getSource(highlightedPointsLayerId) as any).setData(data);

  const clearMap = () => {
    if (mapLoaded) {
      clearHighlightedMountains();
    } else {
      const clearSourceOnLoad = () => {
        clearHighlightedMountains();
        map.off('load', clearSourceOnLoad);
      };
      map.on('load', clearSourceOnLoad);
    }
  };

  const setHighlightedPoints = (data: mapboxgl.GeoJSONSourceOptions['data']) => {
    if (mapLoaded) {
      updateSource(data);
    } else {
      const updateSourceOnLoad = () => {
        updateSource(data);
        map.off('load', updateSourceOnLoad);
      };
      map.on('load', updateSourceOnLoad);
    }
  };

  return {
    map, setNewCenter, setNewBounds, setHighlightedPoints, clearMap,
  };
};

export default initMap;
