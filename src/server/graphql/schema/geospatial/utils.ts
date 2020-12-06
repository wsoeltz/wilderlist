interface NearSphereBaseInput {
  latitude: number;
  longitude: number;
  maxDistance: number | null;
  minDistance: number | null;
  searchText: string | null;
}

export interface GeoSphereInput extends NearSphereBaseInput {
  limit: number;
}

export const buildNearSphereQuery = (input: NearSphereBaseInput & {field: string}) => {
  const {
    field, latitude, longitude, maxDistance, minDistance, searchText,
  } = input;
  const nearSphereQuery = {
    [field]: {
        $nearSphere: {
           $geometry: {
              type : 'Point',
              coordinates : [ longitude, latitude ],
           },
           $minDistance: minDistance ? minDistance : 0,
           $maxDistance: maxDistance ? maxDistance : 402336, // 250 miles
        },
     },
   };
  const query = searchText && searchText.length ? {
    ...nearSphereQuery,
     name: { $regex: searchText, $options: 'i' },
  } : nearSphereQuery;
  return query;
};
