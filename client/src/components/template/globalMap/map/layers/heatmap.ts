import mapboxgl from 'mapbox-gl';

interface Input {
  map: mapboxgl.Map;
  data: any;
  maxValue: number;
}

export const heatmapColorScheme = [
  '#e9ffff',
  '#b0dbe4',
  '#7ab7ce',
  '#4992bb',
  '#206ca6',
];

const heatMapSourceLayerId = 'your-data-heatmap-layer-id';

export const addHeatmap = ({map, data, maxValue}: Input) => {
  try {
    map.addSource(heatMapSourceLayerId, {
      type: 'geojson',
      data,
    });
    map.addLayer(
      {
        id: heatMapSourceLayerId,
        type: 'heatmap',
        source: heatMapSourceLayerId,
          paint: {
          'heatmap-weight': [
          'interpolate',
          ['linear'],
            ['get', 'weight'],
              0, 0,
              10, 1,
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
              0, 1,
              9, 3,
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, heatmapColorScheme[0],
            0.4, heatmapColorScheme[1],
            0.6, heatmapColorScheme[2],
            0.8, heatmapColorScheme[3],
            1, heatmapColorScheme[4],
          ],
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            0, [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                0, 0,
                maxValue, 1,
            ],
            9, [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                0, 4,
                maxValue, 15,
            ],
            12, [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                0, 10,
                maxValue, 35,
            ],
            15, [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                0, 20,
                maxValue, 55,
            ],
          ],
        },
      },
    'temporary-hovered-trails-layer-id',
    );
  } catch (err) {
    console.error(err);
  }
};

export const removeHeatmap = (map: mapboxgl.Map) => {
  if (map.getLayer(heatMapSourceLayerId)) {
    map.removeLayer(heatMapSourceLayerId);
  }
  if (map.getSource(heatMapSourceLayerId)) {
    map.removeSource(heatMapSourceLayerId);
  }
};
