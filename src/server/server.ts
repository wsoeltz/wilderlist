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
import facebookAuth from './auth/facebook';
import googleAuth from './auth/google';
import redditAuth from './auth/reddit';
import buildDataloaders from './dataloaders';
import schema from './graphql/schema';
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
import getSitemap from './routing/getSitemap';
import getGridApplication from './utilities/getGridApplication/index';
import getRecreationData from './utilities/getRecreationData';
import getRecreationSiteData from './utilities/getRecreationSiteData';
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

if (process.env.NODE_ENV === 'production') {

  const baseUrl = 'https://www.wilderlist.app';
  const defaultTitle = 'Wilderlist';
  const defaultDescription = 'Track, plan and share your hiking and mountaineering adventures.';

  const path = require('path');

  app.get('/sitemap.xml', async (req, res) => {
    try {
      const result = await getSitemap();
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

  app.get(Routes.Login, (req, res) => {
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
      const result  = data.replace(/\$OG_DESCRIPTION/g, "Read Wilderlist's Terms of Use.");
      res.send(result);
    });

  });

  app.get([
    Routes.ListDetail, Routes.ListsWithDetail,
    ], (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      if (req.params.id === 'search') {
        data = data.replace(/\$OG_TITLE/g, 'Search Hiking Lists - Wilderlist');
        data = data.replace(/\$CANONICAL_URL/g, `https://www.wilderlist.app/list/search`);
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
            const result  = data.replace(/\$OG_DESCRIPTION/g, getListDescription(listData));
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
          const result  = data.replace(/\$OG_DESCRIPTION/g, defaultDescription);
          res.send(result);

        }
      }

    });

  });

  app.get(Routes.ListDetailWithMountainDetail, (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      try {
        const listData = await getListData(req.params.id);
        if (listData !== null) {
          const mtnData = await getMountainData(req.params.mountainId);
          const mtnName = mtnData && mtnData.name ? '/' + mtnData.name : '';
          // replace the special strings with server generated strings
          data = data.replace(/\$OG_TITLE/g,
            `${listData.name + getType(listData.type) + mtnName} - Wilderlist`,
          );
          data = data.replace(/\$CANONICAL_URL/g,
            `https://www.wilderlist.app/list/${req.params.id}`,
          );
          const result  = data.replace(/\$OG_DESCRIPTION/g, getListDescription(listData));
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
        const result  = data.replace(/\$OG_DESCRIPTION/g, defaultDescription);
        res.send(result);

      }

    });

  });

  app.get([
    Routes.MountainSearchWithDetail, Routes.MountainDetail,
    ], (req, res) => {
    const filePath = path.resolve(__dirname, '../../client', 'build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return console.error(err);
      }
      if (req.params.id === 'search') {
        data = data.replace(/\$OG_TITLE/g, 'Search Mountains - Wilderlist');
        data = data.replace(/\$CANONICAL_URL/g, `https://www.wilderlist.app/mountains/search`);
        const result  =
          data.replace(/\$OG_DESCRIPTION/g, 'Search for mountains and find maps, trails, weather and trip reports.');
        res.send(result);
      } else {
        try {
          const mtnData = await getMountainData(req.params.id);
          if (mtnData !== null) {
            const stateData = mtnData.state !== null ?
              await getStateData(mtnData.state as unknown as string) : null;
            const state = stateData && stateData.abbreviation
              ? ` (${stateData.abbreviation})` : '';
            // replace the special strings with server generated strings
            data = data.replace(/\$OG_TITLE/g,
              `${mtnData.name + state} - Wilderlist`,
            );
            data = data.replace(/\$CANONICAL_URL/g,
              `https://www.wilderlist.app/mountain/${req.params.id}`,
            );
            const result  = data.replace(/\$OG_DESCRIPTION/g, getMtnDescription(mtnData, stateData));
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
      const result  = data.replace(/\$OG_DESCRIPTION/g, defaultDescription);
      res.send(result);
    });

  });
}

export default app;
