import upperFirst from 'lodash/upperFirst';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {usePeakListItems} from '../../../queries/lists/usePeakListItems';
import useUsersProgress from '../../../queries/users/useUsersProgress';
import {
  campsiteDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../../routing/Utils';
import {PeakListVariants} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import {
  Months,
  Seasons,
} from '../../../Utils';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import {KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../sharedComponents/svgIcons';
import {getSimpleDates} from '../detail/getDates';
import ItemsListTable from './ItemsListTable';

const Root = styled.div`
  min-height: 60vh;
  position: relative;
`;

interface Props {
  peakListId: string;
  secondaryUserId: string;
  secondaryUserName: string;
  primaryUserName: string;
  showOnlyFor: Months | Seasons | null;
  bbox: [number, number, number, number] | null;
}

const AllItems = (props: Props) => {
  const {peakListId, showOnlyFor, secondaryUserId, secondaryUserName, bbox, primaryUserName} = props;

  const getString = useFluent();
  const items = usePeakListItems(peakListId);
  const usersProgress = useUsersProgress();
  const secondaryUsersProgress = useUsersProgress(secondaryUserId);

  if (items.loading || usersProgress.loading || secondaryUsersProgress.loading) {
    return null;
  } else if (items.error !== undefined) {
    console.error(items.error);
    return null;
  } else if (usersProgress.error) {
    console.error(usersProgress.error);
    return null;
  } else if (secondaryUsersProgress.error) {
    console.error(secondaryUsersProgress.error);
    return null;
  } else if (items.data !== undefined && usersProgress.data !== undefined
    && secondaryUsersProgress.data !== undefined) {
    const panels: Panel[] = [];
    const type = items.data.peakList.type;
    const {progress: primaryProgress} = usersProgress.data;
    const {progress: secondaryProgress} = secondaryUsersProgress.data;

    const primaryCompletionFieldKey: KeySortPair = {
      displayKey: 'hikedPrimaryDisplayValue',
      sortKey: 'hikedPrimarySortValue',
      label: primaryUserName,
    };
    const secondaryCompletionFieldKey: KeySortPair = {
      displayKey: 'hikedSecondaryDisplayValue',
      sortKey: 'hikedSecondarySortValue',
      label: secondaryUserName,
    };
    const completionFieldKeys = [primaryCompletionFieldKey, secondaryCompletionFieldKey];

    const optionalMountains = items.data.peakList.optionalMountains.map(mtn => ({
      ...mtn,
      optional: true,
    }));
    const requiredMountains = items.data.peakList.mountains;
    const mountains = [...requiredMountains, ...optionalMountains].map(mtn => {
      const primary = getSimpleDates({
        type, item: mtn, field: CoreItem.mountain,
        userItems: primaryProgress && primaryProgress.mountains ? primaryProgress.mountains : [],
        completionFieldKey: primaryCompletionFieldKey,
        monthOrSeason: showOnlyFor,
      });
      const secondary = getSimpleDates({
        type, item: mtn, field: CoreItem.mountain,
        userItems: secondaryProgress && secondaryProgress.mountains ? secondaryProgress.mountains : [],
        completionFieldKey: secondaryCompletionFieldKey,
        monthOrSeason: showOnlyFor,
      });
      return {
        ...mtn,
        center: mtn.location,
        destination: mountainDetailLink(mtn.id),
        stateAbbreviation: mtn.locationTextShort ? mtn.locationTextShort : '',
        elevationDisplay: mtn.elevation + 'ft',
        ascentCount: Number(Boolean(primary.completedCount)) + Number(Boolean(secondary.completedCount)),
        ...primary.dates,
        ...secondary.dates,
      };
    });
    const optionalCampsites = items.data.peakList.optionalCampsites.map(campsite => ({
      ...campsite,
      optional: true,
    }));
    const requiredCampsites = items.data.peakList.campsites;
    const campsites = [...requiredCampsites, ...optionalCampsites].map(campsite => {
      const primary = getSimpleDates({
        type, item: campsite, field: CoreItem.campsite,
        userItems: primaryProgress && primaryProgress.campsites ? primaryProgress.campsites : [],
        completionFieldKey: primaryCompletionFieldKey,
        monthOrSeason: showOnlyFor,
      });
      const secondary = getSimpleDates({
        type, item: campsite, field: CoreItem.campsite,
        userItems: secondaryProgress && secondaryProgress.campsites ? secondaryProgress.campsites : [],
        completionFieldKey: secondaryCompletionFieldKey,
        monthOrSeason: showOnlyFor,
      });
      const formattedType = upperFirst(getString('global-formatted-campsite-type', {type: campsite.type}));
      const name: string = campsite.name ? campsite.name : formattedType;
      return {
        ...campsite,
        name,
        center: campsite.location,
        destination: campsiteDetailLink(campsite.id),
        formattedType,
        stateAbbreviation: campsite.locationTextShort ? campsite.locationTextShort : '',
        campedCount: Number(Boolean(primary.completedCount)) + Number(Boolean(secondary.completedCount)),
        ...primary.dates,
        ...secondary.dates,
      };
    });
    const optionalTrails = items.data.peakList.optionalTrails.map(trail => ({
      ...trail,
      optional: true,
    }));
    const requiredTrails = items.data.peakList.trails;
    const trails = [...requiredTrails, ...optionalTrails].map(trail => {
      const primary = getSimpleDates({
        type, item: trail, field: CoreItem.trail,
        userItems: primaryProgress && primaryProgress.trails ? primaryProgress.trails : [],
        completionFieldKey: primaryCompletionFieldKey,
        monthOrSeason: showOnlyFor,
      });
      const secondary = getSimpleDates({
        type, item: trail, field: CoreItem.trail,
        userItems: secondaryProgress && secondaryProgress.trails ? secondaryProgress.trails : [],
        completionFieldKey: secondaryCompletionFieldKey,
        monthOrSeason: showOnlyFor,
      });
      const trailLength = trail.trailLength ? trail.trailLength : 0;
      const trailLengthDisplay = trailLength < 0.1
        ? Math.round(trailLength * 5280) + ' ft'
        : parseFloat(trailLength.toFixed(1)) + ' mi';
      const formattedType = upperFirst(getString('global-formatted-trail-type', {type: trail.type}));
      let name: string = trail.name ? trail.name : formattedType;
      if (type === PeakListVariants.grid || type === PeakListVariants.fourSeason) {
        name = `${name} - ${parseFloat(trailLength.toFixed(1))} mi`;
      }
      return {
        ...trail,
        name,
        center: trail.center,
        destination: trailDetailLink(trail.id),
        formattedType,
        stateAbbreviation: trail.locationTextShort
          ? trail.locationTextShort
          : '',
        trailLength,
        trailLengthDisplay,
        hikedCount: Number(Boolean(primary.completedCount)) + Number(Boolean(secondary.completedCount)),
        ...primary.dates,
        ...secondary.dates,
      };
    });

    if (mountains.length) {
      const mountainDataFieldKeys =  [{
          displayKey: 'elevationDisplay',
          sortKey: 'elevation',
          label: getString('global-text-value-elevation'),
      }];
      panels.push({
        title: `${getString('global-text-value-mountains')}`,
        reactNode: (
          <ItemsListTable
            items={mountains}
            dataFieldKeys={mountainDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            type={CoreItem.mountain}
            variant={type}
          />
        ),
        customIcon: true,
        icon: mountainNeutralSvg,
      });
    }

    if (trails.length) {
      const trailDataFieldKeys = [{
          displayKey: 'trailLengthDisplay',
          sortKey: 'trailLength',
          label: getString('global-text-value-length'),
        }, {
          displayKey: 'formattedType',
          sortKey: 'formattedType',
          label: getString('global-text-value-type'),
        },
      ];
      panels.push({
        title: `${getString('global-text-value-trails')}`,
        reactNode: (
          <ItemsListTable
            items={trails}
            dataFieldKeys={trailDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            type={CoreItem.trail}
            variant={type}
          />
        ),
        customIcon: true,
        icon: trailDefaultSvg,
      });
    }

    if (campsites.length) {
      const campsiteDataFieldKeys = [{
        displayKey: 'formattedType',
        sortKey: 'formattedType',
        label: getString('global-text-value-type'),
      }];
      panels.push({
        title: `${getString('global-text-value-campsites')}`,
        reactNode: (
          <ItemsListTable
            items={campsites}
            dataFieldKeys={campsiteDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            type={CoreItem.campsite}
            variant={type}
          />
        ),
        customIcon: true,
        icon: tentNeutralSvg,
      });
    }

    return (
      <Root>
        <DetailSegment
          key={peakListId + secondaryUserId + 'comparison'}
          panels={panels}
          panelId={peakListId + secondaryUserId + 'comparison-panel'}
        />
        <MapRenderProp
          id={'detail' + peakListId + showOnlyFor}
          mountains={mountains}
          campsites={campsites}
          trails={trails}
          bbox={bbox}
          type={'comparison'}
        />
      </Root>
    );
  } else {
    return null;
  }

};

export default AllItems;
