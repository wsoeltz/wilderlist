import mapboxgl from 'mapbox-gl';
import React from 'react';
import addPopup, {ClickedPopup} from './addPopup';

interface Input {
  map: mapboxgl.Map;
  push: (url: string) => void;
}

const initInteractions = ({map, push}: Input) => {
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'mountains', function(e) {
  const coordinates = e && e.features && e.features[0] && e.features[0].geometry
    ? (e.features[0].geometry as any).coordinates.slice() : [0, 0];
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

  addPopup(
    <ClickedPopup
      name={name}
      id={id}
      push={push}
    />, coordinates, map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'mountains', function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'mountains', function() {
    map.getCanvas().style.cursor = '';
  });
};

export default initInteractions;
