const {point, featureCollection} = require('@turf/helpers');
import {useEffect} from 'react';
import useMapContext from '../../hooks/useMapContext';
import usePrevious from '../../hooks/usePrevious';
import {
  Campsite,
  Coordinate,
  Mountain,
  PeakList,
  PeakListVariants,
} from '../../types/graphQLTypes';
import {ItemType} from '../template/globalMap/map/interactions';

const getPercentIcon = (label: string, type: PeakListVariants, count: number) => {
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    return count === 0 ? `${label}-perc-0` : `${label}-perc-100`;
  } else if (type === PeakListVariants.fourSeason) {
    return `${label}-perc-` + count / 4 * 100;
  } else if (type === PeakListVariants.grid) {
    switch (count) {
      case 0:
        return `${label}-perc-0`;
      case 1:
        return `${label}-perc-8`;
      case 2:
        return `${label}-perc-17`;
      case 3:
        return `${label}-perc-25`;
      case 4:
        return `${label}-perc-33`;
      case 5:
        return `${label}-perc-42`;
      case 6:
        return `${label}-perc-50`;
      case 7:
        return `${label}-perc-58`;
      case 8:
        return `${label}-perc-67`;
      case 9:
        return `${label}-perc-75`;
      case 10:
        return `${label}-perc-83`;
      case 11:
        return `${label}-perc-92`;
      case 12:
        return `${label}-perc-100`;
      default:
        return `${label}-perc-0`;
    }
  } else {
    return `${label}-perc-0`;
  }
};

interface Props {
  id: string;
  mountains?: Array<{
    id: Mountain['id'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    location: Mountain['location'];
    ascentCount: number;
  }>;
  campsites?: Array<{
    id: Campsite['id'];
    name: Campsite['name'];
    type: Campsite['type'];
    location: Campsite['location'];
    campedCount: number;
  }>;
  type: PeakListVariants;
  center?: Coordinate;
  bbox?: PeakList['bbox'];
}

const MapRenderProp = (props: Props) => {
  const mapContext = useMapContext();

  const prevId = usePrevious(props.id);

  useEffect(() => {
    if (prevId !== props.id) {
      const {center, bbox, type} = props;
      if (mapContext.intialized) {
        if (center) {
          mapContext.setNewCenter(center, 15);
        } else if (bbox) {
          mapContext.setNewBounds(bbox);
        }
        const points: any[] = [];
        if (props.mountains && props.mountains.length) {
          points.push(...props.mountains.map(mtn => {
            const icon = getPercentIcon('mountain', type, mtn.ascentCount);
            return point(mtn.location, {
              name: mtn.name,
              itemType: ItemType.mountain,
              elevation: mtn.elevation,
              subtitle: mtn.elevation + 'ft',
              icon, id: mtn.id,
            });
          }));
        }
        if (props.campsites && props.campsites.length) {
          points.push(...props.campsites.map(site => {
            const icon = getPercentIcon('tent', type, site.campedCount);
            return point(site.location, {
              name: site.name,
              itemType: ItemType.campsite,
              type: site.type,
              icon, id: site.id,
            });
          }));
        }
        if (points.length) {
          mapContext.setHighlightedPoints(featureCollection(points));
        }
      }
    }
  }, [mapContext, props, prevId]);

  return null;
};

export default MapRenderProp;
