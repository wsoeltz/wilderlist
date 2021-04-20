const {point, featureCollection} = require('@turf/helpers');
const getBbox = require('@turf/bbox').default;
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import useFluent from '../../hooks/useFluent';
import useMapContext from '../../hooks/useMapContext';
import {CampsiteDatum, useSavedCampsites} from '../../queries/campsites/useSavedCampsites';
import useUsersProgress from '../../queries/users/useUsersProgress';
import {campsiteDetailLink} from '../../routing/Utils';
import {
  BasicContentContainer,
} from '../../styling/sharedContentStyles';
import {
  ButtonPrimaryLink,
  PlaceholderText,
} from '../../styling/styleUtils';
import {PeakListVariants} from '../../types/graphQLTypes';
import {CoreItem} from '../../types/itemTypes';
import getDates from '../peakLists/detail/getDates';
import ItemTable from '../sharedComponents/detailComponents/itemTable/ItemTable';
import LoadingSimple, {LoadingContainer} from '../sharedComponents/LoadingSimple';
import MapRenderProp from '../sharedComponents/MapRenderProp';
import {SavedItemsLegend} from './AllSavedListItemsMapRenderProp';

const SavedCampsites = () => {
  const getString = useFluent();
  const {response: {loading, data}} = useSavedCampsites();
  const usersProgress = useUsersProgress();
  const mapContext = useMapContext();

  useEffect(() => () => {
    if (mapContext.intialized) {
      mapContext.clearMap();
    }
  }, [mapContext]);

  const progressCampsites = usersProgress.data && usersProgress.data.progress && usersProgress.data.progress.campsites
    ? usersProgress.data.progress.campsites : [];

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
  } else if (data && data.user && data.user.savedCampsites && data.user.savedCampsites.length) {
    const allPoints: any[] = [];
    const campsites = data.user.savedCampsites.filter(t => t).map((t: CampsiteDatum) => {

      const formattedType = upperFirst(getString('global-formatted-campsite-type', {type: t.type}));
      const name = t.name ? t.name : formattedType;
      const {dates, completedCount} = getDates({
        type: PeakListVariants.standard,
        item: t,
        field: CoreItem.campsite,
        userItems: progressCampsites,
        completionFieldKeys,
        stringDateFields,
      });
      allPoints.push(point(t.location));
      return {
        ...t,
        name,
        center: t.location,
        locationTextShort: t.locationTextShort,
        formattedType,
        campedCount: completedCount,
        destination: campsiteDetailLink(t.id),
        ...dates,
      };
    });

    if (campsites.length) {
      const bbox = getBbox(featureCollection(allPoints));

      return (
        <>
          <ItemTable
            showIndex={true}
            items={campsites}
            dataFieldKeys={[
              {
                displayKey: 'locationTextShort',
                sortKey: 'locationTextShort',
                label: getString('global-text-value-state'),
              }, {
                displayKey: 'formattedType',
                sortKey: 'formattedType',
                label: getString('global-text-value-type'),
              },
            ]}
            completionFieldKeys={completionFieldKeys}
            actionFieldKeys={[]}
            type={CoreItem.campsite}
            variant={PeakListVariants.standard}
          />
          <MapRenderProp
            id={'dashboard-saved-campsites' + campsites.length}
            campsites={campsites}
            bbox={bbox}
          />
          <SavedItemsLegend
            hasMountains={false}
            hasTrails={false}
            hasCampsites={true}
          />
        </>
      );
    }
  }
  return (
    <div>
      <BasicContentContainer>
        <PlaceholderText dangerouslySetInnerHTML={{
          __html: getString('dashboard-empty-state-no-saved-campsites-text')}}
        />
      </BasicContentContainer>
      <p style={{textAlign: 'center'}}>
        <ButtonPrimaryLink
          to={campsiteDetailLink('search')}
        >
          {getString('dashboard-empty-state-no-saved-campsites')}
        </ButtonPrimaryLink>
      </p>
      <MapRenderProp
        id={'dashboard-saved-campsites'}
      />
    </div>
  );

};

export default SavedCampsites;
