import mapboxgl from 'mapbox-gl';
import {CoreItems} from '../../../../../types/itemTypes';
import {CallbackInput, Props as TooltipState} from '../../tooltip';
import {highlightedPointsLayerId} from '../layers';

interface Input {
  map: mapboxgl.Map;
  onTooltipOpen: (tooltipState: TooltipState) => void;
  onTooltipClose: () => void;
  getTooltipCallback: () => undefined | ((input: CallbackInput) => void);
  getHighlightedGeojsonData: () => {
    highlightedPointsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined,
    highlightedTrailsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined,
    highlightedRoadsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined,
  };
}

const mountainInteractions = (input: Input) => {
  const {
    map, onTooltipOpen, onTooltipClose, getTooltipCallback, getHighlightedGeojsonData,
  } = input;
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', highlightedPointsLayerId, function(e) {

      const itemType: CoreItems | null = e && e.features && e.features[0]
        ? (e.features[0].properties as any).itemType : null;

      if (itemType) {
        const coordinates = e && e.features && e.features[0] && e.features[0].geometry
          ? (e.features[0].geometry as any).coordinates.slice() : [e.lngLat.lng, e.lngLat.lat];
        const name = e && e.features && e.features[0]
          ? (e.features[0].properties as any).name : '';
        const id = e && e.features && e.features[0]
          ? (e.features[0].properties as any).id : '';

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const existingPopup = document.getElementsByClassName('mapboxgl-popup');
        if ( existingPopup.length ) {
          existingPopup[0].remove();
      }

        const popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML('<div id="mapboxgl-tooltip"></div>')
        .addTo(map);

        const removeFromMap = () => popup.remove();

        popup.on('close', onTooltipClose);

        setTimeout(() => {
        const node = document.getElementById('mapboxgl-tooltip');
        if (node) {
          onTooltipOpen({
            node,
            item: itemType,
            id,
            name,
            location: coordinates,
            closePopup: removeFromMap,
            callback: getTooltipCallback(),
            highlighted: true,
            ...getHighlightedGeojsonData(),
          });
        }
      }, 0);
    }
  });

  let hoveredId: string | undefined;
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mousemove', highlightedPointsLayerId, function(e) {
    map.getCanvas().style.cursor = 'pointer';
    if (e && e.features && e.features.length > 0) {
      hoveredId = e.features[0].id as string;
      map.setFeatureState(
        {
          source: highlightedPointsLayerId,
          id: hoveredId,
        },
        { hover: true },
      );
    }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', highlightedPointsLayerId, function() {
    map.getCanvas().style.cursor = '';
    map.setFeatureState(
      {
        source: highlightedPointsLayerId,
        id: hoveredId,
      },
      { hover: false },
    );
    hoveredId = undefined;
  });
};

export default mountainInteractions;
