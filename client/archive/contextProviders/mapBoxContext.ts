import {createContext} from 'react';
import ReactMapboxGl from 'react-mapbox-gl';

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ? process.env.REACT_APP_MAPBOX_ACCESS_TOKEN : '';

export const MapboxMap = ReactMapboxGl({
  accessToken,
  maxZoom: 16,
  scrollZoom: false,
});

export default createContext(MapboxMap);
