import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';
import {xml2json} from 'xml-js';
import {baseUrl} from './getRecreationData';
import {Sources} from './getRecreationData';

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getRecreationSite = axios.create({
  adapter: cache.adapter,
});

const getReserveAmericaSite = axios.create({
  adapter: cache.adapter,
});

interface RecreationMediaDatum {
EntityMediaID: string;
MediaType: string;
EntityID: string;
EntityType: string;
Title: string;
Subtitle: string;
Description: string;
EmbedCode: string;
Height: number;
Width: number;
URL: string;
Credits: string;
IsPrimary: boolean;
IsPreview: boolean;
IsGallery: boolean;
}

interface SuccessResponse {
  RECDATA: RecreationMediaDatum[];
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

interface ReserveAmericaSiteAttributes {
  alert: string;
  contractID: string;
  description: string;
  drivingDirection: string;
  facilitiesDescription: string;
  facility: string;
  facilityID: string;
  favorite: string;
  fullReservationUrl: string;
  importantInformation: string;
  latitude: string;
  listingOnly: string;
  longitude: string;
  nearbyAttrctionDescription: string;
  note: string;
  orientationDescription: string;
  recreationDescription: string;
  regionName: string;
  reservationUrl: string;
  webURL: string;
}

type ReserveAmericaSiteElement = {
  name: 'address',
  attributes: {
    city: string;
    country: string;
    shortName: string;
    state: string;
    streetAddress: string;
    zip: string;
  },
} | {
  name: 'photo',
  attributes: {
    realUrl: string;
    url: string;
  },
} | {
  name: 'contact',
  attributes: {
    name: string,
    number: string,
  },
};

interface ReserveAmericaSuccessResponse {
  elements: Array<{
    attributes: ReserveAmericaSiteAttributes;
    elements: ReserveAmericaSiteElement[];
  }>;
}

interface ReturnValue {
  id: string;
  image: string | null;
  description: string | null;
  directions: string | null;
  contact: {
    phone: string | null;
    email: string | null;
    reservationUrl: string | null;
    mapUrl: string | null;
  };
}

const getRecreationSiteData = async (id: string, contract: string | undefined, source: Sources) => {
  const baseParams = {
    apikey: process.env.RECREATION_DOT_GOV_API_KEY,
    limit: 50,
  };
  try {
    const returnDatum: ReturnValue = {
      id: '',
      image: null,
      description: null,
      directions: null,
      contact: {
        phone: null,
        email: null,
        reservationUrl: null,
        mapUrl: null,
      },
    };
    if (source === Sources.RecrationGov) {
      const media = await getRecreationSite(baseUrl + '/' + id + '/media', {
          params: {
            ...baseParams,
            radius: 10,
            lastupdated: '10-01-1990',
          },
        });
      if (media && media.data && (media.data as SuccessResponse).RECDATA.length) {
        const data = (media.data as SuccessResponse).RECDATA;
        const primaryImage = data.find(({IsPrimary}) => IsPrimary);
        if (primaryImage && primaryImage.URL) {
          returnDatum.image = primaryImage.URL;
        } else if (data[0].URL) {
          returnDatum.image = data[0].URL;
        }
      }
    } else if (source === Sources.ReserveAmerica && contract !== undefined) {
      const media = await getReserveAmericaSite(
        `http://www.reserveamerica.com/campgroundDetails.do?contractCode=${contract}&parkId=${id}&xml=true`, {
        jar: cookieJar,
        withCredentials: true,
      });
      if (media && media.data) {
        const reserveAmericaData = JSON.parse(xml2json(media.data)) as ReserveAmericaSuccessResponse;
        if (reserveAmericaData && reserveAmericaData.elements && reserveAmericaData.elements[0]) {
          const {attributes, elements} = reserveAmericaData.elements[0];
          if (attributes) {
            if (attributes.facilitiesDescription) {
              returnDatum.description = attributes.facilitiesDescription;
            } else if (attributes.description) {
              returnDatum.description = attributes.description;
            }
            if (attributes.drivingDirection) {
              returnDatum.directions = attributes.drivingDirection;
            }
            if (attributes.fullReservationUrl) {
              returnDatum.contact.reservationUrl = attributes.fullReservationUrl;
            } else if (attributes.webURL) {
              returnDatum.contact.reservationUrl = attributes.webURL;
            }
            const imageElement = elements.find(({name}) => name === 'photo');
            if (imageElement && imageElement.name === 'photo' && imageElement.attributes) {
              returnDatum.image = 'https://www.reserveamerica.com' + imageElement.attributes.realUrl;
            }
            const phoneElement = elements.find(({name}) => name === 'contact');
            if (phoneElement && phoneElement.name === 'contact' && phoneElement.attributes) {
              returnDatum.contact.phone = phoneElement.attributes.number;
            }
          }
        }
      }
    }
    return returnDatum;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getRecreationSiteData;
