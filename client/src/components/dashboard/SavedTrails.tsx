const {lineString, featureCollection} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import useFluent from '../../hooks/useFluent';
import useMapContext from '../../hooks/useMapContext';
import {useSavedTrails} from '../../queries/trails/useSavedTrails';
import useUsersProgress from '../../queries/users/useUsersProgress';
import {trailDetailLink} from '../../routing/Utils';
import {
  BasicContentContainer,
} from '../../styling/sharedContentStyles';
import {
  ButtonPrimaryLink,
} from '../../styling/styleUtils';
import {PeakListVariants, Trail} from '../../types/graphQLTypes';
import {CoreItem} from '../../types/itemTypes';
import getDates from '../peakLists/detail/getDates';
import ItemTable from '../sharedComponents/detailComponents/itemTable/ItemTable';
import LoadingSimple, {LoadingContainer} from '../sharedComponents/LoadingSimple';
import MapRenderProp from '../sharedComponents/MapRenderProp';

const SavedTrails = () => {
  const getString = useFluent();
  const {response: {loading, data}} = useSavedTrails();
  const usersProgress = useUsersProgress();
  const mapContext = useMapContext();

  useEffect(() => () => {
    if (mapContext.intialized) {
      mapContext.clearMap();
    }
  }, [mapContext]);
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
  } else if (data && data.user && data.user.savedTrails && data.user.savedTrails.length) {
    const allPoints: any[] = [];
    const trailsForMap: Array<{
      id: Trail['id'];
      name: Trail['name'];
      type: Trail['type'];
      line: Trail['line'];
      hikedCount: number;
    }> = [];
    const trails = data.user.savedTrails.filter(t => t).map(t => {
      const formattedType = upperFirst(getString('global-formatted-trail-type', {
        type: t.type ? t.type : 'parent_trail',
      }));
      const name = t.name ? t.name : formattedType;
      const trailLength = t.trailLength ? t.trailLength : 0;
      const trailLengthDisplay = trailLength < 0.1
        ? getString('distance-feet-formatted', {feet: Math.round(trailLength * 5280)})
        : getString('directions-driving-distance', {miles: parseFloat(trailLength.toFixed(1))});
      const avgSlopeDisplay = t.avgSlope !== null ? parseFloat(t.avgSlope.toFixed(1)) + '°' : '---';
      const {dates, completedCount} = getDates({
        type: PeakListVariants.standard,
        item: t,
        field: CoreItem.trail,
        userItems: progressTrails,
        completionFieldKeys,
        stringDateFields,
      });
      const baseDatum = {
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
      };
      if (t.line && t.line.length) {
        allPoints.push(lineString(t.line));
        trailsForMap.push(baseDatum);
        return {...baseDatum, ...dates};
      }
      return baseDatum;
    });

    if (trails.length) {
      const bbox = getBbox(featureCollection(allPoints));

      const map = trailsForMap.length ? (
        <MapRenderProp
          id={'dashboard-saved-trails' + trails.length}
          trails={trailsForMap}
          bbox={bbox}
        />
      ) : null;

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
              }, {
                displayKey: 'formattedType',
                sortKey: 'formattedType',
                label: getString('global-text-value-type'),
              },
            ]}
            completionFieldKeys={completionFieldKeys}
            actionFieldKeys={[]}
            type={CoreItem.trail}
            variant={PeakListVariants.standard}
          />
          {map}
        </>
      );
    }
  }

  return (
    <div>
      <BasicContentContainer>
        <p>
          {getString('dashboard-empty-state-no-saved-trails-text')}
        </p>
      </BasicContentContainer>
      <p style={{textAlign: 'center'}}>
        <ButtonPrimaryLink
          to={trailDetailLink('search')}
        >
          {getString('dashboard-empty-state-no-saved-trails')}
        </ButtonPrimaryLink>
      </p>
      <MapRenderProp
        id={'dashboard-saved-trails'}
      />
    </div>
  );
};

export default SavedTrails;
