const {point, featureCollection} = require('@turf/helpers');
import {useEffect} from 'react';
import useMapContext from '../../hooks/useMapContext';
import usePrevious from '../../hooks/usePrevious';
import {
  Coordinate,
  Mountain,
  PeakList,
  PeakListVariants,
} from '../../types/graphQLTypes';

interface BaseMountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  elevation: Mountain['elevation'];
  location: Mountain['location'];
  ascentCount: number;
}

interface Props {
  id: string;
  mountains: BaseMountainDatum[];
  type: PeakListVariants;
  center?: Coordinate;
  bbox?: PeakList['bbox'];
}

const MapRenderProp = (props: Props) => {
  const mapContext = useMapContext();

  const prevId = usePrevious(props.id);

  useEffect(() => {
    if (prevId !== props.id) {
      const {mountains, center, bbox, type} = props;
      if (mapContext.intialized) {
        if (center) {
          mapContext.setNewCenter(center, 15);
        } else if (bbox) {
          mapContext.setNewBounds(bbox);
        }
        if (props.mountains && props.mountains.length) {
          const points = mountains.map(mtn => {
            let icon: string;
            if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
              icon = mtn.ascentCount === 0 ? 'mountain-perc-0' : 'mountain-perc-100';
            } else if (type === PeakListVariants.fourSeason) {
              icon = 'mountain-perc-' + mtn.ascentCount / 4 * 100;
            } else if (type === PeakListVariants.grid) {
              switch (mtn.ascentCount) {
                case 0:
                  icon = 'mountain-perc-0';
                  break;
                case 1:
                  icon = 'mountain-perc-8';
                  break;
                case 2:
                  icon = 'mountain-perc-17';
                  break;
                case 3:
                  icon = 'mountain-perc-25';
                  break;
                case 4:
                  icon = 'mountain-perc-33';
                  break;
                case 5:
                  icon = 'mountain-perc-42';
                  break;
                case 6:
                  icon = 'mountain-perc-50';
                  break;
                case 7:
                  icon = 'mountain-perc-58';
                  break;
                case 8:
                  icon = 'mountain-perc-67';
                  break;
                case 9:
                  icon = 'mountain-perc-75';
                  break;
                case 10:
                  icon = 'mountain-perc-83';
                  break;
                case 11:
                  icon = 'mountain-perc-92';
                  break;
                case 12:
                  icon = 'mountain-perc-100';
                  break;
                default:
                  icon = 'mountain-perc-0';
                  break;
              }
            } else {
              icon = 'mountain-perc-0';
            }
            return point(mtn.location, {
              name: mtn.name, elevation: mtn.elevation,
              icon,
            });
          });
          mapContext.setHighlightedMountains(featureCollection(points));
        }
      }
    }
  }, [mapContext, props, prevId]);

  return null;
};

export default MapRenderProp;
