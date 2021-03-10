const {point, lineString} = require('@turf/helpers');
const distance = require('@turf/distance').default;
const centroid = require('@turf/centroid').default;
const bboxPolygon = require('@turf/bbox-polygon').default;
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;
import { GetString } from 'fluent-react/compat';
import mapboxgl from 'mapbox-gl';
import {mapboxHoverPopupClassName} from '../../../../styling/GlobalStyles';
import {
  contentColumnIdeal,
  contentColumnMax,
  contentColumnMin,
} from '../../../../styling/Grid';
import {primaryColor} from '../../../../styling/styleUtils';
import {Coordinate, CoordinateWithElevation, Latitude, Longitude} from '../../../../types/graphQLTypes';
import {AggregateItem, CoreItem, MapItem} from '../../../../types/itemTypes';
import {mobileSize} from '../../../../Utils';
import {logoSmallWidth, logoSmallWindoWidth, sideContentWidth} from '../../navigation/Header';
import {Props as TooltipState} from '../tooltip';
import getHoverPopupHtml from '../tooltip/popup/getHoverPopupHtml';
import initInteractions from './interactions';
import initLayers, {
  defaultGeoJsonLineString,
  defaultGeoJsonPoint,
  defaultGeoJsonPolygon,
  highlightedPointsLayerId,
  highlightedRoadsLayerId,
  highlightedTrailsLayerId,
  hoveredPointLayerId,
  hoveredShapeLayerId,
  hoveredTrailsLayerId,
} from './layers';

// eslint-disable-next-line
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface Input {
  container: HTMLElement;
  push: (url: string) => void;
  getString: GetString;
  onTooltipOpen: (tooltipState: TooltipState) => void;
  onTooltipClose: () => void;
}

const getRectFromBounds = (bounds: mapboxgl.LngLatBounds): [Longitude, Latitude, Longitude, Latitude] => {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return [ne.lat, ne.lng, sw.lat, sw.lng];
};

export const defaultCenter: Coordinate = [-98.5795, 39.8283];

export interface Output {
  map: mapboxgl.Map;
  setNewCenter: (center: Coordinate, zoom: number) => void;
  setNewBounds: (bbox: [Longitude, Latitude, Longitude, Latitude]) => void;
  setHighlightedPoints: (data: mapboxgl.GeoJSONSourceOptions['data']) => void;
  setHoveredPrimitivePoints: (data: mapboxgl.GeoJSONSourceOptions['data']) => void;
  setHighlightedTrails: (data: mapboxgl.GeoJSONSourceOptions['data']) => void;
  setHighlightedRoads: (data: mapboxgl.GeoJSONSourceOptions['data']) => void;
  clearMap: () => void;
  clearHoveredPoints: () => void;
  setExternalHoveredPopup: (
    name: string,
    type: CoreItem | MapItem | AggregateItem,
    subtitle: string,
    coords: Coordinate,
    line?: Array<Coordinate | CoordinateWithElevation>,
    bbox?: [Longitude, Latitude, Longitude, Latitude],
  ) => void;
  clearExternalHoveredPopup: () => void;
}

const styles = {
  standard: 'mapbox://styles/wsoeltz/ckm1fn6qf8m0717qfqxf5ukpm',
  satellite: 'mapbox://styles/wsoeltz/ckit796241naz19qmbxe4gl2l',
};

const initMap = ({container, push, getString, onTooltipOpen, onTooltipClose}: Input): Output => {
  if (process.env.REACT_APP_MAPBOX_ACCESS_TOKEN) {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  }

  const map = new mapboxgl.Map({
    container,
    style: styles.standard, // stylesheet location
    center: defaultCenter, // starting position [lng, lat]
    zoom: 3.5, // starting zoom
    maxZoom: 15.5,
    customAttribution: [
      '<a href="https://wilderlist.app/about">© Wilderlist</a>',
      '<a href="https://www.wilderlist.app/terms-of-use">Terms of Use</a>',
      '<a href="https://www.wilderlist.app/privacy-policy">Privacy Policy</a><wbr />',
    ],
    logoPosition: 'bottom-right',
  });

  let mapLoaded = false;

  map.on('load', () => {
    mapLoaded = true;
    initLayers({map});
    initInteractions({map, push, getString, onTooltipOpen, onTooltipClose});
    // map.addSource('mapbox-dem', {
    // 'type': 'raster-dem',
    // 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    // 'tileSize': 512,
    // 'maxzoom': 16
    // });
    // map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
  });

  const setPadding = () => {
    const windowWidth = window.innerWidth;
    let left: number = windowWidth * (contentColumnIdeal / 100);
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
      bottom: windowWidth <= mobileSize ? window.innerHeight * 0.55 : 80,
      right,
    });
  };

  const setNewCenter = (center: Coordinate, zoom: number) => {
    setPadding();
    const {lat, lng} = map.getCenter();
    const dist = distance(point([lng, lat]), center, {units: 'miles'});
    const mapBounds = getRectFromBounds(map.getBounds());
    const isInBounds = booleanPointInPolygon(point(center), bboxPolygon(mapBounds));
    if ((isInBounds && dist < 30) || dist < 5) {
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
    const {lat, lng} = map.getCenter();
    const bboxAsPolygon = bboxPolygon(bbox);
    const bboxCenter = centroid(bboxAsPolygon);
    const mapCenter = point([lng, lat]);
    const mapCenterToBboxCenter = distance(mapCenter, bboxCenter, {units: 'miles'});
    const mapBounds = getRectFromBounds(map.getBounds());
    const isInBounds = booleanPointInPolygon(bboxCenter, bboxPolygon(mapBounds));
    const animate = (isInBounds && mapCenterToBboxCenter < 250) || mapCenterToBboxCenter < 50;
    map.fitBounds(bbox, {
      padding: window.innerWidth * 0.05,
      animate,
    });
  };

  const clearHighlightedPoints = () => {
    (map.getSource(highlightedPointsLayerId) as any).setData(defaultGeoJsonPoint);
    (map.getSource(highlightedTrailsLayerId) as any).setData(defaultGeoJsonLineString);
    (map.getSource(highlightedRoadsLayerId) as any).setData(defaultGeoJsonLineString);
  };

  const clearHoveredPrimitivePoints = () => {
    (map.getSource(hoveredPointLayerId) as any).setData(defaultGeoJsonPoint);
  };

  const updatePointsSource = (data: mapboxgl.GeoJSONSourceOptions['data']) =>
    (map.getSource(highlightedPointsLayerId) as any).setData(data);

  const updatePrimitiveHoverPointsSource = (data: mapboxgl.GeoJSONSourceOptions['data']) =>
    (map.getSource(hoveredPointLayerId) as any).setData(data);

  const updateTrailSource = (data: mapboxgl.GeoJSONSourceOptions['data']) =>
    (map.getSource(highlightedTrailsLayerId) as any).setData(data);

  const updateRoadSource = (data: mapboxgl.GeoJSONSourceOptions['data']) =>
    (map.getSource(highlightedRoadsLayerId) as any).setData(data);

  const clearMap = () => {
    if (mapLoaded) {
      clearHighlightedPoints();
    } else {
      const clearSourceOnLoad = () => {
        clearHighlightedPoints();
        map.off('load', clearSourceOnLoad);
      };
      map.on('load', clearSourceOnLoad);
    }
  };

  const setHighlightedPoints = (data: mapboxgl.GeoJSONSourceOptions['data']) => {
    if (mapLoaded) {
      updatePointsSource(data);
    } else {
      const updatePointsSourceOnLoad = () => {
        updatePointsSource(data);
        map.off('load', updatePointsSourceOnLoad);
      };
      map.on('load', updatePointsSourceOnLoad);
    }
  };

  const setHoveredPrimitivePoints = (data: mapboxgl.GeoJSONSourceOptions['data']) => {
    if (mapLoaded) {
      updatePrimitiveHoverPointsSource(data);
    } else {
      const updatePointsSourceOnLoad = () => {
        updatePrimitiveHoverPointsSource(data);
        map.off('load', updatePointsSourceOnLoad);
      };
      map.on('load', updatePointsSourceOnLoad);
    }
  };

  const clearHoveredPoints = () => {
    if (mapLoaded) {
      clearHoveredPrimitivePoints();
    } else {
      const clearSourceOnLoad = () => {
        clearHoveredPrimitivePoints();
        map.off('load', clearSourceOnLoad);
      };
      map.on('load', clearSourceOnLoad);
    }
  };

  const setHighlightedTrails = (data: mapboxgl.GeoJSONSourceOptions['data']) => {
    if (mapLoaded) {
      updateTrailSource(data);
    } else {
      const updateTrailSourceOnLoad = () => {
        updateTrailSource(data);
        map.off('load', updateTrailSourceOnLoad);
      };
      map.on('load', updateTrailSourceOnLoad);
    }
  };

  const setHighlightedRoads = (data: mapboxgl.GeoJSONSourceOptions['data']) => {
    if (mapLoaded) {
      updateRoadSource(data);
    } else {
      const updateRoadSourceOnLoad = () => {
        updateRoadSource(data);
        map.off('load', updateRoadSourceOnLoad);
      };
      map.on('load', updateRoadSourceOnLoad);
    }
  };

  // Create a popup, but don't add it to the map yet.
  const externalHoverPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: [0, -20],
    className: mapboxHoverPopupClassName,
  });

  const setExternalHoveredPopup = (
    name: string,
    type: CoreItem | MapItem | AggregateItem,
    subtitle: string,
    coords: Coordinate,
    line?: Array<Coordinate | CoordinateWithElevation>,
    bbox?: [Longitude, Latitude, Longitude, Latitude],
  ) => {
    if (mapLoaded) {
      if (!bbox) {
        externalHoverPopup.setLngLat(coords).setHTML(getHoverPopupHtml(name, subtitle, type)).addTo(map);
        if (line) {
          (map.getSource(hoveredTrailsLayerId) as any).setData(lineString(line, {color: primaryColor}));
        }
      } else {
        if (map.getZoom() < 10) {
          externalHoverPopup.setLngLat(coords).setHTML(getHoverPopupHtml(name, subtitle, type)).addTo(map);
          (map.getSource(hoveredShapeLayerId) as any).setData(bboxPolygon(bbox));
        }
      }
    }
  };
  const clearExternalHoveredPopup = () => {
    externalHoverPopup.remove();
    if (mapLoaded) {
      (map.getSource(hoveredTrailsLayerId) as any).setData(defaultGeoJsonLineString);
      (map.getSource(hoveredShapeLayerId) as any).setData(defaultGeoJsonPolygon);
    }
  };

  return {
    map, setNewCenter, setNewBounds, setHighlightedPoints, clearMap, setHighlightedTrails,
    setHighlightedRoads, setExternalHoveredPopup, clearExternalHoveredPopup, setHoveredPrimitivePoints,
    clearHoveredPoints,
  };
};

export default initMap;
