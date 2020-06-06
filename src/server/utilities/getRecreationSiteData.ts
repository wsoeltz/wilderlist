import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {baseUrl} from './getRecreationData';

const cache: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});

const getRecreationSite = axios.create({
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

const getRecreationSiteData = async (id: string) => {
  const baseParams = {
    apikey: process.env.RECREATION_DOT_GOV_API_KEY,
    limit: 50,
  };
  try {
    const media = await getRecreationSite(baseUrl + '/' + id + '/media', {
        params: {
          ...baseParams,
          radius: 10,
          lastupdated: '10-01-1990',
        },
      });
    let image: string | null = null;
    if (media && media.data && (media.data as SuccessResponse).RECDATA.length) {
      const data = (media.data as SuccessResponse).RECDATA;
      const primaryImage = data.find(({IsPrimary}) => IsPrimary);
      if (primaryImage && primaryImage.URL) {
        image = primaryImage.URL;
      } else if (data[0].URL) {
        image = data[0].URL;
      }
    }
    return {id, image};
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default getRecreationSiteData;
