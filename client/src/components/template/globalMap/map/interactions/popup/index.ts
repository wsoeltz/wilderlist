import mapboxgl from 'mapbox-gl';
import ReactDOM from 'react-dom';
import {Coordinate} from '../../../../../../types/graphQLTypes';

export enum PopupStyle {
  expanded = 'mapbox-gl-popup-expanded',
  compact = 'mapbox-gl-popup-compact',
}

export function createClickedPopup() {
  const popup = new mapboxgl.Popup({className: PopupStyle.expanded});

  const addToMap = (el: JSX.Element, center: Coordinate, map: mapboxgl.Map) => {
    const placeholder = document.createElement('div');
    ReactDOM.render(el, placeholder);

    popup
    .setDOMContent(placeholder)
    .setLngLat(center)
    .addTo(map);
  };
  const removeFromMap = () => popup.remove();

  return {addToMap, removeFromMap};
}

export function createHoverPopup() {
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: PopupStyle.compact,
  });

  const addToMap = (el: JSX.Element, center: Coordinate, map: mapboxgl.Map) => {
    const placeholder = document.createElement('div');
    ReactDOM.render(el, placeholder);

    popup
      .setDOMContent(placeholder)
      .setLngLat(center)
      .addTo(map);
  };

  const removeFromMap = () => {
    popup.remove();
  };

  return {addToMap, removeFromMap};
}
