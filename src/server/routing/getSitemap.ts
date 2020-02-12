/* tslint:disable:await-promise */
import { Mountain } from '../graphql/schema/queryTypes/mountainType';
import { PeakList } from '../graphql/schema/queryTypes/peakListType';

export default async () => {
  const baseUrl = 'https://wwww.wilderlist.app/';
  const header = '<?xml version="1.0" encoding="UTF-8"?>' +
                  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const footer = '</urlset>';
  let data =
    '<url>' +
      `<loc>${baseUrl}</loc>` +
    '</url>';
  try {
    const listDate = await PeakList.find({});
    // All List Detail Pages
    listDate.forEach(list => {
      if (list && (list.id || list._id)) {
        const id = list.id ? list.id : list._id;
        data +=
          '<url>' +
            `<loc>${baseUrl}list/${id}</loc>` +
          '</url>';
      }
    });
    const mtnDate = await Mountain.find({});
    // All Mountain Detail Pages
    mtnDate.forEach(mtn => {
      if (mtn && (mtn.id || mtn._id)) {
        const id = mtn.id ? mtn.id : mtn._id;
        data +=
          '<url>' +
            `<loc>${baseUrl}mountain/${id}</loc>` +
          '</url>';
      }
    });
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
    return header + data + footer;
  } catch (err) {
    console.error(err);
    return null;
  }
};
