const {point, featureCollection} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
import React, {useEffect} from 'react';
import useFluent from '../../hooks/useFluent';
import useMapContext from '../../hooks/useMapContext';
import {MountainDatum, useSavedMountains} from '../../queries/mountains/useSavedMountains';
import useUsersProgress from '../../queries/users/useUsersProgress';
import {mountainDetailLink} from '../../routing/Utils';
import {
  BasicContentContainer,
} from '../../styling/sharedContentStyles';
import {
  ButtonPrimaryLink,
} from '../../styling/styleUtils';
import {PeakListVariants} from '../../types/graphQLTypes';
import {CoreItem} from '../../types/itemTypes';
import getDates from '../peakLists/detail/getDates';
import ItemTable from '../sharedComponents/detailComponents/itemTable/ItemTable';
import LoadingSimple, {LoadingContainer} from '../sharedComponents/LoadingSimple';
import MapRenderProp from '../sharedComponents/MapRenderProp';

const SavedMountains = () => {
  const getString = useFluent();
  const {response: {loading, data}} = useSavedMountains();
  const usersProgress = useUsersProgress();
  const mapContext = useMapContext();

  useEffect(() => () => {
    if (mapContext.intialized) {
      mapContext.clearMap();
    }
  }, [mapContext]);

  const progressMountains = usersProgress.data && usersProgress.data.progress && usersProgress.data.progress.mountains
    ? usersProgress.data.progress.mountains : [];

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
  } else if (data && data.user && data.user.savedMountains && data.user.savedMountains.length) {
    const allPoints: any[] = [];
    const mountains = data.user.savedMountains.filter(t => t).map((t: MountainDatum) => {
      const name = t.name;
      const elevation = t.elevation ? t.elevation : 0;
      const elevationDisplay = elevation + 'ft';
      const {dates, completedCount} = getDates({
        type: PeakListVariants.standard,
        item: t,
        field: CoreItem.mountain,
        userItems: progressMountains,
        completionFieldKeys,
        stringDateFields,
      });
      allPoints.push(point(t.location));
      return {
        ...t,
        name,
        center: t.location,
        locationTextShort: t.locationTextShort,
        elevation,
        elevationDisplay,
        ascentCount: completedCount,
        destination: mountainDetailLink(t.id),
        ...dates,
      };
    });

    if (mountains.length) {
      const bbox = getBbox(featureCollection(allPoints));

      return (
        <>
          <ItemTable
            showIndex={true}
            items={mountains}
            dataFieldKeys={[
              {
                displayKey: 'locationTextShort',
                sortKey: 'locationTextShort',
                label: getString('global-text-value-state'),
              }, {
                displayKey: 'elevationDisplay',
                sortKey: 'elevation',
                label: getString('global-text-value-elevation'),
              },
            ]}
            completionFieldKeys={completionFieldKeys}
            actionFieldKeys={[]}
            type={CoreItem.mountain}
            variant={PeakListVariants.standard}
          />
          <MapRenderProp
            id={'dashboard-saved-mountains' + mountains.length}
            mountains={mountains}
            bbox={bbox}
          />
        </>
      );

    }
  }

  return (
    <div>
      <BasicContentContainer>
        <p>
          {getString('dashboard-empty-state-no-saved-mountains-text')}
        </p>
      </BasicContentContainer>
      <p style={{textAlign: 'center'}}>
        <ButtonPrimaryLink
          to={mountainDetailLink('search')}
        >
          {getString('dashboard-empty-state-no-saved-mountains')}
        </ButtonPrimaryLink>
      </p>
      <MapRenderProp
        id={'dashboard-saved-mountains'}
      />
    </div>
  );
};

export default SavedMountains;
