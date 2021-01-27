const {lineString} = require('@turf/helpers');
const length = require('@turf/length').default;
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {usePeakListItems} from '../../../queries/lists/usePeakListItems';
import {
  campsiteDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../../routing/Utils';
import {CoreItem} from '../../../types/itemTypes';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import ItemTable from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../sharedComponents/svgIcons';

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

  if (items.loading) {
    return null;
  } else if (items.error !== undefined) {
    console.error(items.error);
    return null;
  } else if (items.data !== undefined) {
    const panels: Panel[] = [];

    const mountains = items.data.peakList.mountains.map(mtn => ({
      ...mtn,
      destination: mountainDetailLink(mtn.id),
      stateAbbreviation: mtn.state ? mtn.state.abbreviation : '',
      elevationDisplay: mtn.elevation + 'ft',
    }));
    if (mountains.length) {
      const mountainDataFieldKeys = [
        {
          displayKey: 'stateAbbreviation',
          sortKey: 'stateAbbreviation',
          label: getString('global-text-value-state'),
        }, {
          displayKey: 'elevationDisplay',
          sortKey: 'elevation',
          label: getString('global-text-value-elevation'),
        },
      ];
      panels.push({
        title: `${getString('global-text-value-mountains')}`,
        reactNode: (
          <ItemTable
            showIndex={true}
            items={mountains}
            dataFieldKeys={mountainDataFieldKeys}
            actionFieldKeys={[]}
            type={CoreItem.mountain}
          />
        ),
        customIcon: true,
        icon: mountainNeutralSvg,
      });
    }

    const trails = items.data.peakList.trails.map(trail => {
      const trailLength = trail.line && trail.line.length ? length(lineString(trail.line)) : 0;
      return {
        ...trail,
        name: trail.name ? trail.name : upperFirst(getString('global-formatted-trail-type', {type: trail.type})),
        destination: trailDetailLink(trail.id),
        formattedType: upperFirst(getString('global-formatted-trail-type', {type: trail.type})),
        stateAbbreviation: trail.states
          ? (trail.states
              .filter(s => s !== null) as Array<{id: string, abbreviation: string}>)
              .map(s => s.abbreviation).join(', ')
          : '',
        trailLength,
        trailLengthDisplay: parseFloat(trailLength.toFixed(3)) + 'mi',
      };
    });
    if (trails.length) {
      const trailDataFieldKeys = [
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
      ];
      panels.push({
        title: `${getString('global-text-value-trails')}`,
        reactNode: (
          <ItemTable
            showIndex={true}
            items={trails}
            dataFieldKeys={trailDataFieldKeys}
            actionFieldKeys={[]}
            type={CoreItem.trail}
          />
        ),
        customIcon: true,
        icon: trailDefaultSvg,
      });
    }

    const campsites = items.data.peakList.campsites.map(campsite => ({
      ...campsite,
      name: campsite.name
        ? campsite.name
        : upperFirst(getString('global-formatted-campsite-type', {type: campsite.type})),
      destination: campsiteDetailLink(campsite.id),
      formattedType: upperFirst(getString('global-formatted-campsite-type', {type: campsite.type})),
      stateAbbreviation: campsite.state ? campsite.state.abbreviation : '',
    }));
    if (campsites.length) {
      const campsiteDataFieldKeys = [
        {
          displayKey: 'stateAbbreviation',
          sortKey: 'stateAbbreviation',
          label: getString('global-text-value-state'),
        }, {
          displayKey: 'formattedType',
          sortKey: 'formattedType',
          label: getString('global-text-value-type'),
        },
      ];
      panels.push({
        title: `${getString('global-text-value-campsites')}`,
        reactNode: (
          <ItemTable
            showIndex={true}
            items={campsites}
            dataFieldKeys={campsiteDataFieldKeys}
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
