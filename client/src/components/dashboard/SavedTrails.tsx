const {lineString, featureCollection} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../hooks/useFluent';
import {useSavedTrails} from '../../queries/trails/useSavedTrails';
import useUsersProgress from '../../queries/users/useUsersProgress';
import {trailDetailLink} from '../../routing/Utils';
import {PeakListVariants} from '../../types/graphQLTypes';
import {CoreItem} from '../../types/itemTypes';
import getDates from '../peakLists/detail/getDates';
import ItemTable from '../sharedComponents/detailComponents/itemTable/ItemTable';
import LoadingSimple, {LoadingContainer} from '../sharedComponents/LoadingSimple';
import MapRenderProp from '../sharedComponents/MapRenderProp';

const SavedTrails = () => {
  const getString = useFluent();
  const {response: {loading, data}} = useSavedTrails();
  const usersProgress = useUsersProgress();

  const progressTrails = usersProgress.data && usersProgress.data.progress && usersProgress.data.progress.trails
    ? usersProgress.data.progress.trails : [];

  const completionFieldKeys = [
    {
      displayKey: 'hikedDisplayValue',
      sortKey: 'hikedSortValue',
      label: 'Hiked On',
    },
  ];
  const stringDateFields = [
    {
      displayKey: 'hikedStringValue',
      sortKey: null,
      label: 'Hiked On',
    },
  ];

  if (loading || usersProgress.loading) {
    return (
      <LoadingContainer>
        <LoadingSimple />
      </LoadingContainer>
    );
  } else if (data && data.user && data.user.savedTrails) {
    const allPoints: any[] = [];
    const trails = data.user.savedTrails.filter(t => t).map(t => {
      const formattedType = upperFirst(getString('global-formatted-trail-type', {type: t.type}));
      const name = t.name ? t.name : formattedType;
      const trailLength = t.trailLength ? t.trailLength : 0;
      const trailLengthDisplay = trailLength < 0.1
        ? getString('distance-feet-formatted', {feet: Math.round(trailLength * 5280)})
        : getString('directions-driving-distance', {miles: parseFloat(trailLength.toFixed(1))});
      const avgSlopeDisplay = t.avgSlope ? parseFloat(t.avgSlope.toFixed(1)) + '°' : '0°';
      const {dates, completedCount} = getDates({
        type: PeakListVariants.standard,
        item: t,
        field: CoreItem.trail,
        userItems: progressTrails,
        completionFieldKeys,
        stringDateFields,
      });
      allPoints.push(lineString(t.line));
      return {
        ...t,
        name,
        line: t.line,
        center: t.center,
        formattedType,
        trailLength,
        trailLengthDisplay,
        avgSlopeDisplay,
        hikedCount: completedCount,
        destination: trailDetailLink(t.id),
        ...dates,
      };
    });

    const bbox = getBbox(featureCollection(allPoints));

    return (
      <>
        <ItemTable
          showIndex={true}
          items={trails}
          dataFieldKeys={[
            {
              displayKey: 'locationTextShort',
              sortKey: 'locationTextShort',
              label: getString('global-text-value-state'),
            }, {
              displayKey: 'trailLengthDisplay',
              sortKey: 'trailLength',
              label: getString('global-text-value-length'),
            }, {
              displayKey: 'avgSlopeDisplay',
              sortKey: 'avgSlope',
              label: getString('global-text-value-incline'),
            },
          ]}
          completionFieldKeys={completionFieldKeys}
          actionFieldKeys={[]}
          type={CoreItem.trail}
          variant={PeakListVariants.standard}
        />
        <MapRenderProp
          id={'dashboard-saved-trails' + trails.length}
          trails={trails}
          bbox={bbox}
        />
      </>
    );
  } else {
    return null;
  }

};

export default SavedTrails;
