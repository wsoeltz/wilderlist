import React from 'react';
import useFluent from '../../../hooks/useFluent';
import { Campsite, Mountain, State, Trail } from '../../../types/graphQLTypes';
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

const getMountainSubtitle = (mtn: MountainDatum) =>
  mtn.elevation + 'ft' + (mtn.state && mtn.state.abbreviation ? ', ' + mtn.state.abbreviation : '');

const getTrailSubtitle = (trail: TrailDatum) => trail.type;

const getCampsiteSubtitle = (campsite: CampsiteDatum) => campsite.type;

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

  const panels = [
    {
      title: `${getString('global-text-value-mountains')} (${selectedMountains.length})`,
      reactNode: (
        <ItemSelector
          selectedList={selectedMountains}
          setSelectedList={setSelectedMountains}
          getSubtitleFromDatum={getMountainSubtitle}
          icon={mountainNeutralSvg}
          title={getString('global-text-value-mountains')}
          note={getString('trip-report-add-additional-mtns-desc')}
          searchPlaceholder={getString('global-text-value-search-mountains-to-add')}
          endpoint={'/api/mountain-search'}
        />
      ),
      customIcon: true,
      icon: mountainNeutralSvg,
    },
    {
      title: `${getString('global-text-value-trails')} (${selectedTrails.length})`,
      reactNode: (
        <ItemSelector
          selectedList={selectedTrails}
          setSelectedList={setSelectedTrails}
          getSubtitleFromDatum={getTrailSubtitle}
          icon={trailDefaultSvg}
          title={getString('global-text-value-trails')}
          note={getString('trip-report-add-additional-trails-desc')}
          searchPlaceholder={getString('global-text-value-search-trails-to-add')}
          endpoint={'/api/trail-search'}
        />
      ),
      customIcon: true,
      icon: mountainNeutralSvg,
    },
    {
      title: `${getString('global-text-value-campsites')} (${selectedCampsites.length})`,
      reactNode: (
        <ItemSelector
          selectedList={selectedCampsites}
          setSelectedList={setSelectedCampsites}
          getSubtitleFromDatum={getCampsiteSubtitle}
          icon={tentNeutralSvg}
          title={getString('global-text-value-campsites')}
          note={getString('trip-report-add-additional-campsites-desc')}
          searchPlaceholder={getString('global-text-value-search-campsites-to-add')}
          endpoint={'/api/campsite-search'}
        />
      ),
      customIcon: true,
      icon: mountainNeutralSvg,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
    />
  );

};

export default AddItems;
