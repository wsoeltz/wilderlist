import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getRecreation = axios.create({
  adapter: cache.adapter,
});

const baseUrl = 'https://ridb.recreation.gov/api/v1/facilities';

type Longitude = number;
type Latitude = number;

interface RecreationDatum {
  FacilityID: string;
  LegacyFacilityID: string;
  OrgFacilityID: string;
  ParentOrgID: string;
  ParentRecAreaID: string;
  FacilityName: string;
  FacilityDescription: string;
  FacilityTypeDescription: string;
  FacilityUseFeeDescription: string;
  FacilityDirections: string;
  FacilityPhone: string;
  FacilityEmail: string;
  FacilityReservationURL: string;
  FacilityMapURL: string;
  FacilityAdaAccess: string;
  GEOJSON: {
    TYPE: string;
    COORDINATES: [Longitude, Latitude]
  };
  FacilityLongitude: Longitude;
  FacilityLatitude: Latitude;
  Keywords: string;
  StayLimit: string;
  Reservable: boolean;
  Enabled: boolean;
  LastUpdatedDate: string;
}

interface SuccessResponse {
  RECDATA: RecreationDatum[];
  METADATA: {
    RESULTS: {
      CURRENT_COUNT: number,
      TOTAL_COUNT: number,
    },
    SEARCH_PARAMETERS: {
      QUERY: string,
      LIMIT: number,
      OFFSET: number,
    },
  };
}

interface ReturnDatum {
  id: string;
  name: string;
  description: string | null;
  directions: string | null;
  fee: string | null;
  contact: {
    phone: string | null;
    email: string | null;
    reservationUrl: string | null;
    mapUrl: string | null;
  };
  latitude: Latitude;
  longitude: Longitude;
}

enum Filter {
  campsites = 'campsites',
  trailheads = 'trailheads',
}

const campingKeywords = [
  'tent', 'shelter', 'camp', 'lean', 'platform', 'cabin', 'lodge', 'sleep', 'site', 'hut', 'resort',
];

const trailKeywords = [
  'trailhead',
];

const filterDatum = (fields: string[], filter: Filter | undefined): boolean => {
  let shouldSkip = false;
  if (filter !== undefined) {
    let keywords: string[];
    if (filter === Filter.trailheads) {
      keywords = trailKeywords;
    } else {
      keywords = campingKeywords;
    }
    shouldSkip = !(new RegExp(keywords.join('|')).test(fields.join(' ').toLowerCase()));
  }
  return shouldSkip;
};

const getRecreationData = async (latitude: string, longitude: string, filter: Filter | undefined) => {
  const baseParams = {
    apikey: process.env.RECREATION_DOT_GOV_API_KEY,
    limit: 50,
    latitude, longitude,
    sort: 'Date',
  };
  try {
    const highDetail = await getRecreation(baseUrl, {
        params: {
          ...baseParams,
          radius: 10,
          lastupdated: '10-01-1990',
        },
      });
    const lowDetail = await getRecreation(baseUrl, {
        params: {
          ...baseParams,
          radius: 50,
          lastupdated: '10-01-2005',
        },
      });
    let combinedData: RecreationDatum[] = [];
    if (highDetail && highDetail.data) {
      combinedData = (highDetail.data as SuccessResponse).RECDATA;
    }
    if (lowDetail && lowDetail.data) {
      combinedData = [...combinedData, ...(lowDetail.data as SuccessResponse).RECDATA];
    }
    const allIds: string[] = [];
    const returnData: ReturnDatum[] = [];
    combinedData.forEach(datum => {
      const {
        FacilityID, FacilityName,
        FacilityDescription, FacilityTypeDescription,
        FacilityUseFeeDescription, FacilityDirections,
        FacilityPhone, FacilityEmail,
        FacilityReservationURL, FacilityMapURL,
        FacilityLongitude, FacilityLatitude,
      } = datum;
      const shouldSkip = filterDatum([
        FacilityName, FacilityDescription, FacilityTypeDescription,
      ], filter);
      if (!allIds.includes(FacilityID) && !shouldSkip) {
        allIds.push(FacilityID);
        returnData.push({
          id: FacilityID,
          name: FacilityName,
          description: FacilityDescription && FacilityDescription.length ? FacilityDescription : null,
          directions: FacilityDirections && FacilityDirections.length ? FacilityDirections : null,
          fee: FacilityUseFeeDescription && FacilityUseFeeDescription.length ? FacilityUseFeeDescription : null,
          contact: {
            phone: FacilityPhone && FacilityPhone.length ? FacilityPhone : null,
            email: FacilityEmail && FacilityEmail.length ? FacilityEmail : null,
            reservationUrl: FacilityReservationURL && FacilityReservationURL.length ? FacilityReservationURL : null,
            mapUrl: FacilityMapURL && FacilityMapURL.length ? FacilityMapURL : null,
          },
          latitude: FacilityLatitude,
          longitude: FacilityLongitude,
        });
      }
    });
    return returnData;

  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getRecreationData;
