import { GetString } from 'fluent-react/compat';
import mapboxgl from 'mapbox-gl';
import {CallbackInput, Props as TooltipState} from '../../tooltip';
import campsiteInteractions from './campsiteInteractions';
import highlightedPointsInteractions from './highlightedPointsInteractions';
import mountainInteractions from './mountainInteractions';
import roadInteractions from './roadInteractions';
import trailInteractions from './trailInteractions';

interface Input {
  map: mapboxgl.Map;
  push: (url: string) => void;
  getString: GetString;
  onTooltipOpen: (tooltipState: TooltipState) => void;
  onTooltipClose: () => void;
  getTooltipCallback: () => undefined | ((input: CallbackInput) => void);
  getHighlightedGeojsonData: () => {
    highlightedPointsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined,
    highlightedTrailsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined,
    highlightedRoadsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined,
  };
}

export type Id = string | number | undefined;

export enum ItemType {
  mountain = 'mountains',
  campsite = 'campsites',
  trail = 'trails',
  highlightedPoint = 'highlightedPoint',
}

const initInteractions = (input: Input) => {
  mountainInteractions({...input});
  campsiteInteractions({...input});
  highlightedPointsInteractions({...input});
  trailInteractions({...input});
  roadInteractions({...input});
};

export default initInteractions;
