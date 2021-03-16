const getBbox = require('@turf/bbox').default;
const {point, lineString, featureCollection} = require('@turf/helpers');
import React, {useEffect} from 'react';
import useFluent from '../../../../hooks/useFluent';
import { Campsite, Mountain, State, Trail } from '../../../../types/graphQLTypes';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../../sharedComponents/svgIcons';
import ItemSelector from './ItemSelector';
import MapRenderProp from '../../../sharedComponents/MapRenderProp';
import useMapContext from '../../../../hooks/useMapContext';

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
  elevation: Mountain['elevation'];
  location: Mountain['location'];
}

export interface TrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  center: Trail['center'];
  line: Trail['line'];
}

export interface CampsiteDatum {
  id: Campsite['id'];
  name: Campsite['name'];
  type: Campsite['type'];
  location: Campsite['location'];
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

  const mapContext = useMapContext();
  const getString = useFluent();

  useEffect(() => {
    if (mapContext.intialized) {
      mapContext.clearMap({
        points: !selectedMountains.length && !selectedCampsites.length,
        lines: !selectedTrails.length,
      });
    }
  }, [mapContext, selectedMountains, selectedTrails, selectedCampsites])

  const points = [...selectedMountains, ...selectedCampsites]
    .filter(d => d.location)
    .map(d => point(d.location));
  const lines = selectedTrails
    .filter(d => d.line)
    .map(d => lineString(d.line));
  const bbox = lines.length || points.length
    ? getBbox(featureCollection([...points, ...lines]))
    : undefined;

  return (
    <>
      <ItemSelector
        selectedList={selectedMountains}
        setSelectedList={setSelectedMountains}
        getSubtitleFromDatum={getMountainSubtitle}
        icon={mountainNeutralSvg}
        title={getString('global-text-value-mountains')}
        note={getString('trip-report-add-additional-mtns-desc')}
        searchPlaceholder={getString('global-text-value-search-mountains')}
        endpoint={'/api/mountain-search'}
      />
      <ItemSelector
        selectedList={selectedTrails}
        setSelectedList={setSelectedTrails}
        getSubtitleFromDatum={getTrailSubtitle}
        icon={trailDefaultSvg}
        title={getString('global-text-value-trails')}
        note={getString('trip-report-add-additional-trails-desc')}
        searchPlaceholder={getString('global-text-value-search-trails')}
        endpoint={'/api/trail-search'}
      />
      <ItemSelector
        selectedList={selectedCampsites}
        setSelectedList={setSelectedCampsites}
        getSubtitleFromDatum={getCampsiteSubtitle}
        icon={tentNeutralSvg}
        title={getString('global-text-value-campsites')}
        note={getString('trip-report-add-additional-campsites-desc')}
        searchPlaceholder={getString('global-text-value-search-campsites')}
        endpoint={'/api/campsite-search'}
      />
      <MapRenderProp
        id={'trip-report-map-' + JSON.stringify({selectedMountains, selectedTrails, selectedCampsites})}
        mountains={selectedMountains}
        campsites={selectedCampsites}
        trails={selectedTrails}
        bbox={bbox}
      />
    </>
  );

};

export default AddItems;
