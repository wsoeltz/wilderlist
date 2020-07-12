/* tslint:disable:await-promise */
import { Mountain } from '../graphql/schema/queryTypes/mountainType';
import { PeakList } from '../graphql/schema/queryTypes/peakListType';
import { State } from '../graphql/schema/queryTypes/stateType';

export enum SitemapType {
  PeakList = 'peaklists',
  Mountain = 'mountains',
  General = 'general',
}

export const getSiteMapIndex = async () => {
  const baseUrl = 'https://www.wilderlist.app/sitemap';
  const header = '<?xml version="1.0" encoding="UTF-8"?>' +
                  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const footer = '</sitemapindex>';

  let data =
    '<sitemap>' +
      `<loc>${baseUrl}/general-sitemap.xml</loc>` +
    '</sitemap>';
  try {
    const states = await State.find({});
    states.forEach(state => {
      if (state && (state.id || state._id)) {
          const id = state.id ? state.id : state._id;
          if (state.mountains && state.mountains.length) {
            data +=
              '<sitemap>' +
                `<loc>${baseUrl}/${id}/${SitemapType.Mountain}/sitemap.xml</loc>` +
              '</sitemap>';
          }
          if (state.peakLists && state.peakLists.length) {
            data +=
              '<sitemap>' +
                `<loc>${baseUrl}/${id}/${SitemapType.PeakList}/sitemap.xml</loc>` +
              '</sitemap>';
          }
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
              '</url>';
          }
        });
      }
    }

    if (type === SitemapType.General) {
      data +=
        '<url>' +
          `<loc>${baseUrl}</loc>` +
        '</url>';
      // Search Lists
      data +=
        '<url>' +
          `<loc>${baseUrl}lists/search</loc>` +
        '</url>';
      // Search Mountains
      data +=
        '<url>' +
          `<loc>${baseUrl}lists/search</loc>` +
        '</url>';
      // Privacy Policy
      data +=
        '<url>' +
          `<loc>${baseUrl}privacy-policy</loc>` +
        '</url>';
      // Terms of Use
      data +=
        '<url>' +
          `<loc>${baseUrl}terms-of-use</loc>` +
        '</url>';
    }
    return header + data + footer;
  } catch (err) {
    console.error(err);
    return null;
  }
};
