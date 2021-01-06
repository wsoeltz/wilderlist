import { GetString } from 'fluent-react/compat';
import React from 'react';
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
  getString: GetString;
}

const mountainInteractions = (input: Input) => {
  const {
    map, push, setHovered, getHovered, getString,
  } = input;
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'mountains', function(e) {
    const layerId = e && e.features && e.features[0] ? e.features[0].id : undefined;
    if (layerId === getHovered().id) {
      const coordinates = e && e.features && e.features[0] && e.features[0].geometry
        ? (e.features[0].geometry as any).coordinates.slice() : [e.lngLat.lng, e.lngLat.lat];
      const name = e && e.features && e.features[0]
        ? (e.features[0].properties as any).name : '';
      const elevation = e && e.features && e.features[0]
        ? (e.features[0].properties as any).ele + 'ft' : '';
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
          subtitle={elevation}
          id={id}
          push={push}
          itemType={ItemType.mountain}
          getString={getString}
          location={coordinates}
        />, coordinates, map);
    }
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'mountains', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    if (e && e.features && e.features.length > 0) {
      setHovered(e.features[0].id, ItemType.mountain);
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'mountains',
          id: getHovered().id,
        },
        { hover: true },
      );
    }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'mountains', function() {
    const hoveredMountain = getHovered();
    if (hoveredMountain.type === ItemType.mountain && hoveredMountain.id) {
      map.getCanvas().style.cursor = '';
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'mountains',
          id: hoveredMountain.id,
        },
        { hover: false },
      );
      setHovered(undefined, undefined);
    }
  });

};

export default mountainInteractions;
