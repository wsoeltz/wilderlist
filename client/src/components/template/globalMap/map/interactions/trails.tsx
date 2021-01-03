import React from 'react';
import {Coordinate} from '../../../../../types/graphQLTypes';
import {
  Id,
  ItemType,
} from './index';
import {
  addClickedPopup,
} from './popup';
import ClickedPopup from './popup/ClickedPopup';

interface Input {
  map: mapboxgl.Map;
  push: (url: string) => void;
  setHovered: (id: Id, type: ItemType | undefined) => void;
  getHovered: () => ({id: Id, type: ItemType | undefined});
}

const trailInteractions = (input: Input) => {
  const {map, push, setHovered, getHovered} = input;
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'trails-background', function(e) {
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

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'trails-background', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    const type = getHovered().type;
    if ((type === undefined || type === ItemType.trail) && e && e.features && e.features.length > 0) {
      setHovered(e.features[0].id, ItemType.trail);
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'trails',
          id: getHovered().id,
        },
        { hover: true },
      );
    }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'trails-background', function() {
    const hoveredTrail = getHovered();
    if (hoveredTrail.id && hoveredTrail.type === ItemType.trail) {
      map.getCanvas().style.cursor = '';
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'trails',
          id: hoveredTrail.id,
        },
        { hover: false },
      );
      setHovered(undefined, undefined);
    }
  });

};

export default trailInteractions;
