import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {xml2json} from 'xml-js';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getRecreation = axios.create({
  adapter: cache.adapter,
});

const getActiveRecreation = axios.create({
  adapter: cache.adapter,
});

export const baseUrl = 'https://ridb.recreation.gov/api/v1/facilities';

const backupBaseUrl =
  // `http://api.amp.active.com/camping/campgrounds/?landmarkName=true&api_key=${process.env.ACTIVE_API_CAMPING_KEY}`;
  `https://www.reserveamerica.com/campgroundSearch.do?landmarkName=true&xml=true&expwith=1&expfits=1`;

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

interface ReserveAmericaDatum {
  type: string;
  name: string;
  attributes: {
    agencyIcon: string;
    agencyName: string;
    availabilityStatus: string;
    contractID: string;
    contractType: string;
    facilityID: string;
    facilityName: string;
    faciltyPhoto: string;
    favorite: string;
    latitude: string;
    listingOnly: string;
    longitude: string;
    regionName: string;
    reservationChannel: string;
    shortName: string;
    sitesWithAmps: string;
    sitesWithPetsAllowed: string;
    sitesWithSewerHookup: string;
    sitesWithWaterHookup: string;
    sitesWithWaterfront: string;
    state: string;
  };
}

interface ReserveAmericaSuccessResponse {
  elements: Array<{
    type: string;
    name: string;
    attributes: {
      count: string;
      resultType: string;
    },
    elements: ReserveAmericaDatum[];
  }>;
}

export enum Sources {
  RecrationGov = 'recreationgov',
  ReserveAmerica = 'reserveamerica',
}

interface ReturnDatum {
  id: string;
  source: Sources;
  contractCode: string | null;
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
  'tent', 'shelter', 'camp', 'lean', 'platform', 'cabin', 'lodge', 'sleep', 'hut', 'resort',
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
          source: Sources.RecrationGov,
          contractCode: null,
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
    if (returnData.length < 50) {
      const altData = await getActiveRecreation(backupBaseUrl, {
        params: {
          landmarkLat: latitude, landmarkLong: longitude,
        },
      });
      if (altData && altData.data) {
        const reserveAmericaData = JSON.parse(xml2json(altData.data)) as ReserveAmericaSuccessResponse;
        if (reserveAmericaData && reserveAmericaData.elements &&
            reserveAmericaData.elements[0] && reserveAmericaData.elements[0].elements) {
          reserveAmericaData.elements[0].elements.forEach(campsite => {
            if (campsite && campsite.attributes) {
              const {
                facilityID, contractID, facilityName,
              } = campsite.attributes;
              returnData.push({
                id: facilityID,
                source: Sources.ReserveAmerica,
                contractCode: contractID,
                name: facilityName,
                description: null,
                directions: null,
                fee: null,
                contact: {
                  phone: null,
                  email: null,
                  reservationUrl:
                    `https://www.reserveamerica.com/campgroundDetails.do?contractCode=${
                      contractID
                    }&parkId=${
                      facilityID
                    }`,
                  mapUrl: null,
                },
                latitude: parseFloat(campsite.attributes.latitude),
                longitude: parseFloat(campsite.attributes.longitude),
              });
            }
          });
        }
      }
    }
    return returnData;

  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getRecreationData;
