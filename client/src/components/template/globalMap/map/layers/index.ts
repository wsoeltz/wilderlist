import mapboxgl from 'mapbox-gl';
import {MapStyle} from '../';
import {primaryColor} from '../../../../../styling/styleUtils';

export const highlightedPointsLayerId = 'temporary-highlight-mountains-layer-id';
export const defaultGeoJsonPoint: mapboxgl.GeoJSONSourceOptions['data'] = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [],
  },
};

export const hoveredShapeLayerId = 'temporary-highlight-shape-layer-id';
export const hoveredPointLayerId = 'temporary-hovered-point-layer-id';
export const trailMileMarkerPointsLayerId = 'temporary-trail-mile-marker-points-layer-id';
export const roadMileMarkerPointsLayerId = 'temporary-road-mile-marker-points-layer-id';

export const highlightedTrailsLayerId = 'temporary-highlight-trails-layer-id';
const highlightedTrailsLayerTopId = 'temporary-highlight-trails-top-layer-id';

export const highlightedTrailMileageLayerId = 'temporary-highlight-trail-mileage-layer-id';
export const highlightedRoadMileageLayerId = 'temporary-highlight-road-mileage-layer-id';

export const hoveredTrailsLayerId = 'temporary-hovered-trails-layer-id';
const hoveredTrailsLayerTopId = 'temporary-hovered-trails-top-layer-id';

export const highlightedRoadsLayerId = 'temporary-highlight-roads-layer-id';
const highlightedRoadsLayerTopId = 'temporary-highlight-roads-top-layer-id';

export const hoveredRoadsLayerId = 'temporary-hovered-roads-layer-id';
const hoveredRoadsLayerTopId = 'temporary-hovered-roads-top-layer-id';

export const defaultGeoJsonLineString: mapboxgl.GeoJSONSourceOptions['data'] = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [],
  },
};

export const defaultGeoJsonPolygon: mapboxgl.GeoJSONSourceOptions['data'] = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [],
  },
};

interface Input {
  map: mapboxgl.Map;
  style: MapStyle;
}

const initLayers = ({map, style}: Input) => {
  const textHaloColor = style === MapStyle.satellite ? 'rgba(0, 0, 0, 0.25)' : 'hsla(0, 0%, 100%, 0.77)';
  const hoveredTextHaloColor = style === MapStyle.satellite ? '#206ca6' : 'hsla(0, 0%, 100%, 0.77)';
  const hoveredHighlightedTextColor = style === MapStyle.satellite ? '#fff' : '#206ca6';
  const highlightedTextColor = style === MapStyle.satellite ? '#fff' : '#5b6151';

  map.addSource(highlightedPointsLayerId, {
    type: 'geojson',
    data: defaultGeoJsonPoint,
  });
  map.addLayer({
    id: highlightedPointsLayerId,
    type: 'symbol',
    source: highlightedPointsLayerId,
      layout: {
        'text-optional': true,
        'text-size': [
            'interpolate',
            ['exponential', 0.81],
            ['zoom'],
            0,
            6,
            22,
            12,
        ],
        'icon-image': ['get', 'icon'],
        'text-font': [
          'Source Sans Pro Bold',
          'Arial Unicode MS Regular',
        ],
        'text-padding': 0,
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
            'concat',
            ['get', 'name'],
            '\n',
            ['get', 'subtitle'],
        ],
        'text-letter-spacing': 0.04,
        'icon-padding': 0,
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
        'text-halo-color': [
          'case',
          [
            'boolean',
            [
              'feature-state',
              'hover',
            ],
            false,
          ],
          hoveredTextHaloColor,
          textHaloColor,
        ],
        'text-halo-width': 0.4,
        'text-color': [
          'case',
          [
            'boolean',
            [
              'feature-state',
              'hover',
            ],
            false,
          ],
          hoveredHighlightedTextColor,
          highlightedTextColor,
        ],
        'text-opacity': ['step', ['zoom'], 0, 12, 1],
    },
  });

  map.addSource(highlightedRoadsLayerId, {
    type: 'geojson',
    data: defaultGeoJsonLineString,
  });
  map.addLayer({
    id: highlightedRoadsLayerId,
    type: 'line',
    source: highlightedRoadsLayerId,
    layout: {
      'line-join': 'round',
      'line-round-limit': 2,
      'line-cap': 'round',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': [
          'interpolate',
          ['exponential', 1.96],
          ['zoom'],
          // ZOOM, VALUE
          0, 1.25,
          9.65, 1.5,
          11.5, 3.75,
          13, 7,
          22, 10,
      ],
      'line-opacity': 1,
    },
  }, 'admin-1-boundary-bg');
  map.addLayer({
    id: highlightedRoadsLayerTopId,
    type: 'line',
    source: highlightedRoadsLayerId,
    layout: {'line-join': 'round', 'line-cap': 'round'},
    paint: {
        'line-width': [
          'interpolate',
          ['exponential', 1.96],
          ['zoom'],
          0, 0.75,
          9.65, 0.75,
          11.5, 2,
          13, 4,
          22, 6,
        ],
        'line-dasharray': [2.5, 1.35],
        'line-color': '#ffffff',
        'line-opacity': 0.75,
    },
  }, 'admin-1-boundary-bg');

  map.addSource(hoveredRoadsLayerId, {
    type: 'geojson',
    data: defaultGeoJsonLineString,
  });
  map.addLayer({
    id: hoveredRoadsLayerId,
    type: 'line',
    source: hoveredRoadsLayerId,
    layout: {
      'line-join': 'round',
      'line-round-limit': 2,
      'line-cap': 'round',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': [
          'interpolate',
          ['exponential', 1.96],
          ['zoom'],
          // ZOOM, VALUE
          0, 1.25,
          9.65, 1.5,
          11.5, 3.75,
          13, 7,
          22, 10,
      ],
      'line-opacity': 1,
    },
  }, 'admin-1-boundary-bg');
  map.addLayer({
    id: hoveredRoadsLayerTopId,
    type: 'line',
    source: hoveredRoadsLayerId,
    layout: {'line-join': 'round', 'line-cap': 'round'},
    paint: {
        'line-width': [
          'interpolate',
          ['exponential', 1.96],
          ['zoom'],
          0, 0.75,
          9.65, 0.75,
          11.5, 2,
          13, 4,
          22, 6,
        ],
        'line-dasharray': [2.5, 1.35],
        'line-color': '#ffffff',
        'line-opacity': 0.75,
    },
  }, 'admin-1-boundary-bg');

  map.addSource(highlightedTrailsLayerId, {
    type: 'geojson',
    data: defaultGeoJsonLineString,
  });
  map.addLayer({
    id: highlightedTrailsLayerId,
    type: 'line',
    source: highlightedTrailsLayerId,
    layout: {
      'line-join': 'round',
      'line-round-limit': 2,
      'line-cap': 'round',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': [
          'interpolate',
          ['exponential', 1.96],
          ['zoom'],
          // ZOOM, VALUE
          0, 1.25,
          9.65, 1.5,
          11.5, 3.75,
          13, 7,
          22, 10,
      ],
      'line-opacity': 1,
    },
  }, 'admin-1-boundary-bg');
  map.addLayer({
    id: highlightedTrailsLayerTopId,
    type: 'line',
    source: highlightedTrailsLayerId,
    layout: {'line-join': 'round', 'line-cap': 'round'},
    paint: {
        'line-width': [
          'step', ['zoom'],
          0,
          12, 2.5,
          22, 4,
        ],
        'line-dasharray': [
            'step',
            ['zoom'],
            ['literal', [1, 0]],
            7.5,
            ['literal', [3, 7]],
        ],
        'line-color': '#eeeeec',
        'line-translate': [0, 0],
    },
  }, 'admin-1-boundary-bg');

  map.addSource(hoveredTrailsLayerId, {
    type: 'geojson',
    data: defaultGeoJsonLineString,
  });
  map.addLayer({
    id: hoveredTrailsLayerId,
    type: 'line',
    source: hoveredTrailsLayerId,
    layout: {
      'line-join': 'round',
      'line-round-limit': 2,
      'line-cap': 'round',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': [
          'interpolate',
          ['exponential', 1.96],
          ['zoom'],
          // ZOOM, VALUE
          0, 1.25,
          9.65, 1.5,
          11.5, 3.75,
          13, 7,
          22, 10,
      ],
      'line-opacity': 1,
    },
  }, 'admin-1-boundary-bg');
  map.addLayer({
    id: hoveredTrailsLayerTopId,
    type: 'line',
    source: hoveredTrailsLayerId,
    layout: {'line-join': 'round', 'line-cap': 'round'},
    paint: {
        'line-width': [
          'step', ['zoom'],
          0,
          12, 2.5,
          22, 4,
        ],
        'line-dasharray': [
            'step',
            ['zoom'],
            ['literal', [1, 0]],
            7.5,
            ['literal', [3, 7]],
        ],
        'line-color': '#eeeeec',
        'line-translate': [0, 0],
    },
  }, 'admin-1-boundary-bg');

  map.addSource(hoveredShapeLayerId, {
    type: 'geojson',
    data: defaultGeoJsonPolygon,
  });
  map.addLayer({
    id: hoveredShapeLayerId,
    type: 'fill',
    source: hoveredShapeLayerId,
    paint: {
      'fill-color': primaryColor,
      'fill-opacity': 0.2,
      },
  });

  map.addSource(hoveredPointLayerId, {
    type: 'geojson',
    data: defaultGeoJsonPoint,
  });
  map.addLayer({
    id: hoveredPointLayerId,
    type: 'circle',
    source: hoveredPointLayerId,
    paint: {
      'circle-color': '#fff',
      'circle-stroke-color': primaryColor,
      'circle-stroke-width': [
          'interpolate',
          ['linear', 1.96],
          ['zoom'],
          0, 1,
          22, 5,
        ],
      'circle-radius': [
          'interpolate',
          ['linear', 1.96],
          ['zoom'],
          0, 1,
          22, 8,
        ],
      },
  });

  map.addSource(trailMileMarkerPointsLayerId, {
    type: 'geojson',
    data: defaultGeoJsonPoint,
  });
  map.addLayer({
    id: trailMileMarkerPointsLayerId,
    type: 'circle',
    source: trailMileMarkerPointsLayerId,
    minzoom: 12,
    paint: {
      'circle-color': '#fff',
      'circle-stroke-color': primaryColor,
      'circle-stroke-width': [
          'interpolate',
          ['linear', 1.96],
          ['zoom'],
          0, 0.75,
          22, 4,
        ],
      'circle-radius': [
          'interpolate',
          ['linear', 1.96],
          ['zoom'],
          0, 0.75,
          22, 6.5,
        ],
      },
  }, 'campsites');

  map.addSource(roadMileMarkerPointsLayerId, {
    type: 'geojson',
    data: defaultGeoJsonPoint,
  });
  map.addLayer({
    id: roadMileMarkerPointsLayerId,
    type: 'circle',
    source: roadMileMarkerPointsLayerId,
    minzoom: 12,
    paint: {
      'circle-color': '#fff',
      'circle-stroke-color': primaryColor,
      'circle-stroke-width': [
          'interpolate',
          ['linear', 1.96],
          ['zoom'],
          0, 0.75,
          22, 4,
        ],
      'circle-radius': [
          'interpolate',
          ['linear', 1.96],
          ['zoom'],
          0, 0.75,
          22, 6.5,
        ],
      },
  }, 'campsites');

  map.addSource(highlightedRoadMileageLayerId, {
    type: 'geojson',
    data: defaultGeoJsonLineString,
  });
  map.addLayer({
    id: highlightedRoadMileageLayerId,
    type: 'symbol',
    source: highlightedRoadMileageLayerId,
    minzoom: 12,
    layout: {
      'text-size': 12,
      'text-font': [
        'Source Sans Pro Bold',
        'Arial Unicode MS Regular',
      ],
      'text-field': ['to-string', ['get', 'trailLengthText']],
      'text-letter-spacing': 0.04,
      'text-anchor': 'center',
      'text-rotation-alignment': 'map',
      'text-padding': 0,
      'text-offset': [0, -1],
      'text-rotate': ['get', 'textAngle'],
      'text-allow-overlap': true,
    },
    paint: {
      'text-halo-color': '#ffffff',
      'text-halo-width': 1,
      'text-halo-blur': 0.1,
      'text-color': primaryColor,
    },
  });

  map.addSource(highlightedTrailMileageLayerId, {
    type: 'geojson',
    data: defaultGeoJsonLineString,
  });
  map.addLayer({
    id: highlightedTrailMileageLayerId,
    type: 'symbol',
    source: highlightedTrailMileageLayerId,
    minzoom: 12,
    layout: {
      'text-size': 12,
      'text-font': [
        'Source Sans Pro Bold',
        'Arial Unicode MS Regular',
      ],
      'text-field': ['to-string', ['get', 'trailLengthText']],
      'text-letter-spacing': 0.04,
      'text-anchor': 'center',
      'text-rotation-alignment': 'map',
      'text-padding': 0,
      'text-offset': [0, -1],
      'text-rotate': ['get', 'textAngle'],
      'text-allow-overlap': true,
    },
    paint: {
      'text-halo-color': textHaloColor,
      'text-halo-width': 1,
      'text-halo-blur': 0.1,
      'text-color': hoveredHighlightedTextColor,
    },
  });

};

export default initLayers;
