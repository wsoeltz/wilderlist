import mapboxgl from 'mapbox-gl';

interface Input {
  map: mapboxgl.Map;
  data: any;
  maxValue: number;
}

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
            0.2, '#e9ffff',
            0.4, '#b0dbe4',
            0.6, '#7ab7ce',
            0.8, '#4992bb',
            1, '#206ca6',
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
    'admin-1-boundary-bg',
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
