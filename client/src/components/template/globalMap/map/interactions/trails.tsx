const {lineString} = require('@turf/helpers');
const pointToLineDistance = require('@turf/point-to-line-distance').default;
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { GetString } from 'fluent-react/compat';
import orderBy from 'lodash/orderBy';
import React from 'react';
import {
  Coordinate,
  TrailType,
} from '../../../../../types/graphQLTypes';
import {defaultGeoJsonLineString, hoveredTrailsLayerId} from '../layers';
import {
  Id,
  ItemType,
} from './index';
import {
  addClickedPopup,
} from './popup';
import ClickedPopup from './popup/ClickedPopup';

const cacheNearestTrail: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getNearestTrail = axios.create({
  adapter: cacheNearestTrail.adapter,
});

interface Input {
  map: mapboxgl.Map;
  push: (url: string) => void;
  setHovered: (id: Id, type: ItemType | undefined) => void;
  getHovered: () => ({id: Id, type: ItemType | undefined});
  getString: GetString;
}

const trailInteractions = (input: Input) => {
  const {map, push, setHovered, getHovered, getString} = input;

  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'trails-background', function(e) {
    const coordinates: Coordinate = [e.lngLat.lng, e.lngLat.lat];
    const name = e && e.features && e.features[0]
      ? (e.features[0].properties as any).name : '';
    const type = e && e.features && e.features[0]
      ? (e.features[0].properties as any).type : '';

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
        id={''}
        push={push}
        itemType={ItemType.trail}
        getString={getString}
        location={coordinates}
      />, coordinates, map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'trails-background', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    const type = getHovered().type;
    if ((type === undefined || type === ItemType.trail) && e && e.features && e.features.length > 0) {
      const id = e.features[0].id;
      setHovered(id, ItemType.trail);
      if (!(e && e.features && e.features[0] && (e.features[0].properties as any).name)) {
        const {lng, lat} = e.lngLat;
        getNearestTrail({
            method: 'post',
            url: '/api/nearest-trail',
            data: {
              lat: lat.toFixed(6),
              lng: lng.toFixed(6),
              name: null,
              ignoreTypes: [
                TrailType.road,
                TrailType.dirtroad,
              ]
            }
          })
          .then(({data}) => {
            if (getHovered().id === id) {
              const withDistance = data.map((t: any) => ({
                ...t,
                distance: pointToLineDistance([e.lngLat.lng, e.lngLat.lat], lineString(t.line)),
              }));
              const trail = orderBy(withDistance, ['distance'], ['asc'])[0];
              (map.getSource(hoveredTrailsLayerId) as any).setData(lineString(trail.line));
            }
          })
          .catch(err => console.error(err));
      } else {
        map.setFeatureState(
          {
            source: 'composite',
            sourceLayer: 'trails',
            id: getHovered().id,
          },
          { hover: true },
        );
      }
    }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'trails-background', function() {
    const hoveredTrail = getHovered();
    if (hoveredTrail.id && hoveredTrail.type === ItemType.trail) {
      map.getCanvas().style.cursor = '';
      (map.getSource(hoveredTrailsLayerId) as any).setData(defaultGeoJsonLineString);
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
