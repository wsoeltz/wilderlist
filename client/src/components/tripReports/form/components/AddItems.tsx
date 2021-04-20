const getBbox = require('@turf/bbox').default;
const {point, lineString, featureCollection} = require('@turf/helpers');
import partition from 'lodash/partition';
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import { Campsite, Mountain, Trail, TrailType } from '../../../../types/graphQLTypes';
import { CoreItems } from '../../../../types/itemTypes';
import MapRenderProp from '../../../sharedComponents/MapRenderProp';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../../sharedComponents/svgIcons';
import {
  defaultGeoJsonLineString,
} from '../../../template/globalMap/map/layers';
import ItemSelector from './ItemSelector';

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  locationTextShort: Mountain['name'];
  elevation: Mountain['elevation'];
  location: Mountain['location'];
}

export interface TrailDatum {
  id: Trail['id'];
  name: Trail['name'];
  type: Trail['type'];
  center: Trail['center'];
  line: Trail['line'];
  trailLength: Trail['trailLength'];
  locationTextShort: Mountain['name'];
}

export interface CampsiteDatum {
  id: Campsite['id'];
  name: Campsite['name'];
  type: Campsite['type'];
  locationTextShort: Mountain['name'];
  location: Campsite['location'];
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

  const mapContext = useMapContext();
  const getString = useFluent();

  useEffect(() => {
    if (mapContext.intialized) {
      mapContext.clearMap({
        points: !selectedMountains.length && !selectedCampsites.length,
        lines: !selectedTrails.length,
      });

      const [totalRoads, totalTrails] = partition(selectedTrails,
        (t => t.type === TrailType.road || t.type === TrailType.dirtroad));
      if (totalTrails.length === 0) {
        mapContext.setHighlightedTrails(defaultGeoJsonLineString);
      }
      if (totalRoads.length === 0) {
        mapContext.setHighlightedRoads(defaultGeoJsonLineString);
      }

      mapContext.setTooltipCallback(({highlighted, datum, item}) => {
        let selectedList: any[] = [];
        let setSelectedList: (input: any) => void = () => false;
        if (item === CoreItems.mountains) {
          selectedList = selectedMountains;
          setSelectedList = setSelectedMountains;
        } else if (item === CoreItems.trails) {
          selectedList = selectedTrails;
          setSelectedList = setSelectedTrails;
        } else if (item === CoreItems.campsites) {
          selectedList = selectedCampsites;
          setSelectedList = setSelectedCampsites;
        }
        if (!highlighted) {
          if (!selectedList.find((d: any) => d.id === (datum as any).id)) {
            setSelectedList([...selectedList, datum]);
          }
        } else if (highlighted) {
          const updatedList = selectedList.filter((d: any) => d.id !== datum.id);
          setSelectedList([...updatedList]);
        }

      });
    }
  }, [
    mapContext,
    selectedMountains, selectedTrails, selectedCampsites,
    setSelectedMountains, setSelectedTrails, setSelectedCampsites,
  ]);

  const points = [...selectedMountains, ...selectedCampsites]
    .filter(d => d.location)
    .map(d => point(d.location));
  const lines = selectedTrails
    .filter(d => d.line)
    .map(d => lineString(d.line));
  const bbox = lines.length || points.length
    ? getBbox(featureCollection([...points, ...lines]))
    : undefined;

  const getMountainSubtitle = (mtn: MountainDatum) =>
    mtn.elevation + 'ft' + (mtn.locationTextShort ? ', ' + mtn.locationTextShort : '');

  const getTrailSubtitle = (trail: TrailDatum) => {
    const trailLength = trail.trailLength ? trail.trailLength : 0;
    const trailLengthDisplay = trailLength < 0.1
      ? getString('distance-feet-formatted', {feet: Math.round(trailLength * 5280)})
      : getString('directions-driving-distance', {miles: parseFloat(trailLength.toFixed(1))});

    return trailLengthDisplay + ' long ' + getString('global-formatted-anything-type', {type: trail.type});
  };

  const getCampsiteSubtitle = (campsite: CampsiteDatum) =>
    upperFirst(getString('global-formatted-anything-type', {type: campsite.type}))
       + (campsite.locationTextShort ? ' in ' + campsite.locationTextShort : '');

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
