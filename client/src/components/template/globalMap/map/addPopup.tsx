import mapboxgl from 'mapbox-gl';
import React from 'react';
import ReactDOM from 'react-dom';
import {mountainDetailLink} from '../../../../routing/Utils';
import {Coordinate} from '../../../../types/graphQLTypes';

function addPopup(el: JSX.Element, center: Coordinate, map: mapboxgl.Map) {
  const placeholder = document.createElement('div');
  ReactDOM.render(el, placeholder);

  new mapboxgl.Popup()
  .setDOMContent(placeholder)
  .setLngLat(center)
  .addTo(map);
}

interface ClickedPopupProps {
  name: string;
  id: string;
  push: (url: string) => void;
}

export const ClickedPopup = ({name, id, push}: ClickedPopupProps) => {
  const onClick = () => push(mountainDetailLink(id));
  return (
    <div>
      <button onClick={onClick}>{name}</button>
    </div>
  );
};

export default addPopup;
