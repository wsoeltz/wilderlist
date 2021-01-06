import { GetString } from 'fluent-react/compat';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {highlightedPointsLayerId} from '../layers';
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
    map, push, getString, setHovered, getHovered,
  } = input;
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', highlightedPointsLayerId, function(e) {
    const layerId = e && e.features && e.features[0] ? e.features[0].id : undefined;
    if (layerId === getHovered().id) {

      const itemType: ItemType | null = e && e.features && e.features[0]
        ? (e.features[0].properties as any).itemType : null;

      if (itemType) {
        const coordinates = e && e.features && e.features[0] && e.features[0].geometry
          ? (e.features[0].geometry as any).coordinates.slice() : [e.lngLat.lng, e.lngLat.lat];
        let name = e && e.features && e.features[0]
          ? (e.features[0].properties as any).name : '';

        const id = e && e.features && e.features[0]
          ? (e.features[0].properties as any).id : '';

        let subtitle: string;
        if (itemType === ItemType.mountain) {
          subtitle = e && e.features && e.features[0]
            ? (e.features[0].properties as any).elevation + 'ft' : '';
        } else if (itemType === ItemType.campsite) {
          subtitle = e && e.features && e.features[0]
            ? upperFirst(getString('global-formatted-campsite-type', {type: (e.features[0].properties as any).type}))
            : '';
          if (!name) {
            name = subtitle;
            subtitle = '';
          }
        } else {
          subtitle = '';
        }

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        addClickedPopup(
          <ClickedPopup
            title={name}
            subtitle={subtitle}
            id={id}
            push={push}
            getString={getString}
            itemType={itemType}
            location={coordinates}
          />, coordinates, map);
      }
    }
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', highlightedPointsLayerId, function(e) {
    map.getCanvas().style.cursor = 'pointer';
    if (e && e.features && e.features.length > 0) {
      setHovered(e.features[0].id, ItemType.highlightedPoint);
      map.setFeatureState(
        {
          source: highlightedPointsLayerId,
          id: getHovered().id,
        },
        { hover: true },
      );
    }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', highlightedPointsLayerId, function() {
    const hoveredPoint = getHovered();
    // if (hoveredPoint.id) {
    map.getCanvas().style.cursor = '';
    map.setFeatureState(
        {
          source: highlightedPointsLayerId,
          id: hoveredPoint.id,
        },
        { hover: false },
      );
    setHovered(undefined, undefined);
    // }
  });
};

export default mountainInteractions;
