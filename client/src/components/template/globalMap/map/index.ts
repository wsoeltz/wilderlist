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
  setHighlightedMountains: (data: mapboxgl.GeoJSONSourceOptions['data']) => void;
  clearMap: () => void;
}

const highlightedMountainsLayerId = 'temporary-highlight-mountains-layer-id';
const defaultGeoJsonPoint: mapboxgl.GeoJSONSourceOptions['data'] = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [],
  },
};

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

  let mapLoaded = false;

  map.on('load', () => {
    mapLoaded = true;
    map.addSource(highlightedMountainsLayerId, {
      type: 'geojson',
      data: defaultGeoJsonPoint,
    });
    map.addLayer({
      id: highlightedMountainsLayerId,
      type: 'symbol',
      source: highlightedMountainsLayerId,
        layout: {
          'text-optional': true,
          'text-size': [
              'interpolate',
              ['exponential', 0.81],
              ['zoom'],
              0,
              6,
              22,
              11,
          ],
          'icon-image': ['get', 'icon'],
          'text-font': [
              'Source Sans Pro Regular',
              'Arial Unicode MS Regular',
          ],
          'text-padding': 10,
          'text-offset': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              ['literal', [0, 1.1]],
              22,
              ['literal', [0, 1.25]],
          ],
          'icon-size': [
              'interpolate',
              ['exponential', 0.96],
              ['zoom'],
              0,
              0.2,
              22,
              1,
          ],
          'text-anchor': 'top',
          'text-field': [
              'step',
              ['zoom'],
              ['get', 'name'],
              12,
              [
                  'concat',
                  ['get', 'name'],
                  '\n',
                  ['to-string', ['get', 'elevation']],
                  'ft',
              ],
          ],
          'text-letter-spacing': 0.04,
          'icon-padding': 25,
          'icon-allow-overlap': true,
          'text-allow-overlap': false,
          'text-max-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              7.5,
              22,
              10,
          ],
      },
      paint: {
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
          'text-color': '#242a1d',
          'text-opacity': ['step', ['zoom'], 0, 10, 1],
      },
    });
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

  const clearHighlightedMountains = () =>
    (map.getSource(highlightedMountainsLayerId) as any).setData(defaultGeoJsonPoint);

  const updateSource = (data: mapboxgl.GeoJSONSourceOptions['data']) =>
    (map.getSource(highlightedMountainsLayerId) as any).setData(data);

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

  const setHighlightedMountains = (data: mapboxgl.GeoJSONSourceOptions['data']) => {
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
    map, setNewCenter, setNewBounds, setHighlightedMountains, clearMap,
  };
};

export default initMap;
