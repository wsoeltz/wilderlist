const {lineString} = require('@turf/helpers');
const pointToLineDistance = require('@turf/point-to-line-distance').default;
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import orderBy from 'lodash/orderBy';
import mapboxgl from 'mapbox-gl';
import {primaryColor} from '../../../../../styling/styleUtils';
import {
  Coordinate,
  TrailType,
} from '../../../../../types/graphQLTypes';
import {CoreItems} from '../../../../../types/itemTypes';
import {Props as TooltipState} from '../../tooltip';
import {defaultGeoJsonLineString, hoveredRoadsLayerId} from '../layers';

const cacheNearestTrail: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getNearestTrail = axios.create({
  adapter: cacheNearestTrail.adapter,
});

interface Input {
  map: mapboxgl.Map;
  onTooltipOpen: (tooltipState: TooltipState) => void;
  onTooltipClose: () => void;
}

const mountainInteractions = (input: Input) => {
  const {
    map, onTooltipOpen, onTooltipClose,
  } = input;

  let hoveredId: string | undefined;
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'roads-background', function(e) {
      const coordinates: Coordinate = [e.lngLat.lng, e.lngLat.lat];
      const name = e && e.features && e.features[0] && (e.features[0].properties as any).name
        ? (e.features[0].properties as any).name : null;
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
            item: CoreItems.trails,
            id: null,
            name,
            location: coordinates,
            closePopup: removeFromMap,
          });
        }
      }, 0);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'roads-background', function(e) {
    const zoom = map.getZoom();
    if (zoom > 10) {
      map.getCanvas().style.cursor = 'pointer';
      if (e && e.features && e.features.length > 0) {
        const id = e.features[0].id as string;
        hoveredId = id;
        const name = e && e.features && e.features[0] ? (e.features[0].properties as any).name : null;
        const {lng, lat} = e.lngLat;
        getNearestTrail({
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
            if (hoveredId === id) {
              const withDistance = data.map((t: any) => ({
                ...t,
                distance: pointToLineDistance([lng, lat], lineString(t.line)),
              }));
              const trail = orderBy(withDistance, ['distance'], ['asc'])[0];
              (map.getSource(hoveredRoadsLayerId) as any).setData(lineString(trail.line, {color: primaryColor}));
            }
          })
          .catch(err => console.error(err));
      }
    }
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'roads-background', function() {
    map.getCanvas().style.cursor = '';
    (map.getSource(hoveredRoadsLayerId) as any).setData(defaultGeoJsonLineString);
    map.setFeatureState(
      {
        source: 'composite',
        sourceLayer: 'roads',
        id: hoveredId,
      },
      { hover: false },
    );
    hoveredId = undefined;
  });

};

export default mountainInteractions;
