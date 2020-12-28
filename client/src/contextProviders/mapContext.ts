import {createContext} from 'react';
import {Output} from '../components/template/globalMap/map';

export type MapState = { intialized: false } | ( {intialized: true} & Output )

const MapContext = createContext<MapState>({intialized: false});

export default MapContext;
