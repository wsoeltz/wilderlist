const length = require('@turf/length').default;
const getBbox = require('@turf/bbox').default;
const {point, lineString, featureCollection} = require('@turf/helpers');
import axios from 'axios';
import partition from 'lodash/partition';
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import useFluent from '../../../hooks/useFluent';
import useMapContext from '../../../hooks/useMapContext';
import { Campsite, Mountain, State, Trail, TrailType } from '../../../types/graphQLTypes';
import {CoreItem, CoreItems, coreItemsToCoreItem} from '../../../types/itemTypes';
import DetailSegment from '../../sharedComponents/detailComponents/DetailSegment';
import MapRenderProp from '../../sharedComponents/MapRenderProp';
import {mountainNeutralSvg, tentNeutralSvg, trailDefaultSvg} from '../../sharedComponents/svgIcons';
import {
  defaultGeoJsonLineString,
} from '../../template/globalMap/map/layers';
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
  const mapContext = useMapContext();

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
        if (highlighted) {
          const updatedList = selectedList.filter((d: any) => d.id !== datum.id);
          setSelectedList([...updatedList]);
        } else if (!highlighted) {
          if (!selectedList.find((d: any) => d.id === (datum as any).id)) {
            const queryField = coreItemsToCoreItem(item);
            const stateField = item === CoreItems.trails ? 'states' : 'state';
            const query = `
              {
                ${queryField}(id: "${datum.id}") {
                  ${stateField} {
                    id
                    abbreviation
                  }
                }
              }
            `;
            axios.post('/graphql', {query})
              .then(res => {
                if (res && res.data.data && res.data.data &&
                    res.data.data[queryField] && res.data.data[queryField][stateField]) {
                  const mergedDatum = {
                    ...datum,
                    [stateField]: res.data.data[queryField][stateField],
                  };
                  setSelectedList([...selectedList, mergedDatum]);
                }
              })
              .catch(error => console.error(error));
          }
        }

      });
    }
  }, [
    mapContext,
    selectedMountains, selectedTrails, selectedCampsites,
    setSelectedMountains, setSelectedTrails, setSelectedCampsites,
  ]);

  const mountains = selectedMountains.map(mtn => ({
    ...mtn,
    stateAbbreviation: mtn.state ? mtn.state.abbreviation : '',
    elevationDisplay: mtn.elevation + 'ft',
    center: mtn.location,
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
    center: campsite.location,
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
      <DetailSegment
        panels={panels}
        panelCounts={panelCounts}
        panelId={'createListAddItemsId'}
      />
      <MapRenderProp
        id={'add-edit-peaklist-map-' + JSON.stringify({selectedMountains, selectedTrails, selectedCampsites})}
        mountains={selectedMountains}
        campsites={selectedCampsites}
        trails={selectedTrails}
        bbox={bbox}
      />
    </>
  );

};

export default AddItems;
