export const highlightedPointsLayerId = 'temporary-highlight-mountains-layer-id';
export const defaultGeoJsonPoint: mapboxgl.GeoJSONSourceOptions['data'] = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [],
  },
};

interface Input {
  map: mapboxgl.Map;
}

const initLayers = ({map}: Input) => {
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
        'text-halo-color': 'hsla(0, 0%, 100%, 0.77)',
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
          '#206ca6',
          '#5b6151',
        ],
        'text-opacity': ['step', ['zoom'], 0, 12, 1],
    },
  });
};

export default initLayers;
