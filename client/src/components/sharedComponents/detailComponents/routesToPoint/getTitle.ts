import { GetString } from 'fluent-react/compat';
import partition from 'lodash/partition';
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst';
import {Feature} from '../../../../hooks/servicesHooks/pathfinding/simpleCache';
import {RoutesToPointInput} from '../../../../routing/services';
import {TrailType} from '../../../../types/graphQLTypes';
import {CoreItem, MapItem} from '../../../../types/itemTypes';

interface Input {
  destination?: RoutesToPointInput['destination'];
  feature: Feature;
  item: CoreItem;
  getString: GetString;
}

const getTitle = (input: Input) => {
 const {
   destination, item,
   feature: {properties: {trails}, properties},
   getString,
 } = input;

 let title: string;
 let iconType: CoreItem | MapItem;
 if (!destination || destination === 'parking') {
    if (trails && trails.length) {
      const uniqueTrails = uniqBy(trails.filter(t => t.name), 'name');
      const [justTrails, justRoads] =
        partition(uniqueTrails, t => t.type && t.type !== TrailType.road && t.type !== TrailType.dirtroad);
      const topTrailsString = justTrails.length
        ? justTrails.slice(0, 2).map(t => t.name).join(', ___')
        : justRoads.slice(0, 2).map(t => t.name).join(', ___');
      if (topTrailsString.length) {
        const nameComponents = topTrailsString.split('___').map((t) => t);
        const remaining = uniqueTrails.length - nameComponents.length;
        if (remaining) {
          nameComponents.push(` & ${remaining} ${getString('global-text-value-others', {count: remaining})}`);
        }
        title = nameComponents.join('');
      } else {
        title = trails.length + ' trails';
      }
    } else if (properties.destination.name) {
      title = properties.destination.name;
    } else if (properties.destination.type) {
      title = properties.destination.type.split('_').join(' ');
    } else {
      title = trails.length + ' trails';
    }
    title = `via ${title}`;
    iconType = MapItem.route;
  } else {
    const formattedType =
      upperFirst(getString('global-formatted-anything-type', {type: properties.destination.type}));
    iconType = item === CoreItem.trail && destination === 'mountains' ? CoreItem.mountain : item;
    if (properties.destination.name) {
      title = properties.destination.name;
    } else {
      title = formattedType;
    }
  }

 return {title, iconType};
};

export default getTitle;
