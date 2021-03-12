const {point, lineString} = require('@turf/helpers');
const distance = require('@turf/distance').default;
const centroid = require('@turf/centroid').default;
const bboxPolygon = require('@turf/bbox-polygon').default;
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;
import { GetString } from 'fluent-react/compat';
import mapboxgl from 'mapbox-gl';
import SunCalc from 'suncalc';
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

export enum MapStyle {
  standard = 'standard',
  satellite = 'satellite',
}

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
  setBaseMap: (style: MapStyle) => void;
  toggle3dTerrain: () => boolean;
}

const styles = {
  [MapStyle.standard]: 'mapbox://styles/wsoeltz/ckm1fn6qf8m0717qfqxf5ukpm',
  [MapStyle.satellite]: 'mapbox://styles/wsoeltz/ckit796241naz19qmbxe4gl2l',
};

export const storageCheckedKeyId = 'localstorageKeyForGlobalMapBaseStyle';
const initialStyle = localStorage.getItem(storageCheckedKeyId);

let highlightedPointsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
let highlightedTrailsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
let highlightedRoadsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
let is3dModeOn: boolean = false;

const initMap = ({container, push, getString, onTooltipOpen, onTooltipClose}: Input): Output => {
  if (process.env.REACT_APP_MAPBOX_ACCESS_TOKEN) {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  }

  const map = new mapboxgl.Map({
    container,
    style: initialStyle === MapStyle.standard || initialStyle === MapStyle.satellite
      ? styles[initialStyle] : styles[MapStyle.standard],
    center: defaultCenter, // starting position [lng, lat]
    zoom: 3.5, // starting zoom
    maxZoom: 15.5,
    customAttribution: [
      '<a href="https://wilderlist.app/about">© Wilderlist</a>',
      '<a href="https://www.wilderlist.app/terms-of-use">Terms of Use</a>',
      '<a href="https://www.wilderlist.app/privacy-policy">Privacy Policy</a><wbr />',
    ],
  });

  let mapLoaded = false;

  map.on('load', () => {
    mapLoaded = true;
    initInteractions({map, push, getString, onTooltipOpen, onTooltipClose});
  });

  map.on('style.load', function() {
    // Triggered when `setStyle` is called.
    const newStyle = localStorage.getItem(storageCheckedKeyId);
    const style: MapStyle = newStyle && (newStyle === MapStyle.standard || initialStyle === MapStyle.satellite)
      ? newStyle as MapStyle : MapStyle.standard;

    initLayers({map, style});
    if (highlightedPointsGeojson) {
      setHighlightedPoints(highlightedPointsGeojson);
    }
    if (highlightedTrailsGeojson) {
      setHighlightedTrails(highlightedTrailsGeojson);
    }
    if (highlightedRoadsGeojson) {
      setHighlightedRoads(highlightedRoadsGeojson);
    }
    if (is3dModeOn) {
      is3dModeOn = false;
      toggle3dTerrain();
    }
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
    highlightedPointsGeojson = undefined;
    highlightedTrailsGeojson = undefined;
    highlightedRoadsGeojson = undefined;
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

  function setHighlightedPoints(data: mapboxgl.GeoJSONSourceOptions['data']) {
    highlightedPointsGeojson = data;
    if (mapLoaded) {
      updatePointsSource(data);
    } else {
      const updatePointsSourceOnLoad = () => {
        updatePointsSource(data);
        map.off('load', updatePointsSourceOnLoad);
      };
      map.on('load', updatePointsSourceOnLoad);
    }
  }

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

  function setHighlightedTrails(data: mapboxgl.GeoJSONSourceOptions['data']) {
    highlightedTrailsGeojson = data;
    if (mapLoaded) {
      updateTrailSource(data);
    } else {
      const updateTrailSourceOnLoad = () => {
        updateTrailSource(data);
        map.off('load', updateTrailSourceOnLoad);
      };
      map.on('load', updateTrailSourceOnLoad);
    }
  }

  function setHighlightedRoads(data: mapboxgl.GeoJSONSourceOptions['data']) {
    highlightedRoadsGeojson = data;
    if (mapLoaded) {
      updateRoadSource(data);
    } else {
      const updateRoadSourceOnLoad = () => {
        updateRoadSource(data);
        map.off('load', updateRoadSourceOnLoad);
      };
      map.on('load', updateRoadSourceOnLoad);
    }
  }

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

  const setBaseMap = (style: MapStyle) => {
    if (mapLoaded && (style === MapStyle.standard || style === MapStyle.satellite)) {
      map.setStyle(styles[style]);
      localStorage.setItem(storageCheckedKeyId, style);
    }
  };

  function toggle3dTerrain() {
    if (!is3dModeOn) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 16,
      });
      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      // add a sky layer that will show when the map is highly pitched
      const {lat, lng} = map.getCenter();
      const sunPos = SunCalc.getPosition(new Date(), lat, lng);
      const sunAzimuth = 180 + (sunPos.azimuth * 180) / Math.PI;
      const sunAltitude = 90 - (sunPos.altitude * 180) / Math.PI;
      map.addLayer({
          id: 'sky',
          type: 'sky' as any,
          paint: {
          ['sky-type' as any]: 'atmosphere',
          ['sky-atmosphere-sun' as any]: [sunAzimuth, sunAltitude],
          ['sky-atmosphere-sun-intensity' as any]: 15,
        },
      });
      if (!map.getPitch()) {
        map.flyTo({
          pitch: 75,
        });
      }
      is3dModeOn = true;
    } else {
      map.removeLayer('sky');
      map.setTerrain(null);
      map.removeSource('mapbox-dem');
      if (map.getPitch()) {
        map.flyTo({
          pitch: 0,
        });
      }
      is3dModeOn = false;
    }
    return is3dModeOn;
  }

  return {
    map, setNewCenter, setNewBounds, setHighlightedPoints, clearMap, setHighlightedTrails,
    setHighlightedRoads, setExternalHoveredPopup, clearExternalHoveredPopup, setHoveredPrimitivePoints,
    clearHoveredPoints, setBaseMap, toggle3dTerrain,
  };
};

export default initMap;
