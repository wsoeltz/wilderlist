const {lineString, point, featureCollection} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
import React from 'react';
import {useAllInProgressItems} from '../../queries/users/useAllInProgressItems';
import useUsersProgress from '../../queries/users/useUsersProgress';
import {
  Campsite,
  Mountain,
  PeakListVariants,
  Trail,
} from '../../types/graphQLTypes';
import MapRenderProp from '../sharedComponents/MapRenderProp';

interface Props {
  userId: string;
}

const AllSavedListItemsMapRenderProp = ({userId}: Props) => {
  const items = useAllInProgressItems(userId);
  const progress = useUsersProgress(userId);

  if (items.data && items.data.allItems && progress.data) {
    const allGeojsonItems: any[] = [];
    const progressData = progress.data.progress;
    const mountains: Array<{
      id: Mountain['id'];
      name: Mountain['name'];
      elevation: Mountain['elevation'];
      location: Mountain['location'];
      ascentCount: number;
    }> = [];
    const trails: Array<{
      id: Trail['id'];
      name: Trail['name'];
      type: Trail['type'];
      line: Trail['line'];
      hikedCount: number;
    }> = [];
    const campsites: Array<{
      id: Campsite['id'];
      name: Campsite['name'];
      type: Campsite['type'];
      location: Campsite['location'];
      campedCount: number;
    }> = [];
    items.data.allItems.mountains.forEach(m => {
      if (m) {
        const ascentCount = progressData && progressData.mountains && m && m.id &&
          progressData.mountains.find(mm => mm.mountain && mm.mountain.id === m.id && mm.dates.length)
            ? 1
            : 0;
        mountains.push({
          ...m,
          ascentCount,
        });
        allGeojsonItems.push(point(m.location));
      }
    });
    items.data.allItems.trails.forEach(m => {
      if (m) {
        const hikedCount = progressData && progressData.trails && m && m.id &&
          progressData.trails.find(mm => mm.trail && mm.trail.id === m.id && mm.dates.length)
            ? 1
            : 0;
        trails.push({
          ...m,
          hikedCount,
        });
        allGeojsonItems.push(lineString(m.line));
      }
    });
    items.data.allItems.camspites.forEach(m => {
      if (m) {
        const campedCount = progressData && progressData.campsites && m && m.id &&
          progressData.campsites.find(mm => mm.campsite && mm.campsite.id === m.id && mm.dates.length)
            ? 1
            : 0;
        allGeojsonItems.push(point(m.location));
        campsites.push({
          ...m,
          campedCount,
        });
      }
    });

    if (mountains.length || campsites.length || trails.length) {
      const bbox = getBbox(featureCollection(allGeojsonItems));

      return (
        <MapRenderProp
          key={'dashboard-all-items-' + userId + allGeojsonItems.length}
          id={'dashboard-all-items-' + userId}
          mountains={mountains}
          campsites={campsites}
          trails={trails}
          type={PeakListVariants.standard}
          bbox={bbox}
        />
      );
    }
  }
  return null;
};

export default AllSavedListItemsMapRenderProp;
