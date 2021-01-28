const {lineString} = require('@turf/helpers');
const length = require('@turf/length').default;
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
  monthsArray,
  seasonsArray,
} from '../../../Utils';
import {mobileSize} from '../../../Utils';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import {KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../sharedComponents/svgIcons';
import getDates from './getDates';
import ItemsListTable from './ItemsListTable';

const Root = styled.div`
  min-height: 60vh;
`;

const monthSliceValue = window.innerWidth < 1250 && window.innerWidth > mobileSize ? 1 : 3;

interface Props {
  peakListId: string;
}

const AllItems = (props: Props) => {
  const {peakListId} = props;

  const getString = useFluent();
  const items = usePeakListItems(peakListId);
  const usersProgress = useUsersProgress();
  const panelCounts: Array<{index: number, count: number, numerator?: number}> = [];

  if (items.loading || usersProgress.loading) {
    return null;
  } else if (items.error !== undefined) {
    console.error(items.error);
    return null;
  } else if (usersProgress.error) {
    console.error(usersProgress.error);
    return null;
  } else if (items.data !== undefined && usersProgress.data !== undefined) {
    const panels: Panel[] = [];
    const type = items.data.peakList.type;
    const {progress} = usersProgress.data;
    const progressMountains = progress && progress.mountains ? progress.mountains : [];
    const progressTrails = progress && progress.trails ? progress.trails : [];
    const progressCampsites = progress && progress.campsites ? progress.campsites : [];

    let completionFieldKeys: KeySortPair[] = [];
    if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
      completionFieldKeys = [
        {
          displayKey: 'hikedDisplayValue',
          sortKey: 'hikedSortValue',
          label: 'Hiked On',
        },
      ];
    } else if (type === PeakListVariants.fourSeason) {
      completionFieldKeys = seasonsArray.map(season => ({
        displayKey: season + 'DisplayValue',
        sortKey: season + 'SortValue',
        label: season,
      }));
    } else if (type === PeakListVariants.grid) {
      completionFieldKeys = monthsArray.map(month => ({
        displayKey: month + 'DisplayValue',
        sortKey: month + 'SortValue',
        label: month.slice(0, monthSliceValue),
      }));
    }

    const optionalMountains = items.data.peakList.optionalMountains.map(mtn => ({
      ...mtn,
      optional: true,
    }));
    const requiredMountains = items.data.peakList.mountains;
    let completedMountains = 0;
    const mountains = [...requiredMountains, ...optionalMountains].map(mtn => {
      const {dates, completedCount} = getDates({
        type, item: mtn, field: CoreItem.mountain, userItems: progressMountains, completionFieldKeys,
      });
      completedMountains += completedCount;
      return {
        ...mtn,
        destination: mountainDetailLink(mtn.id),
        stateAbbreviation: mtn.state ? mtn.state.abbreviation : '',
        elevationDisplay: mtn.elevation + 'ft',
        ...dates,
      };
    });
    if (mountains.length) {
      const mountainDataFieldKeys = type === PeakListVariants.standard || type === PeakListVariants.winter ? [
        {
          displayKey: 'stateAbbreviation',
          sortKey: 'stateAbbreviation',
          label: getString('global-text-value-state'),
        }, {
          displayKey: 'elevationDisplay',
          sortKey: 'elevation',
          label: getString('global-text-value-elevation'),
        },
      ] : [];
      panels.push({
        title: `${getString('global-text-value-mountains')}`,
        reactNode: (
          <ItemsListTable
            peakListId={peakListId}
            items={mountains}
            dataFieldKeys={mountainDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            type={CoreItem.mountain}
            variant={type}
            hasOptionalItems={Boolean(optionalMountains.length)}
          />
        ),
        customIcon: true,
        icon: mountainNeutralSvg,
      });
      let totalCount: number = requiredMountains.length;
      if (type === PeakListVariants.grid) {
        totalCount = totalCount * 12;
      }
      if (type === PeakListVariants.fourSeason) {
        totalCount = totalCount * 4;
      }
      panelCounts.push({
        index: panelCounts.length,
        count: totalCount,
        numerator: completedMountains,
      });
    }

    const optionalTrails = items.data.peakList.optionalTrails.map(trail => ({
      ...trail,
      optional: true,
    }));
    const requiredTrails = items.data.peakList.trails;
    let completedTrails = 0;
    const trails = [...requiredTrails, ...optionalTrails].map(trail => {
      const {dates, completedCount} = getDates({
        type, item: trail, field: CoreItem.trail, userItems: progressTrails, completionFieldKeys,
      });
      completedTrails += completedCount;
      const trailLength = trail.line && trail.line.length ? length(lineString(trail.line)) : 0;
      const formattedType = upperFirst(getString('global-formatted-trail-type', {type: trail.type}));
      let name: string = trail.name ? trail.name : formattedType;
      if (type === PeakListVariants.grid || type === PeakListVariants.fourSeason) {
        name = `${name} - ${parseFloat(trailLength.toFixed(2))} mi`;
      }
      return {
        ...trail,
        name,
        destination: trailDetailLink(trail.id),
        formattedType,
        stateAbbreviation: trail.states
          ? (trail.states
              .filter(s => s !== null) as Array<{id: string, abbreviation: string}>)
              .map(s => s.abbreviation).join(', ')
          : '',
        trailLength,
        trailLengthDisplay: parseFloat(trailLength.toFixed(2)) + ' mi',
        ...dates,
      };
    });
    if (trails.length) {
      const trailDataFieldKeys = type === PeakListVariants.standard || type === PeakListVariants.winter ? [
        {
          displayKey: 'stateAbbreviation',
          sortKey: 'stateAbbreviation',
          label: getString('global-text-value-state'),
        }, {
          displayKey: 'trailLengthDisplay',
          sortKey: 'trailLength',
          label: getString('global-text-value-length'),
        }, {
          displayKey: 'formattedType',
          sortKey: 'formattedType',
          label: getString('global-text-value-type'),
        },
      ] : [];
      panels.push({
        title: `${getString('global-text-value-trails')}`,
        reactNode: (
          <ItemsListTable
            peakListId={peakListId}
            items={trails}
            dataFieldKeys={trailDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            type={CoreItem.trail}
            variant={type}
            hasOptionalItems={Boolean(optionalTrails.length)}
          />
        ),
        customIcon: true,
        icon: trailDefaultSvg,
      });
      let totalCount: number = requiredTrails.length;
      if (type === PeakListVariants.grid) {
        totalCount = totalCount * 12;
      }
      if (type === PeakListVariants.fourSeason) {
        totalCount = totalCount * 4;
      }
      panelCounts.push({
        index: panelCounts.length,
        count: totalCount,
        numerator: completedTrails,
      });
    }

    const optionalCampsites = items.data.peakList.optionalCampsites.map(campsite => ({
      ...campsite,
      optional: true,
    }));
    const requiredCampsites = items.data.peakList.campsites;
    let completedCampsites = 0;
    const campsites = [...requiredCampsites, ...optionalCampsites].map(campsite => {
      const {dates, completedCount} = getDates({
        type, item: campsite, field: CoreItem.campsite, userItems: progressCampsites, completionFieldKeys,
      });
      completedCampsites += completedCount;
      const formattedType = upperFirst(getString('global-formatted-campsite-type', {type: campsite.type}));
      const name: string = campsite.name ? campsite.name : formattedType;
      return {
        ...campsite,
        name,
        destination: campsiteDetailLink(campsite.id),
        formattedType,
        stateAbbreviation: campsite.state ? campsite.state.abbreviation : '',
        ...dates,
      };
    });
    if (campsites.length) {
      const campsiteDataFieldKeys = type === PeakListVariants.standard || type === PeakListVariants.winter ? [
        {
          displayKey: 'stateAbbreviation',
          sortKey: 'stateAbbreviation',
          label: getString('global-text-value-state'),
        }, {
          displayKey: 'formattedType',
          sortKey: 'formattedType',
          label: getString('global-text-value-type'),
        },
      ] : [];
      panels.push({
        title: `${getString('global-text-value-campsites')}`,
        reactNode: (
          <ItemsListTable
            peakListId={peakListId}
            items={campsites}
            dataFieldKeys={campsiteDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            type={CoreItem.campsite}
            variant={type}
            hasOptionalItems={Boolean(optionalCampsites.length)}
          />
        ),
        customIcon: true,
        icon: tentNeutralSvg,
      });
      let totalCount: number = requiredCampsites.length;
      if (type === PeakListVariants.grid) {
        totalCount = totalCount * 12;
      }
      if (type === PeakListVariants.fourSeason) {
        totalCount = totalCount * 4;
      }
      panelCounts.push({
        index: panelCounts.length,
        count: totalCount,
        numerator: completedCampsites,
      });
    }

    return (
      <Root>
        <DetailSegment
          key={peakListId}
          panels={panels}
          panelCounts={panelCounts}
          panelId={'listDetailPanel'}
        />
      </Root>
    );
  } else {
    return null;
  }

};

export default AllItems;
