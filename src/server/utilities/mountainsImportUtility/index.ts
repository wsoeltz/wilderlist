import generateFipsFinder from './stctyfips';
import generateMountainDuplicateCheck from './mountainDuplicates';
const fs = require('fs');
const path = require('path');

const file = (
      path.join(__dirname, '../../../../src/server/utilities/mountainsImportUtility/mountains-geojson.json'));

type Latitude = number;
type Longitude = number;

interface Feature {
  type: "Feature",
  id: string,
  geometry: {
    type: "Point",
    coordinates: [Longitude, Latitude]
  },
  geometry_name: "geom",
  properties: {
    name: string,
    stctyfips: string,
    elev_meter: number,
  },
  bbox: [Longitude, Latitude, Longitude, Latitude]
}

interface Response {
  type: string;
  features: Feature[];
}

interface ObjectId { $oid: string }

interface WilderlistMountainDatum {
  _id: ObjectId,
  lists: ObjectId[],
  name: string,
  state: ObjectId,
  latitude: number,
  longitude: number,
  elevation: number,
  prominence: number | null,
  __v: number,
}

export interface EsriMountainDatum {
  // "_id": {
  //   "$oid": "5eeeb819537ef60017d314cd"
  // },
  esri_id: string;
  name: string,
  state: {
    $oid: string,
  } | null,
  latitude: Latitude,
  longitude: Longitude,
  elevation: number,
}

interface MergedMountainDatum extends WilderlistMountainDatum {
  esri_id: string;
}

const metersToFeet = (m: number) => m * 3.28084;

export default async (
    filteredStateAbbr?: string, showErrors?: boolean, showDuplicates?: boolean, showMergedDuplicates?: boolean,
  ) => {
  try {
    const raw_data = await fs.readFileSync(file, 'utf8');
    const getStateFromFips = await generateFipsFinder();
    const duplicateMountainFunctions = await generateMountainDuplicateCheck();
    if (raw_data && getStateFromFips && duplicateMountainFunctions) {
      const {getPotentialDuplicate, mergeMountainsWithExistingData} = duplicateMountainFunctions;
      const geojson: Response = JSON.parse(raw_data)
      const errors: any[] = [];
      const mountains_without_states: EsriMountainDatum[] = [];
      const all_mountains: EsriMountainDatum[] = [];
      const potential_duplicates: {wilderlist: WilderlistMountainDatum, esri: EsriMountainDatum}[] = [];
      const merged_duplicates: MergedMountainDatum[] = [];
      geojson.features.forEach((f) => {
        if (!f.properties.name) {
          errors.push({reason: 'No name', ...f});
        } else if (!f.properties.stctyfips) {
          errors.push({reason: 'No stctyfips', ...f});
          const elevation = Math.round(metersToFeet(f.properties.elev_meter));
          const name = f.properties.name;
          mountains_without_states.push({
            esri_id: f.id,
            name, state: null, elevation,
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0],
          })
        } else if (!f.properties.elev_meter && f.properties.elev_meter !== 0) {
          errors.push({reason: 'No elev_meter', ...f});
        } else {
          const targetState = f.properties.stctyfips ? getStateFromFips(f.properties.stctyfips) : undefined;
          if (!targetState) {
            throw new Error('no matching state');
          }
          const name = f.properties.name;
          const elevation = Math.round(metersToFeet(f.properties.elev_meter));
          if (filteredStateAbbr) {
            if (targetState && targetState.abbreviation &&
                targetState.abbreviation.toLowerCase() === filteredStateAbbr.toLowerCase()) {
              const state = {$oid: targetState._id};
              const esriMountain = {
                esri_id: f.id,
                name, state, elevation,
                latitude: f.geometry.coordinates[1],
                longitude: f.geometry.coordinates[0],
              }
              const potentialDuplicate = getPotentialDuplicate(esriMountain);
              if (potentialDuplicate) {
                const duplicateAlreadyMerged = merged_duplicates.find((m) => m._id.$oid === potentialDuplicate._id.$oid);
                if (esriMountain.name === potentialDuplicate.name && !duplicateAlreadyMerged) {
                  merged_duplicates.push({
                    ...potentialDuplicate,
                    esri_id: esriMountain.esri_id,
                    name: esriMountain.name,
                    elevation: esriMountain.elevation,
                    latitude: esriMountain.latitude,
                    longitude: esriMountain.longitude,
                  })
                } else {
                  potential_duplicates.push({esri: esriMountain, wilderlist: potentialDuplicate})
                }
              } else {
                all_mountains.push({...esriMountain})
              }
            }
          } else {
            const state = targetState ? {$oid: targetState._id} : null;
            const esriMountain = {
              esri_id: f.id,
              name, state, elevation,
              latitude: f.geometry.coordinates[1],
              longitude: f.geometry.coordinates[0],
            }
            const potentialDuplicate = getPotentialDuplicate(esriMountain);
            if (potentialDuplicate) {
              const duplicateAlreadyMerged = merged_duplicates.find((m) => m._id.$oid === potentialDuplicate._id.$oid);
              if (esriMountain.name === potentialDuplicate.name && !duplicateAlreadyMerged) {
                merged_duplicates.push({
                  ...potentialDuplicate,
                  esri_id: esriMountain.esri_id,
                  elevation: esriMountain.elevation,
                  latitude: esriMountain.latitude,
                  longitude: esriMountain.longitude,
                })
              } else {
                potential_duplicates.push({esri: esriMountain, wilderlist: potentialDuplicate})
              }
            } else {
              all_mountains.push({...esriMountain})
            }
          }
        }
      })
      if (showErrors) {
        return mountains_without_states;
      }
      if (showDuplicates) {
        const duplicates_for_comparison = potential_duplicates.map(({wilderlist, esri}) => {
          return {
            esri_name: esri.name,
            wilderlist_name: wilderlist.name,
            esri_lat: esri.latitude,
            esri_long: esri.longitude,
            esri_elev: esri.elevation,
            wilderlist_lat: wilderlist.latitude,
            wilderlist_long: wilderlist.longitude,
            wilderlist_elev: wilderlist.elevation,
            esri_id: esri.esri_id,
            wilderlist_id: wilderlist._id.$oid,
          }
        })
        return duplicates_for_comparison;
      }
      if (showMergedDuplicates) {
        const merged_data = mergeMountainsWithExistingData(merged_duplicates);
        return merged_data;
      }
      return all_mountains;
    }
  } catch (e) {
    console.error(e);
  }
};