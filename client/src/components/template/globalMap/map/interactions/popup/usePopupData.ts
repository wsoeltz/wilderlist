const {lineString} = require('@turf/helpers');
const pointToLineDistance = require('@turf/point-to-line-distance').default;
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import orderBy from 'lodash/orderBy';
import {useEffect, useState} from 'react';
import {ItemType} from '../';
import {Coordinate} from '../../../../../../types/graphQLTypes';

const cacheItem: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getItem = axios.create({
  adapter: cacheItem.adapter,
});

const cacheNearestTrail: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getNearestTrail = axios.create({
  adapter: cacheNearestTrail.adapter,
});

const cacheNamedParentTrail: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getNamedParentTrail = axios.create({
  adapter: cacheNamedParentTrail.adapter,
});

interface PopupData {
  itemType: ItemType;
  id: string;
  name: string;
  subtitle: string;
  type: string | undefined;
}

interface Output {
  loading: boolean;
  error: any;
  data: undefined | PopupData;
}

const usePopupData = (itemType: ItemType, id: string | null, coordinate: Coordinate, name: string | null) => {
  const [output, setOutput] = useState<Output>({loading: true, error: undefined, data: undefined});

  useEffect(() => {
    if (id) {
      getItem({
        method: 'post',
        url: '/api/get-item',
        data: {id, itemType},
      }).then((res) => {
        setOutput({loading: false, error: undefined, data: {
          itemType,
          id: res.data._id,
          name: res.data.name,
          type: res.data.type,
          subtitle: itemType === ItemType.mountain ? res.data.elevation + 'ft' : res.data.type,
        }});
      }).catch(error => setOutput({loading: false, error, data: undefined}));
    } else {
      getNearestTrail({
        method: 'post',
        url: '/api/nearest-trail',
        data: {
          lat: coordinate[1].toFixed(6),
          lng: coordinate[0].toFixed(6),
          name,
          ignoreTypes: [],
          useParent: true,
        },
      }).then((res) => {
        const withDistance = res.data.map((t: any) => ({
          ...t,
          distance: pointToLineDistance(coordinate, lineString(t.line)),
        }));
        const trail = orderBy(withDistance, ['distance'], ['asc'])[0];
        if (trail.parents) {
          getNamedParentTrail({
            method: 'post',
            url: '/api/named-parent-trail',
            data: {id: trail._id},
          }).then(parent => {
            setOutput({loading: false, error: undefined, data: {
              itemType,
              id: parent.data._id,
              name: parent.data.name,
              type: trail.type,
              subtitle: parseFloat(parent.data.trailLength.toFixed(2)) + 'mi',
            }});
          }).catch(error => setOutput({loading: false, error, data: undefined}));
        } else {
          setOutput({loading: false, error: undefined, data: {
            itemType,
            id: trail._id,
            name: trail.name,
            type: trail.type,
            subtitle: parseFloat(trail.trailLength.toFixed(2)) + 'mi',
          }});
        }
      }).catch(error => setOutput({loading: false, error, data: undefined}));
    }
  }, [itemType, id, coordinate, name]);

  return output;
};

export default usePopupData;
