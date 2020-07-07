import {EsriMountainDatum} from './';
const fs = require('fs');
const path = require('path');

const file = (
      path.join(__dirname, '../../../../src/server/utilities/mountainsImportUtility/wilderlist_mountains.json'));

interface ObjectId { $oid: string }

interface Mountain {
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

/* distance formula from
https://stackoverflow.com/
questions/18883601/function-to-calculate-distance-between-two-coordinates
*/
interface DistanceInput {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}

const deg2rad = (deg: number) => deg * (Math.PI / 180);

const getDistanceFromLatLonInKm = ({lat1, lon1, lat2, lon2}: DistanceInput) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const getDistanceFromLatLonInMiles = (input: DistanceInput) =>
  getDistanceFromLatLonInKm(input) * 0.62137;

interface MergedMountainDatum extends Mountain {
  esri_id: string | null;
}

export default async () => {
  try {
    const raw_data = await fs.readFileSync(file, 'utf8');
    const mountains: Mountain[] = JSON.parse(raw_data)
    const getPotentialDuplicate = (esriMountain: EsriMountainDatum) => {
      return mountains.find(({state, latitude, longitude}) => {
        if (state && state.$oid && esriMountain.state && esriMountain.state.$oid
            && state.$oid + '' === esriMountain.state.$oid + '') {
          const distanceInMiles = getDistanceFromLatLonInMiles({
            lat1: latitude, lon1: longitude,
            lat2: esriMountain.latitude, lon2: esriMountain.longitude,
          })
          if (distanceInMiles < 0.075) {
            return true;
          }
        }
        return false;
      })
    }
    const mergeMountainsWithExistingData = (mergedMountains: MergedMountainDatum[]): MergedMountainDatum[] => {
      return mountains.map(mtn => {
        const updatedMountain = mergedMountains.find(({_id}) => _id.$oid + '' === mtn._id.$oid + '');
        if (updatedMountain) {
          return updatedMountain;
        } else {
          return {...mtn, esri_id: null}
        }
      })
    }
    return {getPotentialDuplicate, mergeMountainsWithExistingData}
  } catch (e) {
    console.error(e);
    return null;
  }
}