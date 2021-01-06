import { GetString } from 'fluent-react/compat';
import mapboxgl from 'mapbox-gl';
import campsiteInteractions from './campsites';
import highlightedPoints from './highlightedPoints';
import mountainInteractions from './mountains';
import roadInteractions from './roads';
import trailInteractions from './trails';

interface Input {
  map: mapboxgl.Map;
  push: (url: string) => void;
  getString: GetString;
}

export type Id = string | number | undefined;

export enum ItemType {
  mountain = 'mountains',
  campsite = 'campsites',
  trail = 'trails',
  highlightedPoint = 'highlightedPoint',
}

const initInteractions = (input: Input) => {
  const hovered: {id: Id, type: ItemType | undefined} = {
    id: undefined,
    type: undefined,
  };

  const setHovered = (id: Id, type: ItemType) => {
    if (hovered.id && hovered.type) {
      input.map.setFeatureState(
        {
          source: 'composite',
          sourceLayer: hovered.type,
          id: hovered.id,
        },
        { hover: false },
      );
    }
    hovered.id = id;
    hovered.type = type;
  };

  const getHovered = () => hovered;

  mountainInteractions({...input, setHovered, getHovered});
  campsiteInteractions({...input, setHovered, getHovered});
  trailInteractions({...input, setHovered, getHovered});
  highlightedPoints({...input, setHovered, getHovered});
  roadInteractions({...input, setHovered, getHovered});
};

export default initInteractions;
