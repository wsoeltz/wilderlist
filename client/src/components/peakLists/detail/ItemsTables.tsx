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
  formatDate,
  formatGridDate,
} from '../../../utilities/dateUtils';
import {
  monthsArray,
  seasonsArray,
} from '../../../Utils';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import ItemTable, {KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../sharedComponents/svgIcons';
import getCompletionDates from './getCompletionDates';

const Root = styled.div`
  min-height: 60vh;
`;

interface Props {
  peakListId: string;
}

const ItemsSelection = (props: Props) => {
  const {peakListId} = props;

  const getString = useFluent();
  const items = usePeakListItems(peakListId);
  const usersProgress = useUsersProgress();

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
        label: month.slice(0, 3),
      }));
    }

    const mountains = items.data.peakList.mountains.map(mtn => {
      const dateObjects = getCompletionDates({
        type, item: mtn, field: CoreItem.mountain, userItems: progressMountains,
      });
      const dates: {[key: string]: string | number} = {};
      if (dateObjects !== null) {
        const format = dateObjects.type === PeakListVariants.grid ? formatGridDate : formatDate;
        if (dateObjects.type === PeakListVariants.standard || dateObjects.type === PeakListVariants.winter) {
          // @ts-expect-error: value can be used to index object
          dates.hikedDisplayValue = dateObjects[dateObjects.type] ? format(dateObjects[dateObjects.type]) : '--';
          // @ts-expect-error: value can be used to index object
          dates.hikedSortValue = dateObjects[dateObjects.type] ? dateObjects[dateObjects.type].dateAsNumber : 0;
        } else {
          for (const key in dateObjects) {
            if (dateObjects.hasOwnProperty(key)) {
              // @ts-expect-error: value can be used to index object
              dates[key + 'DisplayValue'] = dateObjects[key] ? format(dateObjects[key]) : '--';
              // @ts-expect-error: value can be used to index object
              dates[key + 'SortValue'] = dateObjects[key] ? dateObjects[key].dateAsNumber : 0;
            }
          }
        }
      } else {
        completionFieldKeys.forEach(({displayKey, sortKey}) => {
          dates[displayKey] = '--';
          dates[sortKey as string] = 0;
        });
      }
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
          <ItemTable
            showIndex={true}
            items={mountains}
            dataFieldKeys={mountainDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            actionFieldKeys={[]}
            type={CoreItem.mountain}
          />
        ),
        customIcon: true,
        icon: mountainNeutralSvg,
      });
    }

    const trails = items.data.peakList.trails.map(trail => {
      const dateObjects = getCompletionDates({
        type, item: trail, field: CoreItem.trail, userItems: progressTrails,
      });
      const dates: {[key: string]: string | number} = {};
      if (dateObjects !== null) {
        const format = dateObjects.type === PeakListVariants.grid ? formatGridDate : formatDate;
        if (dateObjects.type === PeakListVariants.standard || dateObjects.type === PeakListVariants.winter) {
          // @ts-expect-error: value can be used to index object
          dates.hikedDisplayValue = dateObjects[dateObjects.type] ? format(dateObjects[dateObjects.type]) : '--';
          // @ts-expect-error: value can be used to index object
          dates.hikedSortValue = dateObjects[dateObjects.type] ? dateObjects[dateObjects.type].dateAsNumber : 0;
        } else {
          for (const key in dateObjects) {
            if (dateObjects.hasOwnProperty(key)) {
              // @ts-expect-error: value can be used to index object
              dates[key + 'DisplayValue'] = dateObjects[key] ? format(dateObjects[key]) : '--';
              // @ts-expect-error: value can be used to index object
              dates[key + 'SortValue'] = dateObjects[key] ? dateObjects[key].dateAsNumber : 0;
            }
          }
        }
      } else {
        completionFieldKeys.forEach(({displayKey, sortKey}) => {
          dates[displayKey] = '--';
          dates[sortKey as string] = 0;
        });
      }
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
          <ItemTable
            showIndex={true}
            items={trails}
            dataFieldKeys={trailDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            actionFieldKeys={[]}
            type={CoreItem.trail}
          />
        ),
        customIcon: true,
        icon: trailDefaultSvg,
      });
    }

    const campsites = items.data.peakList.campsites.map(campsite => {
      const dateObjects = getCompletionDates({
        type, item: campsite, field: CoreItem.campsite, userItems: progressCampsites,
      });
      const dates: {[key: string]: string | number} = {};
      if (dateObjects !== null) {
        const format = dateObjects.type === PeakListVariants.grid ? formatGridDate : formatDate;
        if (dateObjects.type === PeakListVariants.standard || dateObjects.type === PeakListVariants.winter) {
          // @ts-expect-error: value can be used to index object
          dates.hikedDisplayValue = dateObjects[dateObjects.type] ? format(dateObjects[dateObjects.type]) : '--';
          // @ts-expect-error: value can be used to index object
          dates.hikedSortValue = dateObjects[dateObjects.type] ? dateObjects[dateObjects.type].dateAsNumber : 0;
        } else {
          for (const key in dateObjects) {
            if (dateObjects.hasOwnProperty(key)) {
              // @ts-expect-error: value can be used to index object
              dates[key + 'DisplayValue'] = dateObjects[key] ? format(dateObjects[key]) : '--';
              // @ts-expect-error: value can be used to index object
              dates[key + 'SortValue'] = dateObjects[key] ? dateObjects[key].dateAsNumber : 0;
            }
          }
        }
      } else {
        completionFieldKeys.forEach(({displayKey, sortKey}) => {
          dates[displayKey] = '--';
          dates[sortKey as string] = 0;
        });
      }
      return {
        ...campsite,
        name: campsite.name
          ? campsite.name
          : upperFirst(getString('global-formatted-campsite-type', {type: campsite.type})),
        destination: campsiteDetailLink(campsite.id),
        formattedType: upperFirst(getString('global-formatted-campsite-type', {type: campsite.type})),
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
          <ItemTable
            showIndex={true}
            items={campsites}
            dataFieldKeys={campsiteDataFieldKeys}
            completionFieldKeys={completionFieldKeys}
            actionFieldKeys={[]}
            type={CoreItem.campsite}
          />
        ),
        customIcon: true,
        icon: tentNeutralSvg,
      });
    }

    const panelCounts = [
      {index: 0, count: mountains.length},
      {index: 1, count: trails.length},
      {index: 2, count: campsites.length},
    ];

    return (
      <Root>
        <DetailSegment
          panels={panels}
          panelCounts={panelCounts}
        />
      </Root>
    );
  } else {
    return null;
  }

};

export default ItemsSelection;
