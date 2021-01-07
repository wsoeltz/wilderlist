const {lineString} = require('@turf/helpers');
const pointToLineDistance = require('@turf/point-to-line-distance').default;
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { GetString } from 'fluent-react/compat';
import orderBy from 'lodash/orderBy';
import React from 'react';
import {Coordinate, TrailType} from '../../../../../types/graphQLTypes';
import {defaultGeoJsonLineString, hoveredRoadsLayerId} from '../layers';
import {
  Id,
  ItemType,
} from './index';
import {
  addClickedPopup,
} from './popup';
import ClickedPopup from './popup/ClickedPopup';

const cacheNearestRoad: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getNearestRoad = axios.create({
  adapter: cacheNearestRoad.adapter,
});

interface Input {
  map: mapboxgl.Map;
  push: (url: string) => void;
  setHovered: (id: Id, type: ItemType | undefined) => void;
  getHovered: () => ({id: Id, type: ItemType | undefined});
  getString: GetString;
}

const roadInteractions = (input: Input) => {
  const {map, push, setHovered, getHovered, getString} = input;
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'roads-background', function(e) {
    const layerId = e && e.features && e.features[0] ? e.features[0].id : undefined;
    if (layerId === getHovered().id) {
      const coordinates: Coordinate = [e.lngLat.lng, e.lngLat.lat];
      const name = e && e.features && e.features[0]
        ? (e.features[0].properties as any).name : null;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      addClickedPopup(
        <ClickedPopup
          name={name}
          id={null}
          push={push}
          itemType={ItemType.trail}
          getString={getString}
          location={coordinates}
        />, coordinates, map);
    }

  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'roads-background', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    const type = getHovered().type;
    if ((type === undefined || type === ItemType.trail) && e && e.features && e.features.length > 0) {
      const id = e.features[0].id;
      setHovered(id, ItemType.trail);
      const name = e && e.features && e.features[0] ? (e.features[0].properties as any).name : null;
      const {lng, lat} = e.lngLat;
      getNearestRoad({
          method: 'post',
          url: '/api/nearest-trail',
          data: {
            lat: lat.toFixed(6),
            lng: lng.toFixed(6),
            name,
            ignoreTypes: [
              TrailType.trail,
              TrailType.path,
              TrailType.stairs,
              TrailType.cycleway,
              TrailType.hiking,
              TrailType.bridleway,
              TrailType.demandingMountainHiking,
              TrailType.mountainHiking,
              TrailType.herdpath,
              TrailType.alpineHiking,
              TrailType.demandingAlpineHiking,
              TrailType.difficultAlpineHiking,
              TrailType.parentTrail,
            ],
          },
        })
        .then(({data}) => {
          if (getHovered().id === id) {
            const withDistance = data.map((t: any) => ({
              ...t,
              distance: pointToLineDistance([lng, lat], lineString(t.line)),
            }));
            const road = orderBy(withDistance, ['distance'], ['asc'])[0];
            (map.getSource(hoveredRoadsLayerId) as any).setData(lineString(road.line));
          }
        })
        .catch(err => console.error(err));
      }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'roads-background', function() {
    const hoveredTrail = getHovered();
    if (hoveredTrail.id && hoveredTrail.type === ItemType.trail) {
      map.getCanvas().style.cursor = '';
      (map.getSource(hoveredRoadsLayerId) as any).setData(defaultGeoJsonLineString);
      map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: 'roads',
          id: hoveredTrail.id,
        },
        { hover: false },
      );
      setHovered(undefined, undefined);
    }
  });

};

export default roadInteractions;
