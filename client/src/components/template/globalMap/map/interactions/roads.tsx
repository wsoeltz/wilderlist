import React from 'react';
import {Coordinate} from '../../../../../types/graphQLTypes';
import {
  addClickedPopup,
} from './popup';
import ClickedPopup from './popup/ClickedPopup';

interface Input {
  map: mapboxgl.Map;
  push: (url: string) => void;
}

const roadInteractions = (input: Input) => {
  const {map, push} = input;
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'roads-background', function(e) {
    const coordinates: Coordinate = [e.lngLat.lng, e.lngLat.lat];
    const name = e && e.features && e.features[0]
      ? (e.features[0].properties as any).name : '';
    const type = e && e.features && e.features[0]
      ? (e.features[0].properties as any).type : '';
    const id = e && e.features && e.features[0]
      ? (e.features[0].properties as any).id : '';

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    addClickedPopup(
      <ClickedPopup
        title={name}
        subtitle={type}
        id={id}
        push={push}
      />, coordinates, map);
  });

  let hoveredRoadId: string | number | undefined | null = null;
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'roads-background', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    if (e && e.features && e.features.length > 0) {
      hoveredRoadId = e.features[0].id;
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'roads',
          id: hoveredRoadId,
        },
        { hover: true },
      );
    }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'roads-background', function() {
    map.getCanvas().style.cursor = '';
    if (hoveredRoadId) {
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'roads',
          id: hoveredRoadId,
        },
        { hover: false },
      );
      hoveredRoadId = null;
    }
  });

};

export default roadInteractions;
