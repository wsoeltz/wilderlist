export const highlightedMountainsLayerId = 'temporary-highlight-mountains-layer-id';
export const highlightedCampsitesLayerId = 'temporary-highlight-campsites-layer-id';
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
        'text-halo-color': '#ffffff',
        'text-halo-width': 2,
        'text-color': '#242a1d',
        'text-opacity': ['step', ['zoom'], 0, 10, 1],
    },
  });
};

export default initLayers;
