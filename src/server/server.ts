require('dotenv').config();

import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import expressGraphQL from 'express-graphql';
import { redirectToHTTPS } from 'express-http-to-https';
import fs from 'fs';
import mongoose from 'mongoose';
import passport from 'passport';
import getCampsite from './api/getCampsite';
import getGeoSearch from './api/getGeoSearch';
import getGlobalSearch from './api/getGlobalSearch';
import getMountain from './api/getMountain';
import getNearestTrail from './api/getNearestTrail';
import getSearchCampsites from './api/getSearchCampsites';
import getSearchLists from './api/getSearchLists';
import getSearchMountains from './api/getSearchMountains';
import getSearchTrails from './api/getSearchTrails';
import getTrail, {
  getNamedParent,
} from './api/getTrail';
import facebookAuth from './auth/facebook';
import googleAuth from './auth/google';
import redditAuth from './auth/reddit';
import buildDataloaders from './dataloaders';
import {Trail} from './graphql/graphQLTypes';
import schema from './graphql/schema';
import {State} from './graphql/schema/queryTypes/stateType';
import {getStatesOrRegion} from './graphql/Utils';
import requireLogin from './middleware/requireLogin';
import notificationRoutes from './notifications';
import {
  getListData,
  getListDescription,
  getMountainData,
  getMtnDescription,
  getStateData,
  getType,
  Routes,
} from './routing';
import getSitemap, {getSiteMapIndex, SitemapType} from './routing/getSitemap';
import getGridApplication from './utilities/getGridApplication/index';
import getOgImage, {getDefaultOgImage} from './utilities/getOgImage';
import getRecreationData from './utilities/getRecreationData';
import getRecreationSiteData from './utilities/getRecreationSiteData';
import getStateByAbbreviation from './utilities/getStateByAbbreviation';
import getWeatherData from './utilities/getWeather';

require('./auth/passport');

const app = express();

app.use(redirectToHTTPS([/localhost:(\d{4})/], undefined, 301));

if (!process.env.COOKIE_KEY) {
  throw new Error('You must provide a COOKIE_KEY');
}

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Setup OAuth with Google
googleAuth(app);
// Setup OAuth with Reddit
redditAuth(app);
// Setup OAuth with Facebook
facebookAuth(app);

if (process.env.NODE_ENV === 'development') {
  // Allow all cors requests on development
  app.use(cors());
}

///// Setup MongoDb connection
if (process.env.MONGO_URI === undefined) {
  throw new Error('You must provide a MongoAtlas URI');
}
if (process.env.MONGO_AUTH_SOURCE === undefined) {
  throw new Error('You must provide a MongoDB authSource');
}
if (process.env.MONGO_DATABASE_NAME === undefined) {
  throw new Error('You must provide a dbName');
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  authSource: process.env.MONGO_AUTH_SOURCE,
  dbName: process.env.MONGO_DATABASE_NAME,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  // tslint:disable-next-line
    .once('open', () => console.log('Connected to MongoLab instance.'))
  // tslint:disable-next-line
    .on('error', error => console.log('Error connecting to MongoLab:', error));

const graphiql = process.env.NODE_ENV === 'development' ? true : false;
const dataloaders = buildDataloaders();
app.use(bodyParser.json());
app.use('/graphql', requireLogin, expressGraphQL((req: any) => ({
  schema,
  graphiql,
  context: {
    dataloaders,
    user: req.user,
  },
})));
///// End MongoDb Connection Setup

// Send invites to ascent added emails
notificationRoutes(app);

app.get('/api/global-search', async (req, res) => {
  try {
    const lat = req.query && req.query.lat ? parseFloat(req.query.lat) : undefined;
    const lng = req.query && req.query.lng ? parseFloat(req.query.lng) : undefined;
    const search = req.query && req.query.search ? req.query.search : undefined;
    const favor = req.query && req.query.favor ? req.query.favor : undefined;
    const user = req.res && req.res.req ? req.res.req.user : undefined;
    if (lat !== undefined && lng !== undefined && search !== undefined) {
      const searchData = await getGlobalSearch({lat, lng, search, favor, user});
      res.json(searchData);
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post('/api/mountain-search', async (req, res) => {
  try {
    const lat = req.body && req.body.lat ? parseFloat(req.body.lat) : undefined;
    const lng = req.body && req.body.lng ? parseFloat(req.body.lng) : undefined;
    const search = req.body && req.body.search ? req.body.search : undefined;
    const ignore = req.body && req.body.ignore ? req.body.ignore : [];
    if (lat !== undefined && lng !== undefined && search !== undefined) {
      const searchData = await getSearchMountains({lat, lng, search, ignore});
      res.json(searchData);
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post('/api/trail-search', async (req, res) => {
  try {
    const lat = req.body && req.body.lat ? parseFloat(req.body.lat) : undefined;
    const lng = req.body && req.body.lng ? parseFloat(req.body.lng) : undefined;
    const search = req.body && req.body.search ? req.body.search : undefined;
    const ignore = req.body && req.body.ignore ? req.body.ignore : [];
    if (lat !== undefined && lng !== undefined && search !== undefined) {
      const searchData = await getSearchTrails({lat, lng, search, ignore});
      res.json(searchData);
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post('/api/campsite-search', async (req, res) => {
  try {
    const lat = req.body && req.body.lat ? parseFloat(req.body.lat) : undefined;
    const lng = req.body && req.body.lng ? parseFloat(req.body.lng) : undefined;
    const search = req.body && req.body.search ? req.body.search : undefined;
    const ignore = req.body && req.body.ignore ? req.body.ignore : [];
    if (lat !== undefined && lng !== undefined && search !== undefined) {
      const searchData = await getSearchCampsites({lat, lng, search, ignore});
      res.json(searchData);
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post('/api/hiking-list-search', async (req, res) => {
  try {
    const lat = req.body && req.body.lat ? parseFloat(req.body.lat) : undefined;
    const lng = req.body && req.body.lng ? parseFloat(req.body.lng) : undefined;
    const search = req.body && req.body.search ? req.body.search : undefined;
    const ignore = req.body && req.body.ignore ? req.body.ignore : [];
    if (lat !== undefined && lng !== undefined && search !== undefined) {
      const searchData = await getSearchLists({lat, lng, search, ignore});
      res.json(searchData);
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post('/api/geo-search', async (req, res) => {
  try {
    const lat = req.body && req.body.lat ? parseFloat(req.body.lat) : undefined;
    const lng = req.body && req.body.lng ? parseFloat(req.body.lng) : undefined;
    const search = req.body && req.body.search ? req.body.search : undefined;
    if (lat !== undefined && lng !== undefined && search !== undefined) {
      const searchData = await getGeoSearch({lat, lng, search});
      res.json(searchData);
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post('/api/nearest-trail', async (req, res) => {
  try {
    const lat = req.body && req.body.lat ? parseFloat(req.body.lat) : undefined;
    const lng = req.body && req.body.lng ? parseFloat(req.body.lng) : undefined;
    const name = req.body && req.body.name && req.body.name.length
      ? req.body.name : null;
    const ignoreTypes = req.body && req.body.ignoreTypes && req.body.ignoreTypes.length
      ? req.body.ignoreTypes : [];
    if (lat !== undefined && lng !== undefined) {
      const trail = await getNearestTrail({
        coord: [lng, lat],
        name,
        ignoreTypes,
      });
      res.json(trail);
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post('/api/named-parent-trail', async (req, res) => {
  try {
    const id = req.body && req.body.id && req.body.id.length
      ? req.body.id : null;
    const trail = await getTrail(id);
    if (trail) {
      const parent = await getNamedParent(trail as unknown as Trail);
      if (parent) {
        res.json(parent);
      } else {
        res.json(trail);
      }
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post('/api/get-item', async (req, res) => {
  try {
    const id = req.body && req.body.id && req.body.id.length
      ? req.body.id : null;
    const type = req.body && req.body.itemType
      ? req.body.itemType : null;
    if (id !== null) {
      if (type === 'trails') {
        const trail = await getTrail(id);
        res.json(trail);
      } else if (type === 'mountains') {
        const mountain = await getMountain(id);
        res.json(mountain);
      } else if (type === 'campsites') {
        const campsite = await getCampsite(id);
        res.json(campsite);
      }
    } else {
      throw new Error('Missing parameters');
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query && req.query.lat ? req.query.lat : undefined;
    const lng = req.query && req.query.lng ? req.query.lng : undefined;
    const weatherData = await getWeatherData(lat, lng);
    res.json(weatherData);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.get('/api/recreationgov', async (req, res) => {
  try {
    const lat = req.query && req.query.lat ? req.query.lat : undefined;
    const lng = req.query && req.query.lng ? req.query.lng : undefined;
    const filter = req.query && req.query.filter ? req.query.filter : undefined;
    const recreationData = await getRecreationData(lat, lng, filter);
    res.json(recreationData);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.get('/api/recreationgovdetail', async (req, res) => {
  try {
    const id = req.query && req.query.id ? req.query.id : undefined;
    const contract = req.query && req.query.contract ? req.query.contract : undefined;
    const source = req.query && req.query.source ? req.query.source : undefined;
    const recreationData = await getRecreationSiteData(id, contract, source);
    res.json(recreationData);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.get('/api/state-by-abbreviation', async (req, res) => {
  try {
    const abbr = req.query && req.query.abbr ? req.query.abbr : undefined;
    if (abbr) {
      const stateData = await getStateByAbbreviation(abbr);
      res.json(stateData);
    } else {
      res.status(500);
      res.send({message: 'Missing abbreviation'});
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

const mountainOgImageUrl = '/og-image/mountain/:mountainId/image.jpg';
const setMountainOgImageUrl = (id: string) => mountainOgImageUrl.replace(':mountainId', id);
app.get(mountainOgImageUrl, async (req, res) => {
  try {
    const mtnData = await getMountainData(req.params.mountainId);
    const name = mtnData && mtnData.name ? mtnData.name : '';
    const elevation = mtnData && mtnData.elevation ? mtnData.elevation + 'ft' : '';
    const stateData = mtnData && mtnData.state !== null ?
      await getStateData(mtnData.state as unknown as string) : null;
    const state = stateData && stateData.name
      ? stateData.name + ' | ' : '';
    const subtext = state + elevation;
    const result = await getOgImage({text: name, subtext});
    res.type('image/jpeg');
    res.send(result);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

const peakListOgImageUrl = '/og-image/peaklist/:peakListId/image.jpg';
const setPeakListOgImageUrl = (id: string) => peakListOgImageUrl.replace(':peakListId', id);
app.get(peakListOgImageUrl, async (req, res) => {
  try {
    let peakListData = await getListData(req.params.peakListId);
    peakListData = peakListData && peakListData.parent ?
      await getListData(peakListData.parent as any as string) : peakListData;
    const id = peakListData && peakListData.id ? peakListData.id : '';
    const name = peakListData && peakListData.name ? peakListData.name : '';
    const numMountains = peakListData && peakListData.mountains ? peakListData.mountains.length : 0;
    const stateIds = peakListData && peakListData.states ? peakListData.states : [];
    /* tslint:disable:await-promise */
    const stateData = await State.find({_id: {$in: stateIds}});
    const stateOrRegionText = await getStatesOrRegion(stateData as any, undefined, id);
    const subtext = numMountains + ' peaks | ' + stateOrRegionText;
    const result = await getOgImage({text: name, subtext});
    res.type('image/jpeg');
    res.send(result);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

if (process.env.NODE_ENV === 'production') {

  const baseUrl = 'https://www.wilderlist.app';
  const defaultTitle = 'Wilderlist';
  const defaultDescription = 'Track, plan and share your hiking and mountaineering adventures.';
  const defaultOgImageUrl = '/og-image/default/image.jpg';

  const path = require('path');

  app.get(defaultOgImageUrl, async (req, res) => {
    try {
      const result = await getDefaultOgImage();
      res.type('image/jpeg');
      res.send(result);
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  });

  app.get('/sitemap/index.xml', async (req, res) => {
    try {
      const result = await getSiteMapIndex();
      res.type('application/xml');
      res.send(result);
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  });

  app.get('/sitemap/general-sitemap.xml', async (req, res) => {
    try {
      const result = await getSitemap(SitemapType.General);
      res.type('application/xml');
      res.send(result);
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  });

  app.get('/sitemap/:stateId/:sitemaptype/sitemap.xml', async (req, res) => {
    try {
      const stateId = req.params.stateId;
      const sitemapType = req.params.sitemaptype;
      const result = await getSitemap(sitemapType, stateId);
      res.type('application/xml');
      res.send(result);
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  });

  app.get('/download/grid-application.xlsx', async (req, res) => {
    if (!req.user) {
      throw new Error('You must be logged in');
    }
    try {
      const fileName = 'grid-application.xlsx';
      const workbook = await getGridApplication(req.user);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
      if (workbook !== undefined) {
        await workbook.xlsx.write(res);
        res.end();
      } else {
        throw new Error('Unable to write to xlsx');
      }
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  });

  app.get(Routes.Landing, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');
    const canonicalUrl = baseUrl + req.path;

    // read in the index.html file
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.error(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, defaultTitle);
      data = data.replace(/\$CANONICAL_URL/g, canonicalUrl);
      data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
      const result  = data.replace(/\$OG_DESCRIPTION/g, defaultDescription);
      res.send(result);
    });

  });

  // Express will serve up production assets
  // like our main.js or main.css file
  app.use(express.static('client/build'));

  // Serve up different meta data depending on the route, only necessary
  // for pages that can be seen without logging in
  app.get(Routes.PrivacyPolicy, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.error(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, 'Privacy Policy - Wilderlist');
      data = data.replace(/\$CANONICAL_URL/g,
        `https://www.wilderlist.app/list/${Routes.PrivacyPolicy}`,
      );
      data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
      const result  = data.replace(/\$OG_DESCRIPTION/g, "Read Wilderlist's Privacy Policy.");
      res.send(result);
    });

  });
  app.get(Routes.TermsOfUse, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.error(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, 'Terms of Use - Wilderlist');
      data = data.replace(/\$CANONICAL_URL/g,
        `https://www.wilderlist.app/list/${Routes.TermsOfUse}`,
      );
      data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
      const result  = data.replace(/\$OG_DESCRIPTION/g, "Read Wilderlist's Terms of Use.");
      res.send(result);
    });

  });

  app.get(Routes.ListDetail, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      if (req.params.id === 'search') {
        data = data.replace(/\$OG_TITLE/g, 'Search Hiking Lists - Wilderlist');
        data = data.replace(/\$CANONICAL_URL/g, `https://www.wilderlist.app/list/search`);
        data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
        const result  =
          data.replace(/\$OG_DESCRIPTION/g,
            /* tslint:disable */
            'Search for hiking lists like the New Hampshire 4000 Footers, New England 100 Highest, the Adirondack 46ers, and many more.');
          /* tslint:enable */
        res.send(result);
      } else {
        try {
          const listData = await getListData(req.params.id);
          if (listData !== null) {
            // replace the special strings with server generated strings
            data = data.replace(/\$OG_TITLE/g,
              `${listData.name + getType(listData.type)} - Wilderlist`,
            );
            data = data.replace(/\$CANONICAL_URL/g,
              `https://www.wilderlist.app/list/${req.params.id}`,
            );
            data = data.replace(/\$OG_IMAGE/g, setPeakListOgImageUrl(req.params.id));
            const description = await getListDescription(listData);
            const result  = data.replace(/\$OG_DESCRIPTION/g, description);
            res.send(result);
          } else {
            throw new Error('Incorrect List ID ' + req.params.id);
          }

        } catch (err) {

          console.error(err);
          // replace the special strings with the default generated strings
          const canonicalUrl = baseUrl + req.path;
          data = data.replace(/\$OG_TITLE/g, defaultTitle);
          data = data.replace(/\$CANONICAL_URL/g, canonicalUrl);
          data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
          const result  = data.replace(/\$OG_DESCRIPTION/g, defaultDescription);
          res.send(result);

        }
      }

    });

  });

  app.get([
    Routes.DEPRECATED_ListsWithDetail,
    Routes.DEPRECATED_ListDetailWithMountainDetail,
  ], (req, res) => {
    res.redirect(Routes.ListDetail.replace(':id', req.params.id));
  });

  app.get([
    Routes.DEPRECATED_MountainSearchWithDetail,
  ], (req, res) => {
    res.redirect(Routes.MountainDetail.replace(':id', req.params.id));
  });

  app.get(Routes.MountainDetail, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      if (req.params.id === 'search') {
        data = data.replace(/\$OG_TITLE/g, 'Search Mountains - Wilderlist');
        data = data.replace(/\$CANONICAL_URL/g, `https://www.wilderlist.app/mountains/search`);
        data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
        const result  =
          data.replace(/\$OG_DESCRIPTION/g, 'Search for mountains and find maps, trails, weather and trip reports.');
        res.send(result);
      } else {
        try {
          const mtnData = await getMountainData(req.params.id);
          if (mtnData !== null) {
            const stateData = mtnData.state !== null ?
              await getStateData(mtnData.state as unknown as string) : null;
            const state = stateData && stateData.name
              ? `, ${stateData.name}` : '';
            // replace the special strings with server generated strings
            const title = `${mtnData.name + state} - Wilderlist`;
            data = data.replace(/\$OG_TITLE/g, title);
            data = data.replace(/\$CANONICAL_URL/g,
              `https://www.wilderlist.app/mountain/${req.params.id}`,
            );
            data = data.replace(/\$OG_IMAGE/g, setMountainOgImageUrl(req.params.id));
            const description = await getMtnDescription(mtnData, stateData);
            const result  = data.replace(/\$OG_DESCRIPTION/g, description);
            res.send(result);
          } else {
            throw new Error('Incorrect List ID ' + req.params.id);
          }

        } catch (err) {

          console.error(err);
          // replace the special strings with the default generated strings
          const canonicalUrl = baseUrl + req.path;
          data = data.replace(/\$OG_TITLE/g, defaultTitle);
          data = data.replace(/\$CANONICAL_URL/g, canonicalUrl);
          data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
          const result  = data.replace(/\$OG_DESCRIPTION/g, defaultDescription);
          res.send(result);

        }
      }

    });

  });

  // Express will serve up index.html if it
  // does not recognize the route
  // routingWithMetaData(app);

  app.get('*', (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');
    const canonicalUrl = baseUrl + req.path;

    // read in the index.html file
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.error(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, defaultTitle);
      data = data.replace(/\$CANONICAL_URL/g, canonicalUrl);
      data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
      const result  = data.replace(/\$OG_DESCRIPTION/g, defaultDescription);
      res.send(result);
    });

  });
}

export default app;
