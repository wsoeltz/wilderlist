const {point, featureCollection} = require('@turf/helpers');
import {useEffect} from 'react';
import useMapContext from '../../hooks/useMapContext';
import {
  Coordinate,
  Mountain,
  PeakList,
} from '../../types/graphQLTypes';

interface BaseMountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  elevation: Mountain['elevation'];
  location: Mountain['location'];
  dates: string[];
}

interface Props {
  mountains: BaseMountainDatum[];
  center?: Coordinate;
  bbox?: PeakList['bbox'];
}

const MapRenderProp = (props: Props) => {
  const mapContext = useMapContext();

  useEffect(() => {
    const {mountains, center, bbox} = props;
    if (mapContext.intialized) {
      if (center) {
        mapContext.setNewCenter(center, 15);
      } else if (bbox) {
        mapContext.setNewBounds(bbox);
      }
      if (props.mountains && props.mountains.length) {
        const points = mountains.map(mtn => point(mtn.location, {
          name: mtn.name, elevation: mtn.elevation,
          icon: mtn.dates.length ? 'mountain-perc-100' : 'mountain-perc-0',
        }));
        mapContext.setHighlightedMountains(featureCollection(points));
      }
    }
  }, [mapContext, props]);

  return null;
};

export default MapRenderProp;
