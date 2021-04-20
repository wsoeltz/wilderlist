/* tslint:disable:await-promise */
import { Campsite } from '../graphql/schema/queryTypes/campsiteType';
import { Mountain } from '../graphql/schema/queryTypes/mountainType';
import { PeakList } from '../graphql/schema/queryTypes/peakListType';
import { State } from '../graphql/schema/queryTypes/stateType';

export enum SitemapType {
  PeakList = 'peaklists',
  Mountain = 'mountains',
  Campsite = 'campsites',
  General = 'general',
}

const lastMajorUpdate = '2021-04-20';

export const getSiteMapIndex = async () => {
  const baseUrl = 'https://www.wilderlist.app/sitemap';
  const header = '<?xml version="1.0" encoding="UTF-8"?>' +
                  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const footer = '</sitemapindex>';

  let data =
    '<sitemap>' +
      `<loc>${baseUrl}/general-sitemap.xml</loc>` +
      `<lastmod>${lastMajorUpdate}</lastmod>` +
    '</sitemap>';
  try {
    const states = await State.find({});
    states.forEach(state => {
      if (state && (state.id || state._id)) {
        const id = state.id ? state.id : state._id;
        // Add a sitemap for mountains for every state
        data +=
          '<sitemap>' +
            `<loc>${baseUrl}/${id}/${SitemapType.Mountain}/sitemap.xml</loc>` +
            `<lastmod>${lastMajorUpdate}</lastmod>` +
          '</sitemap>';
        data +=
        // Add a sitemap for lists for every state
          '<sitemap>' +
            `<loc>${baseUrl}/${id}/${SitemapType.PeakList}/sitemap.xml</loc>` +
            `<lastmod>${lastMajorUpdate}</lastmod>` +
          '</sitemap>';
        data +=
        // Add a sitemap for campsites for every state
          '<sitemap>' +
            `<loc>${baseUrl}/${id}/${SitemapType.Campsite}/sitemap.xml</loc>` +
          '</sitemap>';
      }
    });
    return header + data + footer;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default async (type: SitemapType , stateId?: string) => {
  const baseUrl = 'https://www.wilderlist.app/';
  const header = '<?xml version="1.0" encoding="UTF-8"?>' +
                  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const footer = '</urlset>';
  let data = '';
  try {
    if (stateId) {
      if (type === SitemapType.PeakList) {
        const listData = await PeakList.find({states: stateId});
        // All List Detail Pages
        listData.forEach(list => {
          if (list && (list.id || list._id)) {
            const id = list.id ? list.id : list._id;
            data +=
              '<url>' +
                `<loc>${baseUrl}list/${id}</loc>` +
                `<lastmod>${lastMajorUpdate}</lastmod>` +
              '</url>';
          }
        });
      }

      if (type === SitemapType.Mountain) {
        const mtnData = await Mountain.find({state: stateId});
        // All Mountain Detail Pages
        mtnData.forEach(mtn => {
          if (mtn && (mtn.id || mtn._id)) {
            const id = mtn.id ? mtn.id : mtn._id;
            data +=
              '<url>' +
                `<loc>${baseUrl}mountain/${id}</loc>` +
                `<lastmod>${lastMajorUpdate}</lastmod>` +
              '</url>';
          }
        });
      }

      if (type === SitemapType.Campsite) {
        const mtnData = await Campsite.find({state: stateId});
        // All Campsite Detail Pages
        mtnData.forEach(campsite => {
          if (campsite && (campsite.id || campsite._id)) {
            const id = campsite.id ? campsite.id : campsite._id;
            data +=
              '<url>' +
                `<loc>${baseUrl}campsite/${id}</loc>` +
              '</url>';
          }
        });
      }
    }

    if (type === SitemapType.General) {
      data +=
        '<url>' +
          `<loc>${baseUrl}</loc>` +
          `<lastmod>${lastMajorUpdate}</lastmod>` +
        '</url>';
      // Search Lists
      data +=
        '<url>' +
          `<loc>${baseUrl}list/search</loc>` +
          `<lastmod>${lastMajorUpdate}</lastmod>` +
        '</url>';
      // Search Mountains
      data +=
        '<url>' +
          `<loc>${baseUrl}mountain/search</loc>` +
          `<lastmod>${lastMajorUpdate}</lastmod>` +
        '</url>';
      // Search Trails
      data +=
        '<url>' +
          `<loc>${baseUrl}trail/search</loc>` +
          `<lastmod>${lastMajorUpdate}</lastmod>` +
        '</url>';
      // Search Campsites
      data +=
        '<url>' +
          `<loc>${baseUrl}campsite/search</loc>` +
          `<lastmod>${lastMajorUpdate}</lastmod>` +
        '</url>';
      // Privacy Policy
      data +=
        '<url>' +
          `<loc>${baseUrl}privacy-policy</loc>` +
          `<lastmod>${lastMajorUpdate}</lastmod>` +
        '</url>';
      // Terms of Use
      data +=
        '<url>' +
          `<loc>${baseUrl}terms-of-use</loc>` +
          `<lastmod>${lastMajorUpdate}</lastmod>` +
        '</url>';
      // About
      data +=
        '<url>' +
          `<loc>${baseUrl}about</loc>` +
          `<lastmod>${lastMajorUpdate}</lastmod>` +
        '</url>';
    }
    return header + data + footer;
  } catch (err) {
    console.error(err);
    return null;
  }
};
