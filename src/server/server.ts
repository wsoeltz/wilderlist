require('dotenv').config();

import bodyParser from 'body-parser';
import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import expressGraphQL from 'express-graphql';
import { redirectToHTTPS } from 'express-http-to-https';
import fs from 'fs';
import upperFirst from 'lodash/upperFirst';
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
  formatType,
  getAutoRouteDescription,
  getAutoRouteTitle,
  getCampsiteDescription,
  getListData,
  getListDescription,
  getMountainData,
  getMtnDescription,
  getParkingData,
  getSummitViewDescription,
  getTrailDescription,
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

// enable gzip compression
app.use(compression());

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
const mongodbUri = process.env.MONGO_URI;
const mongodbOpt = {
  authSource: process.env.MONGO_AUTH_SOURCE,
  dbName: process.env.MONGO_DATABASE_NAME,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.Promise = global.Promise;
const connect = function() {
  mongoose.connect(mongodbUri, mongodbOpt);
};
connect();

mongoose.connection
  // tslint:disable-next-line
    .on('open', () => console.log('Connected to MongoLab instance.'));
  // tslint:disable-next-line
mongoose.connection
    .on('error', error => console.error('Error connecting to MongoLab:', error));

mongoose.connection.on('disconnected', () => {
    console.error('MongoLab disconnected');
    setTimeout(connect, 5000);
});

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
    const state = mtnData && mtnData.locationTextShort
      ? mtnData.locationTextShort + ' | ' : '';
    const subtext = state + elevation;
    const result = await getOgImage({text: name, subtext});
    res.type('image/jpeg');
    res.send(result);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

const trailOgImageUrl = '/og-image/trail/:trailId/image.jpg';
const setTrailOgImageUrl = (id: string) => trailOgImageUrl.replace(':trailId', id);
app.get(trailOgImageUrl, async (req, res) => {
  try {
    const trailData = await getTrail(req.params.trailId);
    const formattedType = upperFirst(formatType(trailData && trailData.type ? trailData.type : 'parent_trail'));
    const name = trailData && trailData.name ? trailData.name : formattedType;
    const trailLength = trailData && trailData.trailLength ? trailData.trailLength : 0;
    const numericDistance = trailLength < 0.1
      ? Math.round(trailLength * 5280)
      : parseFloat(trailLength.toFixed(1));
    const distanceUnit = trailLength < 0.1 ? 'ft' : 'mi';
    const state = trailData && trailData.locationTextShort
      ? trailData.locationTextShort + ' | ' : '';
    const subtext = state + numericDistance + distanceUnit;
    const result = await getOgImage({text: name, subtext});
    res.type('image/jpeg');
    res.send(result);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

const campsiteOgImageUrl = '/og-image/campsite/:campsiteId/image.jpg';
const setCampsiteOgImageUrl = (id: string) => campsiteOgImageUrl.replace(':campsiteId', id);
app.get(campsiteOgImageUrl, async (req, res) => {
  try {
    const campsiteData = await getCampsite(req.params.campsiteId);
    const formattedType = upperFirst(formatType(campsiteData ? campsiteData.type : ''));
    const name = campsiteData && campsiteData.name ? campsiteData.name : formattedType;
    const state = campsiteData && campsiteData.locationTextShort
      ? campsiteData.locationTextShort + ' | ' : '';
    const subtext = state + formattedType;
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
  app.get(Routes.About, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        return console.error(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, 'About - Wilderlist');
      data = data.replace(/\$CANONICAL_URL/g,
        `https://www.wilderlist.app/list/${Routes.TermsOfUse}`,
      );
      data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
      const result  = data.replace(/\$OG_DESCRIPTION/g, 'Learn more about Wilderlist.');
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
            'Search for popular hiking lists across the USA.');
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
            const description = getListDescription(listData);
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
        data = data.replace(/\$CANONICAL_URL/g, `https://www.wilderlist.app/mountain/search`);
        data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
        const result  =
          data.replace(/\$OG_DESCRIPTION/g, 'Search for mountains and find maps, trails, weather and trip reports.');
        res.send(result);
      } else {
        try {
          const mtnData = await getMountainData(req.params.id);
          if (mtnData !== null) {
            // replace the special strings with server generated strings
            const title = `${mtnData.name}, ${mtnData.locationTextShort} - Wilderlist`;
            data = data.replace(/\$OG_TITLE/g, title);
            data = data.replace(/\$CANONICAL_URL/g,
              `https://www.wilderlist.app/mountain/${req.params.id}`,
            );
            data = data.replace(/\$OG_IMAGE/g, setMountainOgImageUrl(req.params.id));
            const description = await getMtnDescription(mtnData);
            const result  = data.replace(/\$OG_DESCRIPTION/g, description);
            res.send(result);
          } else {
            throw new Error('Incorrect Mountain ID ' + req.params.id);
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
  app.get(Routes.SummitView, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      try {
        const mtnData = await getMountainData(req.params.id);
        if (mtnData !== null) {
          // replace the special strings with server generated strings
          const title = `Summit view of ${mtnData.name}, ${mtnData.locationTextShort} - Wilderlist`;
          data = data.replace(/\$OG_TITLE/g, title);
          const lat = req.params.lat;
          const lng = req.params.lng;
          const altitude = req.params.altitude;
          data = data.replace(/\$CANONICAL_URL/g,
            `https://www.wilderlist.app//summit-view/${lat}/${lng}/${altitude}/${req.params.id}`,
          );
          data = data.replace(/\$OG_IMAGE/g, setMountainOgImageUrl(req.params.id));
          const description = getSummitViewDescription(mtnData);
          const result  = data.replace(/\$OG_DESCRIPTION/g, description);
          res.send(result);
        } else {
          throw new Error('Incorrect Mountain ID ' + req.params.id);
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

    });

  });
  app.get(Routes.CampsiteDetail, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      if (req.params.id === 'search') {
        data = data.replace(/\$OG_TITLE/g, 'Search Campsites - Wilderlist');
        data = data.replace(/\$CANONICAL_URL/g, `https://www.wilderlist.app/campsite/search`);
        data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
        const result  =
          data.replace(/\$OG_DESCRIPTION/g,
            'Search for campsites and find maps, directions, local trails, weather and trip reports.');
        res.send(result);
      } else {
        try {
          const campsiteData = await getCampsite(req.params.id);
          if (campsiteData !== null && campsiteData !== undefined) {
            // replace the special strings with server generated strings
            const formattedType = formatType(campsiteData.type);
            const name = campsiteData.name ? campsiteData.name : upperFirst(formattedType);
            const title = `${name}, ${campsiteData.locationTextShort} - Wilderlist`;
            data = data.replace(/\$OG_TITLE/g, title);
            data = data.replace(/\$CANONICAL_URL/g,
              `https://www.wilderlist.app/campsite/${req.params.id}`,
            );
            data = data.replace(/\$OG_IMAGE/g, setCampsiteOgImageUrl(req.params.id));
            const description = getCampsiteDescription(campsiteData);
            const result  = data.replace(/\$OG_DESCRIPTION/g, description);
            res.send(result);
          } else {
            throw new Error('Incorrect Campsite ID ' + req.params.id);
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

  app.get(Routes.TrailDetail, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      if (req.params.id === 'search') {
        data = data.replace(/\$OG_TITLE/g, 'Search Trails - Wilderlist');
        data = data.replace(/\$CANONICAL_URL/g, `https://www.wilderlist.app/trail/search`);
        data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
        const result  =
          data.replace(/\$OG_DESCRIPTION/g,
            'Search for trails and find maps, directions, local campsites, weather and trip reports.');
        res.send(result);
      } else {
        try {
          const trailData = await getTrail(req.params.id);
          if (trailData !== null && trailData !== undefined) {
            // replace the special strings with server generated strings
            const formattedType = formatType(trailData.type ? trailData.type : 'trail');
            const name = trailData.name ? trailData.name : upperFirst(formattedType);
            const title = `${name}, ${trailData.locationTextShort} - Wilderlist`;
            data = data.replace(/\$OG_TITLE/g, title);
            data = data.replace(/\$CANONICAL_URL/g,
              `https://www.wilderlist.app/trail/${req.params.id}`,
            );
            data = data.replace(/\$OG_IMAGE/g, setTrailOgImageUrl(req.params.id));
            const description = getTrailDescription(trailData as Trail);
            const result  = data.replace(/\$OG_DESCRIPTION/g, description);
            res.send(result);
          } else {
            throw new Error('Incorrect Trail ID ' + req.params.id);
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

  app.get(Routes.AutoRouteDetailParkingToMountain, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      try {
        const mountainId = req.params.mountainId;
        const parkingId = req.params.parkingId;
        const mountainData = await getMountain(mountainId);
        const parkingData = await getParkingData(parkingId);
        if (mountainData !== null && mountainData !== undefined &&
            parkingData !== null && parkingData !== undefined) {
          // replace the special strings with server generated strings
          let destinationName: string;
          const formattedType =
            upperFirst(formatType(parkingData.type ? parkingData.type : ''));
          if (parkingData.name) {
            destinationName = parkingData.name;
          } else {
            destinationName = formattedType;
          }
          const name = mountainData && mountainData.name ? mountainData.name : 'Mountain';
          const title = getAutoRouteTitle(destinationName, name);
          data = data.replace(/\$OG_TITLE/g, title);
          data = data.replace(/\$CANONICAL_URL/g,
            `https://www.wilderlist.app/route-detail/mountain/${mountainId}/start/${parkingId}`,
          );
          data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
          const description = getAutoRouteDescription(destinationName, name);
          const result  = data.replace(/\$OG_DESCRIPTION/g, description);
          res.send(result);
        } else {
          throw new Error('Incorrect value ' + mountainId + ' ' + parkingId);
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

    });

  });

  app.get(Routes.AutoRouteDetailMountainToCampsite, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      try {
        const mountainId = req.params.mountainId;
        const campsiteId = req.params.campsiteId;
        const mountainData = await getMountain(mountainId);
        const campsiteData = await getCampsite(campsiteId);
        if (mountainData !== null && mountainData !== undefined &&
            campsiteData !== null && campsiteData !== undefined) {
          // replace the special strings with server generated strings
          let destinationName: string;
          const formattedType =
            upperFirst(formatType(campsiteData.type ? campsiteData.type : ''));
          if (campsiteData.name) {
            destinationName = campsiteData.name;
          } else {
            destinationName = formattedType;
          }
          const name = mountainData && mountainData.name ? mountainData.name : 'Mountain';
          const title = getAutoRouteTitle(name, destinationName);
          data = data.replace(/\$OG_TITLE/g, title);
          data = data.replace(/\$CANONICAL_URL/g,
            `https://www.wilderlist.app/route-detail/mountain/${mountainId}/campsite/${campsiteId}`,
          );
          data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
          const description = getAutoRouteDescription(name, destinationName);
          const result  = data.replace(/\$OG_DESCRIPTION/g, description);
          res.send(result);
        } else {
          throw new Error('Incorrect value ' + mountainId + ' ' + campsiteId);
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

    });

  });

  app.get(Routes.AutoRouteDetailCampsiteToCampsite, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      try {
        const campsiteId1 = req.params.campsiteId1;
        const campsiteId2 = req.params.campsiteId2;
        const campsite1Data = await getCampsite(campsiteId1);
        const campsite2Data = await getCampsite(campsiteId2);
        if (campsite2Data !== null && campsite2Data !== undefined &&
            campsite1Data !== null && campsite1Data !== undefined) {
          // replace the special strings with server generated strings
          let destinationName: string;
          const destinationType =
            upperFirst(formatType(campsite2Data.type ? campsite2Data.type : ''));
          if (campsite2Data.name) {
            destinationName = campsite2Data.name;
          } else {
            destinationName = destinationType;
          }
          let sourceName: string;
          const sourceType =
            upperFirst(formatType(campsite1Data.type ? campsite1Data.type : ''));
          if (campsite1Data.name) {
            sourceName = campsite1Data.name;
          } else {
            sourceName = sourceType;
          }
          const title = getAutoRouteTitle(sourceName, destinationName);
          data = data.replace(/\$OG_TITLE/g, title);
          data = data.replace(/\$CANONICAL_URL/g,
            `https://www.wilderlist.app/route-detail/campsite/${campsiteId1}/campsite/${campsiteId2}`,
          );
          data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
          const description = getAutoRouteDescription(sourceName, destinationName);
          const result  = data.replace(/\$OG_DESCRIPTION/g, description);
          res.send(result);
        } else {
          throw new Error('Incorrect value ' + campsiteId1 + ' ' + campsiteId2);
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

    });

  });

  app.get(Routes.AutoRouteDetailTrailToMountain, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      try {
        const mountainId = req.params.mountainId;
        const trailId = req.params.trailId;
        const mountainData = await getMountain(mountainId);
        const trailData = await getTrail(trailId);
        if (mountainData !== null && mountainData !== undefined &&
            trailData !== null && trailData !== undefined) {
          // replace the special strings with server generated strings
          let destinationName: string;
          const formattedType =
            upperFirst(formatType(trailData.type ? trailData.type : ''));
          if (trailData.name) {
            destinationName = trailData.name;
          } else {
            destinationName = formattedType;
          }
          const name = mountainData && mountainData.name ? mountainData.name : 'Mountain';
          const title = getAutoRouteTitle(destinationName, name);
          data = data.replace(/\$OG_TITLE/g, title);
          data = data.replace(/\$CANONICAL_URL/g,
            `https://www.wilderlist.app/route-detail/trail/${trailId}/mountain/${mountainId}`,
          );
          data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
          const description = getAutoRouteDescription(destinationName, name);
          const result  = data.replace(/\$OG_DESCRIPTION/g, description);
          res.send(result);
        } else {
          throw new Error('Incorrect value ' + mountainId + ' ' + trailId);
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

    });

  });

  app.get(Routes.AutoRouteDetailTrailToCampsite, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      try {
        const trailId = req.params.trailId;
        const campsiteId = req.params.campsiteId;
        const trailData = await getTrail(trailId);
        const campsiteData = await getCampsite(campsiteId);
        if (trailData !== null && trailData !== undefined &&
            campsiteData !== null && campsiteData !== undefined) {
          // replace the special strings with server generated strings
          let destinationName: string;
          const destinationType =
            upperFirst(formatType(campsiteData.type ? campsiteData.type : ''));
          if (campsiteData.name) {
            destinationName = campsiteData.name;
          } else {
            destinationName = destinationType;
          }
          let sourceName: string;
          const sourceType =
            upperFirst(formatType(trailData.type ? trailData.type : ''));
          if (trailData.name) {
            sourceName = trailData.name;
          } else {
            sourceName = sourceType;
          }
          const title = getAutoRouteTitle(sourceName, destinationName);
          data = data.replace(/\$OG_TITLE/g, title);
          data = data.replace(/\$CANONICAL_URL/g,
            `https://www.wilderlist.app/route-detail/trail/${trailId}/campsite/${campsiteId}`,
          );
          data = data.replace(/\$OG_IMAGE/g, defaultOgImageUrl);
          const description = getAutoRouteDescription(sourceName, destinationName);
          const result  = data.replace(/\$OG_DESCRIPTION/g, description);
          res.send(result);
        } else {
          throw new Error('Incorrect value ' + trailId + ' ' + campsiteId);
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
