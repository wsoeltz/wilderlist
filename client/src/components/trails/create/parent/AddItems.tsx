const length = require('@turf/length').default;
const getBbox = require('@turf/bbox').default;
const {lineString, featureCollection} = require('@turf/helpers');
import axios from 'axios';
import partition from 'lodash/partition';
import upperFirst from 'lodash/upperFirst';
import React, {useEffect} from 'react';
import useFluent from '../../../../hooks/useFluent';
import useMapContext from '../../../../hooks/useMapContext';
import { State, Trail, TrailType } from '../../../../types/graphQLTypes';
import {CoreItem, CoreItems, coreItemsToCoreItem} from '../../../../types/itemTypes';
import ItemSelector from '../../../peakLists/create/ItemSelector';
import DetailSegment from '../../../sharedComponents/detailComponents/DetailSegment';
import MapRenderProp from '../../../sharedComponents/MapRenderProp';
import {trailDefaultSvg} from '../../../sharedComponents/svgIcons';
import {
  defaultGeoJsonLineString,
} from '../../../template/globalMap/map/layers';

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
}

interface Props {
  selectedTrails: TrailDatum[];
  setSelectedTrails: (trails: TrailDatum[]) => void;
}

const AddItems = (props: Props) => {
  const {
    selectedTrails, setSelectedTrails,
  } = props;

  const getString = useFluent();
  const mapContext = useMapContext();

  useEffect(() => {
    if (mapContext.intialized) {
      mapContext.clearMap({
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
        if (item === CoreItems.trails) {
          if (highlighted) {
            const updatedList = selectedTrails.filter((d: any) => d.id !== datum.id);
            setSelectedTrails([...updatedList]);
          } else if (!highlighted) {
            if (!selectedTrails.find((d: any) => d.id === (datum as any).id)) {
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
                    } as unknown as TrailDatum;
                    setSelectedTrails([...selectedTrails, mergedDatum]);
                  }
                })
                .catch(error => console.error(error));
            }
          }
        }

      });
    }
  }, [mapContext, selectedTrails, setSelectedTrails]);

  const trails = selectedTrails.map(trail => {
    const trailLength = trail.line && trail.line.length ? length(lineString(trail.line), {units: 'miles'}) : 0;
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

  const panels = [
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
          noOptionalField={true}
        />
      ),
      customIcon: true,
      icon: trailDefaultSvg,
    },
  ];

  const lines = selectedTrails
    .filter(d => d.line)
    .map(d => lineString(d.line));
  const bbox = lines.length
    ? getBbox(featureCollection(lines))
    : undefined;

  return (
    <>
      <DetailSegment
        panels={panels}
        panelId={'createListAddItemsId'}
      />
      <MapRenderProp
        id={'add-edit-peaklist-map-' + JSON.stringify({selectedTrails})}
        trails={selectedTrails}
        bbox={bbox}
      />
    </>
  );

};

export default AddItems;
