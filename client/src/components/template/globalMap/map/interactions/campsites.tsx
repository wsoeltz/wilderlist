import { GetString } from 'fluent-react/compat';
import React from 'react';
import {
  Id,
  ItemType,
} from './index';
import {
  createClickedPopup,
} from './popup';
import ClickedPopup from './popup/ClickedPopup';

interface Input {
  map: mapboxgl.Map;
  push: (url: string) => void;
  setHovered: (id: Id, type: ItemType | undefined) => void;
  getHovered: () => ({id: Id, type: ItemType | undefined});
  getString: GetString;
}

const campiteInteractions = (input: Input) => {
  const {
    map, push, setHovered, getHovered, getString,
  } = input;
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'campsites', function(e) {
    const layerId = e && e.features && e.features[0] ? e.features[0].id : undefined;
    if (layerId === getHovered().id) {
      const coordinates = e && e.features && e.features[0] && e.features[0].geometry
        ? (e.features[0].geometry as any).coordinates.slice() : [e.lngLat.lng, e.lngLat.lat];
      const name = e && e.features && e.features[0]
        ? (e.features[0].properties as any).name : null;
      const id = e && e.features && e.features[0]
        ? (e.features[0].properties as any).id : null;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const {addToMap, removeFromMap} = createClickedPopup();
      addToMap(
        <ClickedPopup
          name={name}
          id={id}
          push={push}
          itemType={ItemType.campsite}
          getString={getString}
          location={coordinates}
          close={removeFromMap}
        />, coordinates, map);
    }
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'campsites', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    if (e && e.features && e.features.length > 0) {
      setHovered(e.features[0].id, ItemType.campsite);
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'campsites',
          id: getHovered().id,
        },
        { hover: true },
      );
    }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'campsites', function() {
    const hoveredCampsite = getHovered();
    if (hoveredCampsite.type === ItemType.campsite && hoveredCampsite.id) {
      map.getCanvas().style.cursor = '';
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'campsites',
          id: hoveredCampsite.id,
        },
        { hover: false },
      );
      setHovered(undefined, undefined);
    }
  });

};

export default campiteInteractions;
