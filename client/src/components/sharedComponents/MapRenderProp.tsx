const {point, lineString, featureCollection} = require('@turf/helpers');
import {useEffect} from 'react';
import useMapContext from '../../hooks/useMapContext';
import usePrevious from '../../hooks/usePrevious';
import {
  completeColor,
  completionColorScale,
  incompleteColor,
  primaryColor,
} from '../../styling/styleUtils';
import {
  Campsite,
  Coordinate,
  Mountain,
  PeakList,
  PeakListVariants,
  Trail,
  TrailType,
} from '../../types/graphQLTypes';
import {ItemType} from '../template/globalMap/map/interactions';

const getPercentIcon = (label: string, type: PeakListVariants | 'comparison', count: number | undefined) => {
  if (count === undefined) {
    return `${label}-highlighted`;
  } else if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    return count === 0 ? `${label}-perc-0` : `${label}-perc-100`;
  } else if (type ===  'comparison') {
    switch (count) {
      case 0:
        return `${label}-perc-0`;
      case 1:
        return `${label}-perc-50`;
      case 2:
        return `${label}-perc-100`;
      default:
        return `${label}-perc-0`;
    }
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

const getPercentColor = (type: PeakListVariants | 'comparison', count: number | undefined) => {
  if (count === undefined) {
    return primaryColor;
  } else if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    return count === 0 ? incompleteColor : completeColor;
  } else if (type ===  'comparison') {
    switch (count) {
      case 0:
        return incompleteColor;
      case 1:
        return completionColorScale[50];
      case 2:
        return completeColor;
      default:
        return incompleteColor;
    }
  } else if (type === PeakListVariants.fourSeason) {
    // @ts-expect-error this is can be used to index completeColorScale
    return completionColorScale[count / 4 * 100];
  } else if (type === PeakListVariants.grid) {
    switch (count) {
      case 0:
        return completionColorScale[0];
      case 1:
        return completionColorScale[8];
      case 2:
        return completionColorScale[17];
      case 3:
        return completionColorScale[25];
      case 4:
        return completionColorScale[33];
      case 5:
        return completionColorScale[42];
      case 6:
        return completionColorScale[50];
      case 7:
        return completionColorScale[58];
      case 8:
        return completionColorScale[67];
      case 9:
        return completionColorScale[75];
      case 10:
        return completionColorScale[83];
      case 11:
        return completionColorScale[92];
      case 12:
        return completionColorScale[100];
      default:
        return completionColorScale[0];
    }
  } else {
    return incompleteColor;
  }
};

interface Props {
  id: string;
  mountains?: Array<{
    id: Mountain['id'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    location: Mountain['location'];
    ascentCount?: number;
  }>;
  campsites?: Array<{
    id: Campsite['id'];
    name: Campsite['name'];
    type: Campsite['type'];
    location: Campsite['location'];
    campedCount?: number;
  }>;
  trails?: Array<{
    id: Trail['id'];
    name: Trail['name'];
    type: Trail['type'];
    line: Trail['line'];
    hikedCount?: number;
  }>;
  type?: PeakListVariants | 'comparison';
  center?: Coordinate;
  bbox?: PeakList['bbox'];
}

const MapRenderProp = (props: Props) => {
  const mapContext = useMapContext();

  const prevId = usePrevious(props.id);

  useEffect(() => {
    if (prevId !== props.id) {
      const {center, bbox} = props;
      const type = props.type ? props.type : PeakListVariants.standard;
      if (mapContext.intialized) {
        if (center) {
          const zoom = Number(Boolean(props.mountains && props.mountains.length === 1)) +
            Number(Boolean(props.trails && props.trails.length === 1)) +
            Number(Boolean(props.campsites && props.campsites.length === 1)) === 1 &&
            mapContext.map.getZoom() > 12
            ? mapContext.map.getZoom()
            : 12;
          mapContext.setNewCenter(center, zoom);
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
          const {features} = featureCollection(points);
          mapContext.setHighlightedPoints({
            type: 'FeatureCollection',
            features: features.map((f: any, i: number) => ({...f, id: i})),
          });
        }

        const trails: any[] = [];
        const roads: any[] = [];
        if (props.trails && props.trails.length) {
          props.trails.forEach(trail => {
            if (trail.line) {
              const line = lineString(trail.line, {
                name: trail.name,
                itemType: ItemType.trail,
                type: trail.type,
                subtitle: trail.type,
                id: trail.id,
                color: getPercentColor(type, trail.hikedCount),
              });
              if (trail.type === TrailType.road || trail.type === TrailType.dirtroad) {
                roads.push(line);
              } else {
                trails.push(line);
              }
            } else {
              console.error('Trail is missing proper line value', trail);
            }
          });
        }
        if (trails.length) {
          mapContext.setHighlightedTrails(featureCollection(trails));
        }
        if (roads.length) {
          mapContext.setHighlightedRoads(featureCollection(roads));
        }

      }
    }
  }, [mapContext, props, prevId]);

  return null;
};

export default MapRenderProp;
