const {lineString} = require('@turf/helpers');
const length = require('@turf/length').default;
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import { Campsite, Mountain, State, Trail } from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import DetailSegment from '../../sharedComponents/detailComponents/DetailSegment';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../sharedComponents/svgIcons';
import ItemSelector from './ItemSelector';

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
  elevation: Mountain['elevation'];
  location: Mountain['location'];
  optional: boolean;
}

export interface TrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  center: Trail['center'];
  line: Trail['line'];
  states: Array<{
    id: State['id'];
    abbreviation: State['abbreviation'];
  }>;
  optional: boolean;
}

export interface CampsiteDatum {
  id: Campsite['id'];
  name: Campsite['name'];
  type: Campsite['type'];
  location: Campsite['location'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
  optional: boolean;
}

interface Props {
  selectedMountains: MountainDatum[];
  setSelectedMountains: (mountains: MountainDatum[]) => void;
  selectedTrails: TrailDatum[];
  setSelectedTrails: (trails: TrailDatum[]) => void;
  selectedCampsites: CampsiteDatum[];
  setSelectedCampsites: (trails: CampsiteDatum[]) => void;
}

const AddItems = (props: Props) => {
  const {
    selectedMountains, setSelectedMountains,
    selectedTrails, setSelectedTrails,
    selectedCampsites, setSelectedCampsites,
  } = props;

  const getString = useFluent();

  const mountains = selectedMountains.map(mtn => ({
    ...mtn,
    stateAbbreviation: mtn.state ? mtn.state.abbreviation : '',
    elevationDisplay: mtn.elevation + 'ft',
  }));
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

  const trails = selectedTrails.map(trail => {
    const trailLength = trail.line && trail.line.length ? length(lineString(trail.line)) : 0;
    return {
      ...trail,
      name: trail.name ? trail.name : upperFirst(getString('global-formatted-trail-type', {type: trail.type})),
      formattedType: upperFirst(getString('global-formatted-trail-type', {type: trail.type})),
      stateAbbreviation: trail.states
        ? trail.states.filter(s => s).map(s => s.abbreviation).join(', ')
        : '',
      trailLength,
      trailLengthDisplay: parseFloat(trailLength.toFixed(3)) + 'mi',
    };
  });
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

  const campsites = selectedCampsites.map(campsite => ({
    ...campsite,
    name: campsite.name
      ? campsite.name
      : upperFirst(getString('global-formatted-campsite-type', {type: campsite.type})),
    formattedType: upperFirst(getString('global-formatted-campsite-type', {type: campsite.type})),
    stateAbbreviation: campsite.state ? campsite.state.abbreviation : '',
  }));
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

  const panels = [
    {
      title: `${getString('global-text-value-mountains')}`,
      reactNode: (
        <ItemSelector
          key={'create-list-panel-items-mountains'}
          selectedList={mountains}
          setSelectedList={setSelectedMountains}
          dataFieldKeys={mountainDataFieldKeys}
          note={getString('trip-report-add-additional-mtns-desc')}
          searchPlaceholder={getString('global-text-value-search-mountains-to-add')}
          endpoint={'/api/mountain-search'}
          type={CoreItem.mountain}
        />
      ),
      customIcon: true,
      icon: mountainNeutralSvg,
    },
    {
      title: `${getString('global-text-value-trails')}`,
      reactNode: (
        <ItemSelector
          key={'create-list-panel-items-trails'}
          selectedList={trails}
          setSelectedList={setSelectedTrails}
          dataFieldKeys={trailDataFieldKeys}
          note={getString('trip-report-add-additional-trails-desc')}
          searchPlaceholder={getString('global-text-value-search-trails-to-add')}
          endpoint={'/api/trail-search'}
          type={CoreItem.trail}
        />
      ),
      customIcon: true,
      icon: trailDefaultSvg,
    },
    {
      title: `${getString('global-text-value-campsites')}`,
      reactNode: (
        <ItemSelector
          key={'create-list-panel-items-campsites'}
          selectedList={campsites}
          setSelectedList={setSelectedCampsites}
          dataFieldKeys={campsiteDataFieldKeys}
          note={getString('trip-report-add-additional-campsites-desc')}
          searchPlaceholder={getString('global-text-value-search-campsites-to-add')}
          endpoint={'/api/campsite-search'}
          type={CoreItem.campsite}
        />
      ),
      customIcon: true,
      icon: tentNeutralSvg,
    },
  ];

  const panelCounts = [
    {index: 0, count: mountains.length},
    {index: 1, count: trails.length},
    {index: 2, count: campsites.length},
  ];

  return (
    <DetailSegment
      panels={panels}
      panelCounts={panelCounts}
      panelId={'createListAddItemsId'}
    />
  );

};

export default AddItems;
