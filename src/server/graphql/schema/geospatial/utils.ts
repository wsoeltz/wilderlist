interface NearSphereBaseInput {
  locationField: string;
  latitude: number;
  longitude: number;
  maxDistance: number | null;
}

export interface GeoSphereInput extends NearSphereBaseInput {
  limit: number;
}

export interface TextPlusGeoWithinInput {
  latitude: number;
  longitude: number;
  maxDistance: number;
  searchText: string;
  limit: number;
}

export const buildNearSphereQuery = (input: NearSphereBaseInput) => {
  const {
    locationField, latitude, longitude, maxDistance,
  } = input;
  return {
    [locationField]: {
        $nearSphere: {
           $geometry: {
              type : 'Point',
              coordinates : [ longitude, latitude ],
           },
           $maxDistance: maxDistance ? maxDistance : 2414016, // 1500 miles
        },
     },
   };
};
